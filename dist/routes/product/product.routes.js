"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_controller_1 = require("../../controllers/productController/product.controller");
const express_1 = require("express");
const auth_middleware_1 = require("./../../middleware/auth.middleware");
const uploads_1 = require("./../../middleware/uploads");
const router = (0, express_1.Router)();
// CRUD routes
router.post("/", auth_middleware_1.authenticateToken, uploads_1.upload.array("files", 10), product_controller_1.createProduct); // create product
router.get("/", auth_middleware_1.authenticateToken, product_controller_1.getProducts); // get all products
router.get("/:id", auth_middleware_1.authenticateToken, product_controller_1.getProductById); // get product by ID
router.put("/:id", auth_middleware_1.authenticateToken, product_controller_1.updateProduct); // update product
router.delete("/:id", auth_middleware_1.authenticateToken, product_controller_1.deleteProduct); // delete product
exports.default = router;
