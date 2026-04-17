"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notificaiton = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    admin: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Admin", required: true },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Admin" }, // user who receives the notif
    title: String,
    message: String,
    action: String, // e.g., "OPEN_POST", "FOLLOW_USER"
    link: String, // URL or app route
    read: { type: Boolean, default: false },
    createdAt: Date,
}, {
    timestamps: true
});
exports.Notificaiton = mongoose_1.default.model("Notificaiton", notificationSchema);
