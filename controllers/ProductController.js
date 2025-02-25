import Product from "../modals/productModal.js";
import { uploadToCloudinary } from "../services/upload/fileUpload.js";

// const createOrUpdateProduct = async (req, res) => {
//     try {
//         const { productId, name, categoryId, description, variants ,benefits} = req.body;
//         const files = req.files;

//         if (!name || !categoryId || !description || !variants) {
//             return res.status(400).json({ message: "All fields are mandatory" });
//         }

//         let imageUrl = "";
//         let otherImageUrls = [];

//         // Upload images in parallel using Promise.all
//         const uploadPromises = [];


//         if (files?.coverImage) {
//             uploadPromises.push(uploadToCloudinary(files.coverImage).then(urls => imageUrl = urls[0]));
//         }

//         if (files?.images) {
//             uploadPromises.push(uploadToCloudinary(files?.images).then(urls => otherImageUrls = urls));
//         }

//         await Promise.all(uploadPromises);

//         let product;
//         if (productId) {
//             // Fetch product only if it exists
//             product = await Product.findById(productId);
//             if (!product) {
//                 return res.status(404).json({ message: "Product not found" });
//             }

//             // Update only the necessary fields
//             product.name = name;
//             product.categoryId = categoryId;
//             product.description = description;
//             product.variants = variants;
//             product.benefits=benefits
//             if (imageUrl) product.images = imageUrl;
//             if (otherImageUrls.length) product.otherImages.push(...otherImageUrls);

//             await product.save();
//             return res.status(200).json({ message: "Product updated successfully", product });
//         } 

//         // Create a new product if productId is not provided
//         product = new Product({
//             name,
//             categoryId,
//             description,
//             images: imageUrl,
//             otherImages: otherImageUrls,
//             variants,
//             benefits
//         });

//         await product.save();
//         return res.status(201).json({ message: "Product added successfully", product });

//     } catch (error) {
//         console.error("Error creating/updating product:", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// };

const createOrUpdateProduct = async (req, res) => {
    try {
        const { productId, name, categoryId, description, variants, benefits } = req.body;
        const files = req.files;

        if (!name || !categoryId || !description || !variants) {
            return res.status(400).json({ message: "All fields are mandatory" });
        }

        let imageUrl = "";
        let otherImageUrls = [];

        // Upload images in parallel using Promise.all
        const uploadPromises = [];

        if (files?.coverImage) {
            uploadPromises.push(uploadToCloudinary(files.coverImage).then(urls => imageUrl = urls[0]));
        }

        if (files?.images) {
            uploadPromises.push(uploadToCloudinary(files.images).then(urls => otherImageUrls = urls));
        }

        await Promise.all(uploadPromises);

        let product;
        if (productId) {
            // Fetch existing product
            product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            // Update only the necessary fields
            product.name = name;
            product.categoryId = categoryId;
            product.description = description;
            product.variants = variants;
            product.benefits = benefits;

            // Ensure the cover image is updated
            if (imageUrl) product.images = imageUrl;

            // Update other images: Replace instead of appending
            if (otherImageUrls.length) {
                product.otherImages = otherImageUrls; // Replace instead of push
            }

            await product.save();
            return res.status(200).json({ message: "Product updated successfully", product });
        }

        // Create a new product if no productId is provided
        product = new Product({
            name,
            categoryId,
            description,
            images: imageUrl,
            otherImages: otherImageUrls,
            variants,
            benefits
        });

        await product.save();
        return res.status(201).json({ message: "Product added successfully", product });

    } catch (error) {
        console.error("Error creating/updating product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const getAllProducts = async (req, res) => {
    try {
        const { categoryId, page = 1, pageSize = 10 } = req.query;

        // Convert page and pageSize to numbers
        const pageNumber = parseInt(page, 10);
        const limit = parseInt(pageSize, 10);
        const skip = (pageNumber - 1) * limit;

        // Build the filter object
        const filter = categoryId ? { categoryId } : {};

        // Fetch products with filtering, pagination, and sorting by totalSold
        const products = await Product.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ totalSold: -1 }); // Sorting by totalSold in descending order

        // Fetch top 3 products based on totalSold
        const topProducts = await Product.find(filter)
            .sort({ totalSold: -1 })
            .limit(3); // Top 3 products based on totalSold

        // Get total product count for pagination
        const totalProducts = await Product.countDocuments(filter);

        return res.status(200).json({
            success: true,
            products,
            topProducts, // Include top 3 products
            page: pageNumber,
            pageSize: limit,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



/**
 * @desc Get product by ID
 */
const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId).populate("categoryId");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ product });
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

/**
 * @desc Delete product
 */
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.isDisabled) {
            return res.status(400).json({ message: "product is already deleted" })
        }

        product.isDisabled = true;
        product.deletedAt = new Date();
        await product.save();

        return res.status(200).json({ message: "Product soft deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
const getProductByCategory = async (req, res) => {
    try {
        const { categoryId, page = 1, limit = 10 } = req.query;
        let query = {};

        // Add category filter if provided
        if (categoryId) {
            query.categoryId = categoryId;
        }

        // Convert page and limit to numbers

        const pageNumber = parseInt(page, 10);
        // const limit = parseInt(pageSize, 10);
        const skip = (pageNumber - 1) * limit;

        const filter = categoryId ? { categoryId, isDisabled: false } : { isDisabled: false };

        // Fetch filtered products with pagination
        // const products = await Product.find(query)
        //     .skip((pageNumber - 1) * limitNumber)
        //     .limit(limitNumber);
        const products = await Product.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ totalSold: -1 }); // Sorting by totalSold in descending order

        // Fetch top 3 products based on totalSold
        const topProducts = await Product.find(filter)
            .sort({ totalSold: -1 })
            .limit(3); // Top 3 products based on totalSold

        // Get total count for pagination metadata
        const totalProducts = await Product.countDocuments(query);

        return res.status(200).json({
            success: true,
            products,
            topProducts,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const disableProduct=async(req,res)=>{
    try {
        const { productId } = req.params;
        const{status}=req.body
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // if (product.isDisabled) {
        //     return res.status(400).json({ message: "product is already deleted" })
        // }

        product.isDisabled = status;
        product.deletedAt = new Date();
        await product.save();

        return res.status(200).json({ message: "Product soft deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const disabledProducts=async(req,res)=>{
    try {
        const {  page = 1, pageSize = 10 } = req.query;

        // Convert page and pageSize to numbers
        const pageNumber = parseInt(page, 10);
        const limit = parseInt(pageSize, 10);
        const skip = (pageNumber - 1) * limit;

        // Build the filter object
       

        const products = await Product.find({isDisabled:true})
            .skip(skip)
            .limit(limit)
            .sort({ totalSold: -1 }); // Sorting by totalSold in descending order

        // Fetch top 3 products based on totalSold
 console.log('products', products)

        // Get total product count for pagination
        const totalProducts = await Product.countDocuments()

        return res.status(200).json({
            success: true,
            products,
         
            page: pageNumber,
            pageSize: limit,
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// // Example: Fetching available products
// const availableProducts = await Product.find({ isDisabled: false });

// // Example: fetching all products including deleted ones.
// const allProducts = await Product.find();

// // Example: fetching only deleted products.
// const deletedProducts = await Product.find({isDisabled:true});


export { createOrUpdateProduct, getAllProducts, getProductById, deleteProduct, getProductByCategory ,disableProduct,disabledProducts};