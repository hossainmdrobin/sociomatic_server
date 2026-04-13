import { authenticateToken } from "./../../middleware/auth.middleware";
import { createInstitute, deleteInstitute, getInstitute, getInstitutes, updateInstitute } from "./../../controllers/instituteController/institute.controller";
import express from "express";


const router = express.Router();

router.post("/", createInstitute);
router.get("/", getInstitutes);
router.put("/", authenticateToken, updateInstitute);
router.get("/:id", getInstitute);
router.delete("/:id", deleteInstitute);

export default router;