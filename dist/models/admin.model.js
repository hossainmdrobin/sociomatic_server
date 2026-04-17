"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const adminSchema = new mongoose_1.default.Schema({
    institute: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Institute", required: true },
    fb_pages: [{ id: String, name: String, picture: String, access_token: String }],
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: Number, required: false },
    otpExpires: { type: Date, required: false },
    isVerified: { type: Boolean, default: false },
    roll: { type: String, enum: ["admin", "user"], default: "admin" },
    accounts: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Account"
        }]
}, {
    timestamps: true
});
exports.Admin = mongoose_1.default.model("Admin", adminSchema);
