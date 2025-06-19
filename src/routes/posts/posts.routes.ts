import express from "express";
import { authenticateToken } from "../../middleware/auth.middleware";

const router = express.Router();

// router.post("/send-otp", (req, res) => {});
// router.post("change-password", (req, res) => {});
// router.post("/add-account",authenticateToken, addAccount);
// router.delete("/remove-account/:id", authenticateToken, removeAccount );

router.get("get-posts",authenticateToken);
router.post("add-post",authenticateToken)

export default router;
