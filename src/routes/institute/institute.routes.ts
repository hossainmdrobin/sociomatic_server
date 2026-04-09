import { createInstitute, deleteInstitute, getInstitute, getInstitutes, updateInstitute } from "./../../controllers/instituteController/institute.controller";
import express from "express";


const router = express.Router();

router.post("/", createInstitute);
router.get("/", getInstitutes);
router.get("/:id", getInstitute);
router.put("/:id", updateInstitute);
router.delete("/:id", deleteInstitute);

export default router;