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
exports.deleteInstitute = exports.updateInstitute = exports.getInstitute = exports.getInstitutes = exports.createInstitute = void 0;
const institute_model_1 = require("./../../models/institute.model");
const createInstitute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, slogan, description, type } = req.body;
        const institute = yield institute_model_1.Institute.create({
            name,
            slogan,
            description,
            type,
        });
        res.status(201).json({
            success: true,
            data: institute,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create institute",
        });
    }
});
exports.createInstitute = createInstitute;
const getInstitutes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = "1", limit = "10", keyword = "" } = req.query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const filter = {};
        if (keyword) {
            filter.$or = [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { slogan: { $regex: keyword, $options: "i" } },
            ];
        }
        const institutes = yield institute_model_1.Institute.find(filter)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .sort({ createdAt: -1 });
        const total = yield institute_model_1.Institute.countDocuments(filter);
        res.json({
            success: true,
            data: institutes,
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
            message: "Failed to fetch institutes",
        });
    }
});
exports.getInstitutes = getInstitutes;
const getInstitute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const institute = yield institute_model_1.Institute.findById(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch institute",
        });
    }
});
exports.getInstitute = getInstitute;
const updateInstitute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { institute } = req.user;
        const updatedInstitute = yield institute_model_1.Institute.findByIdAndUpdate(institute, req.body, {
            new: true,
        });
        if (!updatedInstitute) {
            return res.status(404).json({
                success: false,
                message: "Institute not found",
            });
        }
        res.json({
            success: true,
            data: institute,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update institute",
        });
    }
});
exports.updateInstitute = updateInstitute;
const deleteInstitute = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const institute = yield institute_model_1.Institute.findByIdAndDelete(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete institute",
        });
    }
});
exports.deleteInstitute = deleteInstitute;
