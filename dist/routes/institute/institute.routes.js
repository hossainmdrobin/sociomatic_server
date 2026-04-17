"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("./../../middleware/auth.middleware");
const institute_controller_1 = require("./../../controllers/instituteController/institute.controller");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/", institute_controller_1.createInstitute);
router.get("/", institute_controller_1.getInstitutes);
router.put("/", auth_middleware_1.authenticateToken, institute_controller_1.updateInstitute);
router.get("/:id", institute_controller_1.getInstitute);
router.delete("/:id", institute_controller_1.deleteInstitute);
exports.default = router;
