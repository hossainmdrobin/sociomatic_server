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
exports.updateNotication = exports.getNotication = void 0;
const notification_model_1 = require("./../../models/notification.model");
const getNotication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = req.user.roll == "admin" ? req.user._id : req.user.admin;
    try {
        const notifications = yield notification_model_1.Notificaiton.find({ admin }).sort({ createdAt: -1 }).lean();
        res.status(200).json({ message: "Notifications fetched successfully", success: true, data: notifications });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server error", success: false, error: e });
    }
});
exports.getNotication = getNotication;
const updateNotication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: "Update Successful", success: true, data: {} });
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "" });
    }
});
exports.updateNotication = updateNotication;
