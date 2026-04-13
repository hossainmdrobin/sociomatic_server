import express from "express";
import { signup, verifyOTP,loginWithEmail, getUserInfo, updateUserInfo, getPages } from "../controllers/auth.controller";
import { authenticateToken } from "./../middleware/auth.middleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyOTP);
router.post("/login",loginWithEmail);
router.get("/get-user-info",authenticateToken,getUserInfo);
router.put("/update",authenticateToken,updateUserInfo);
router.get("/fb_pages",authenticateToken,getPages);
// router.post("/send-otp", (req, res) => {});
// router.post("change-password", (req, res) => {});


export default router;
