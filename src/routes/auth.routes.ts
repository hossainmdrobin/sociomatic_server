import express from "express";
import { signup, verifyOTP } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);

export default router;
