import { createUpdateCategory, deleteCategory, getAllCategories, getCategoriesById } from "../controllers/CategoryController.js";

import express from "express"

const categoryRouter = new express.Router();


categoryRouter.post("/category/createUpdate",createUpdateCategory)
categoryRouter.get("/category/all", getAllCategories)


categoryRouter.get("/category/:id", getCategoriesById)

categoryRouter.delete("/category/:id", deleteCategory)

export default categoryRouter
