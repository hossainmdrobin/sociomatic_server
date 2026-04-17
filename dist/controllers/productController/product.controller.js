"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const products_model_1 = __importDefault(require("./../../models/products.model"));
// Create a product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(req.body);
    const images = [];
    const videos = [];
    (_a = req.files) === null || _a === void 0 ? void 0 : _a.forEach(file => {
        if (file.mimetype.startsWith("video"))
            videos.push(file.path);
        else
            images.push(file.path);
    });
    try {
        const product = new products_model_1.default(Object.assign(Object.assign({}, req.body), { images, videos, uploadedBy: req.user._id, institute: req.user.institute }));
        const savedProduct = yield product.save();
        res.status(201).json({ success: true, data: savedProduct });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to create product" });
    }
});
exports.createProduct = createProduct;
// Get all products
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword, // keyword search in name or description
        startDate, // start date filter
        endDate, // end date filter
        limit = "10", // pagination limit
        page = "1", // pagination page
         } = req.query;
        // Build filter object dynamically
        const filter = {};
        // Keyword search in name or description (case-insensitive)
        if (keyword && typeof keyword === "string") {
            filter.$or = [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ];
        }
        // Filter by date range
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate && typeof startDate === "string") {
                filter.createdAt.$gte = new Date(startDate);
            }
            if (endDate && typeof endDate === "string") {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // include full end day
                filter.createdAt.$lte = end;
            }
        }
        // Pagination
        const perPage = parseInt(limit, 10) || 10;
        const currentPage = parseInt(page, 10) || 1;
        const skip = (currentPage - 1) * perPage;
        // Query products
        const products = yield products_model_1.default.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(perPage);
        // Count total products for pagination info
        const total = yield products_model_1.default.countDocuments(filter);
        res.json({
            success: true,
            data: products,
            pagination: {
                total,
                page: currentPage,
                limit: perPage,
                totalPages: Math.ceil(total / perPage),
            },
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch products" });
    }
});
exports.getProducts = getProducts;
// Get a single product by ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield products_model_1.default.findById(req.params.id);
        if (!product)
            return res.status(404).json({ success: false, message: "Product not found" });
        res.json({ success: true, data: product });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch product" });
    }
});
exports.getProductById = getProductById;
// Update a product by ID
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedProduct = yield products_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // return the updated document
        });
        if (!updatedProduct)
            return res.status(404).json({ success: false, message: "Product not found" });
        res.json({ success: true, data: updatedProduct });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update product" });
    }
});
exports.updateProduct = updateProduct;
// Delete a product by ID
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedProduct = yield products_model_1.default.findByIdAndDelete(req.params.id);
        if (!deletedProduct)
            return res.status(404).json({ success: false, message: "Product not found" });
        res.json({ success: true, message: "Product deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to delete product" });
    }
});
exports.deleteProduct = deleteProduct;
