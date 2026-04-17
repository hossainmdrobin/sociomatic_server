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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePrompt = exports.updatePrompt = exports.getPrompt = exports.getPrompts = exports.createPrompt = void 0;
const prompt_model_1 = require("../../models/prompt.model");
const createPrompt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prompt = yield prompt_model_1.Prompt.create(req.body);
        res.status(201).json({
            success: true,
            data: prompt,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create prompt",
        });
    }
});
exports.createPrompt = createPrompt;
const getPrompts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = "1", limit = "10", business, type } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const filter = {};
        if (business)
            filter.bussiness = business;
        if (type)
            filter.type = type;
        const prompts = yield prompt_model_1.Prompt.find(filter)
            .populate("bussiness", "name")
            .populate("products", "name price images")
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .sort({ createdAt: -1 });
        const total = yield prompt_model_1.Prompt.countDocuments(filter);
        res.json({
            success: true,
            data: prompts,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch prompts",
        });
    }
});
exports.getPrompts = getPrompts;
const getPrompt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const prompt = yield prompt_model_1.Prompt.findById(id)
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch prompt",
        });
    }
});
exports.getPrompt = getPrompt;
const updatePrompt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const prompt = yield prompt_model_1.Prompt.findByIdAndUpdate(id, req.body, {
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update prompt",
        });
    }
});
exports.updatePrompt = updatePrompt;
const deletePrompt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const prompt = yield prompt_model_1.Prompt.findByIdAndDelete(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete prompt",
        });
    }
});
exports.deletePrompt = deletePrompt;
