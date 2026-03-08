import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "controllers/productController/product.controller";
import { Router } from "express";
import { authenticateToken } from "middleware/auth.middleware";

const router = Router();

// CRUD routes
router.post("/",authenticateToken, createProduct); // create product
router.get("/",authenticateToken, getProducts); // get all products
router.get("/:id",authenticateToken, getProductById); // get product by ID
router.put("/:id",authenticateToken, updateProduct); // update product
router.delete("/:id",authenticateToken, deleteProduct); // delete product

export default router;