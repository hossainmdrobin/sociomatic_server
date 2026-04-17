"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prompt = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const promptSchema = new mongoose_1.default.Schema({
    bussiness: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "Institute",
    },
    type: { type: String },
    tone: { type: String },
    length: { type: String },
    language: { type: String },
    products: [{ type: mongoose_1.default.Types.ObjectId, ref: "Product" }],
    description: { type: String },
    image: { type: Boolean },
    imageType: { type: String },
    imageSize: { type: String },
}, {
    timestamps: true,
});
exports.Prompt = mongoose_1.default.model("Prompt", promptSchema);
