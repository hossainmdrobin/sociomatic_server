import { Request, Response } from "express";
import Product from "./../../models/products.model";

// Create a product
export const createProduct = async (req: Request, res: Response) => {
  console.log(req.body)
  const images: string[] = [];
  const videos: string[] = [];
  (req.files as Express.Multer.File[])?.forEach(file => {
    if (file.mimetype.startsWith("video")) videos.push(file.path);
    else images.push(file.path);
  });
  try {
    const product = new Product({...req.body, images,videos,uploadedBy:req.user._id, institute:req.user.institute});
    const savedProduct = await product.save();
    res.status(201).json({ success: true, data: savedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create product" });
  }
};

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      keyword,       // keyword search in name or description
      startDate,     // start date filter
      endDate,       // end date filter
      limit = "10",  // pagination limit
      page = "1",    // pagination page
    } = req.query;

    // Build filter object dynamically
    const filter: any = {};

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
    const perPage = parseInt(limit as string, 10) || 10;
    const currentPage = parseInt(page as string, 10) || 1;
    const skip = (currentPage - 1) * perPage;

    // Query products
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage);

    // Count total products for pagination info
    const total = await Product.countDocuments(filter);

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch product" });
  }
};

// Update a product by ID
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
    });

    if (!updatedProduct)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, data: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update product" });
  }
};

// Delete a product by ID
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};