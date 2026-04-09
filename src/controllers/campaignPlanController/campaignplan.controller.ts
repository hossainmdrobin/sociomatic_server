import { Request, Response } from "express";
import Plan from "./../../models/campaignplan.model";
/* =========================
   CREATE PLAN
========================= */
export const createPlan = async (req: Request, res: Response) => {
    try {
        const { plan } = req.body;

        if (!plan || !Array.isArray(plan)) {
            return res.status(400).json({
                success: false,
                message: "Invalid plan data",
            });
        }

        const newPlan = await Plan.create({ plan });

        res.status(201).json({
            success: true,
            data: newPlan,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* =========================
   GET ALL PLANS
========================= */
export const getAllPlans = async (_req: Request, res: Response) => {
    try {
        const plans = await Plan.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: plans.length,
            data: plans,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* =========================
   GET SINGLE PLAN
========================= */
export const getPlanById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const plan = await Plan.findById(id);

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found",
            });
        }

        res.status(200).json({
            success: true,
            data: plan,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* =========================
   UPDATE PLAN
========================= */
export const updatePlan = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const updatedPlan = await Plan.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedPlan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found",
            });
        }

        res.status(200).json({
            success: true,
            data: updatedPlan,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/* =========================
   DELETE PLAN
========================= */
export const deletePlan = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deleted = await Plan.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Plan not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Plan deleted successfully",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};