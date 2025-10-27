"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const accountSchema = new mongoose_1.default.Schema({
    socialId: { type: String, required: true },
    name: { type: String, required: true },
    photo: { type: String, required: false },
    token: { type: String, required: true },
    platform: { type: String, required: true, enum: ["facebook", "x", "youtube", "tiktok", "pinterest"] },
    accountType: { type: String, required: true, enum: ["page", "profile"] },
    tokenExpires: { type: Date, required: false },
    addedBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Admin", required: true }, // generated from jwt token
}, {
    timestamps: true
});
exports.Account = mongoose_1.default.model("Account", accountSchema);
