import express from "express";
import { addAccount, removeAccount, getAccountsByInstitute } from "../../controllers/accountController/account.controller";
import { authenticateToken } from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/add-account",authenticateToken, addAccount);
router.delete("/remove-account/:id", authenticateToken, removeAccount );
router.get("/get-account",authenticateToken,getAccountsByInstitute)

export default router;
