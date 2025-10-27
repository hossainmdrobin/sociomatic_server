"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("./../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/signup", auth_controller_1.signup);
router.post("/verify-email", auth_controller_1.verifyOTP);
router.post("/login", auth_controller_1.loginWithEmail);
router.get("/get-user-info", auth_middleware_1.authenticateToken, auth_controller_1.getUserInfo);
// router.post("/send-otp", (req, res) => {});
// router.post("change-password", (req, res) => {});
exports.default = router;
