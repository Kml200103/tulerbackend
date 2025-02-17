

// Get all categories

import Category from "../modals/categoryModal.js";
import Product from "../modals/productModal.js";

// const getAllCategories = async (req, res) => {
//     try {
//         const categories = await Category.find();
//         res.status(200).json({ success: true, categories });
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// }

const getAllCategories = async (req, res) => {
    
        try {
          // Fetch all categories
          const categories = await Category.find();
      
          // Create an array to hold category product counts
          const categoriesWithCounts = await Promise.all(
            categories.map(async (category) => {
              const productCount = await Product.countDocuments({
                categoryId: category._id,
              });
              return {
                id: category._id,
                name: category.name,
                productCount: productCount,
              };
            })
          );
      
          res.status(200).json({ success: true, categories: categoriesWithCounts });
        } catch (error) {
          res.status(500).json({ success: false, error: error.message });
        }
      
      
}

const getCategoriesById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, category });
    } catch (error) {
        if (error.kind === "ObjectId") {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(500).json({ success: false, error: error.message });
    }
}

// Create or Update Category 
const createUpdateCategory = async (req, res) => {
    try {
        const { _id, name } = req.body; // Include _id for updates

        if (!name) {
            return res.status(400).json({ success: false, message: "Name is required" });
        }

        if (_id) {
            const updatedCategory = await Category.findByIdAndUpdate(
                _id,
                { name },
                { new: true, runValidators: true }
            );

            if (!updatedCategory) {
                return res.status(404).json({ success: false, message: "Category not found" });
            }

            return res.status(200).json({ success: true, message: "Category updated successfully", updatedCategory });
        } else {
            const newCategory = new Category({ name });
            const savedCategory = await newCategory.save();
            return res.status(201).json({ success: true, message: "Category added successfully", newCategory: savedCategory });
        }
    } catch (error) {
        if (error.code === 11000 && error.name === 'MongoServerError') { // Duplicate key error
            return res.status(400).json({ success: false, message: 'Category name already exists' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
}


// Delete a category
const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        res.status(200).json({ success: true, message: "Category deleted" });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
}

export { getAllCategories, getCategoriesById, createUpdateCategory, deleteCategory }