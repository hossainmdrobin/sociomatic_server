import { Request, Response } from "express";
import { Prompt } from "../../models/prompt.model";

export const createPrompt = async (req: Request, res: Response) => {
    try {
        const prompt = await Prompt.create(req.body);

        res.status(201).json({
            success: true,
            data: prompt,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create prompt",
        });
    }
};

export const getPrompts = async (req: Request, res: Response) => {
    try {
        const { page = "1", limit = "10", business, type } = req.query;

        const pageNumber = parseInt(page as string);
        const limitNumber = parseInt(limit as string);

        const filter: any = {};

        if (business) filter.bussiness = business;
        if (type) filter.type = type;

        const prompts = await Prompt.find(filter)
            .populate("bussiness", "name")
            .populate("products", "name price images")
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .sort({ createdAt: -1 });

        const total = await Prompt.countDocuments(filter);

        res.json({
            success: true,
            data: prompts,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch prompts",
        });
    }
};

export const getPrompt = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const prompt = await Prompt.findById(id)
            .populate("bussiness", "name")
            .populate("products", "name price images");

        if (!prompt) {
            return res.status(404).json({
                success: false,
                message: "Prompt not found",
            });
        }

        res.json({
            success: true,
            data: prompt,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch prompt",
        });
    }
};

export const updatePrompt = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const prompt = await Prompt.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!prompt) {
            return res.status(404).json({
                success: false,
                message: "Prompt not found",
            });
        }

        res.json({
            success: true,
            data: prompt,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update prompt",
        });
    }
};

export const deletePrompt = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const prompt = await Prompt.findByIdAndDelete(id);

        if (!prompt) {
            return res.status(404).json({
                success: false,
                message: "Prompt not found",
            });
        }

        res.json({
            success: true,
            message: "Prompt deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete prompt",
        });
    }
};