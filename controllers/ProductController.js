// import Category from "../modals/categoryModal.js";
import Product from "../modals/productModal.js";
import { uploadToCloudinary } from "../services/upload/fileUpload.js";

const createProduct = async (req, res) => {
    const { name, categoryId, description, variants } = req.body;
    const { files } = req
    const imageUrls = []
    if (files) {
        const urls = await uploadToCloudinary(files); 
        imageUrls.push(...urls);  
    }

    if (!name || !categoryId || !description || !variants) {
        return res.send(400).json({ message: "All fields are Mandatory" })
    }
    
        const newProduct = new Product({ name, categoryId, description, images:imageUrls, variants });
        await newProduct.save();
       
        res.status(201).json({ message: "Product added successfully", product: newProduct });

    // const category = await Category.findById(categoryId);





    // if (!category) return res.status(404).json({ message: "Category not found" });
    // if (imageUrls) {

    // }

    // res.status(201).json({ message: "Product added successfully" });

}

export { createProduct } 