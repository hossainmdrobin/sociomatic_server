"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productInputSchema = void 0;
const zod_1 = require("zod");
exports.productInputSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    instituteId: zod_1.z.string(),
    uploadedBy: zod_1.z.string(),
});
