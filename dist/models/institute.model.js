"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Institute = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const instituteSchema = new mongoose_1.default.Schema({
    name: { type: String },
    slogan: { type: String },
    description: { type: String },
    logo: { type: String },
    website: { type: String },
    fb_pages: [{ id: String, name: String, picture: String, access_token: String }],
    type: { type: String },
    no_of_account: { type: Number, default: 0 },
    no_of_member: { type: Number, default: 1 },
    no_of_month_post: { type: Number, default: 0 }
}, {
    timestamps: true
});
exports.Institute = mongoose_1.default.model("Institute", instituteSchema);
