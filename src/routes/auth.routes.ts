import express from "express";
import { signup, verifyOTP,loginWithEmail } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyOTP);
router.post("/login",loginWithEmail);
// router.post("/send-otp", (req, res) => {});
// router.post("change-password", (req, res) => {});


export default router;
