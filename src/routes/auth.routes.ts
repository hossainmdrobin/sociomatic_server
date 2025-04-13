import express from "express";
import { signup, verifyOTP,loginWithEmail } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login",loginWithEmail);

export default router;
