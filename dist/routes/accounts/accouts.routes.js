"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_controller_1 = require("../../controllers/accountController/account.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = express_1.default.Router();
// router.post("/send-otp", (req, res) => {});
// router.post("change-password", (req, res) => {});
router.post("/add-account", auth_middleware_1.authenticateToken, account_controller_1.addAccount);
router.delete("/remove-account/:id", auth_middleware_1.authenticateToken, account_controller_1.removeAccount);
exports.default = router;
