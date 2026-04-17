"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prompt_controller_1 = require("./../../controllers/promptController/prompt.controller");
const router = express_1.default.Router();
router.post("/", prompt_controller_1.createPrompt);
router.get("/", prompt_controller_1.getPrompts);
router.get("/:id", prompt_controller_1.getPrompt);
router.put("/:id", prompt_controller_1.updatePrompt);
router.delete("/:id", prompt_controller_1.deletePrompt);
exports.default = router;
