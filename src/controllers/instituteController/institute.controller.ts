import { Request, Response } from "express";
import { Institute } from "./../../models/institute.model";

export const createInstitute = async (req: Request, res: Response) => {
  try {
    const { name, slogan, description, type } = req.body;

    const institute = await Institute.create({
      name,
      slogan,
      description,
      type,
    });

    res.status(201).json({
      success: true,
      data: institute,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create institute",
    });
  }
};

export const getInstitutes = async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10", keyword = "" } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    const filter: any = {};

    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { slogan: { $regex: keyword, $options: "i" } },
      ];
    }

    const institutes = await Institute.find(filter)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const total = await Institute.countDocuments(filter);

    res.json({
      success: true,
      data: institutes,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch institutes",
    });
  }
};

export const getInstitute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const institute = await Institute.findById(id);

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: "Institute not found",
      });
    }

    res.json({
      success: true,
      data: institute,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch institute",
    });
  }
};

export const updateInstitute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const institute = await Institute.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: "Institute not found",
      });
    }

    res.json({
      success: true,
      data: institute,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update institute",
    });
  }
};

export const deleteInstitute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const institute = await Institute.findByIdAndDelete(id);

    if (!institute) {
      return res.status(404).json({
        success: false,
        message: "Institute not found",
      });
    }

    res.json({
      success: true,
      message: "Institute deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete institute",
    });
  }
};