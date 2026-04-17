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
exports.deletePlan = exports.updatePlan = exports.getPlanById = exports.getAllPlans = exports.createPlan = void 0;
const campaignplan_model_1 = __importDefault(require("./../../models/campaignplan.model"));
/* =========================
   CREATE PLAN
========================= */
const createPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { plan } = req.body;
        if (!plan || !Array.isArray(plan)) {
            return res.status(400).json({
                success: false,
                message: "Invalid plan data",
            });
        }
        const newPlan = yield campaignplan_model_1.default.create({ plan });
        res.status(201).json({
            success: true,
            data: newPlan,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.createPlan = createPlan;
/* =========================
   GET ALL PLANS
========================= */
const getAllPlans = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plans = yield campaignplan_model_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: plans.length,
            data: plans,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getAllPlans = getAllPlans;
/* =========================
   GET SINGLE PLAN
========================= */
const getPlanById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const plan = yield campaignplan_model_1.default.findById(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.getPlanById = getPlanById;
/* =========================
   UPDATE PLAN
========================= */
const updatePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedPlan = yield campaignplan_model_1.default.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.updatePlan = updatePlan;
/* =========================
   DELETE PLAN
========================= */
const deletePlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield campaignplan_model_1.default.findByIdAndDelete(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
exports.deletePlan = deletePlan;
