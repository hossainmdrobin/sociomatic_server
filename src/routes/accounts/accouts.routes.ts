import express from "express";
import { addAccount, removeAccount } from "../../controllers/accountController/account.controller";
import { authenticateToken } from "../../middleware/auth.middleware";

const router = express.Router();

// router.post("/send-otp", (req, res) => {});
// router.post("change-password", (req, res) => {});
router.post("/add-account",authenticateToken, addAccount);
router.delete("/remove-account/:id", authenticateToken, removeAccount );

export default router;
