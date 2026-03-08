import express from "express";
import {
  createPrompt,
  getPrompts,
  getPrompt,
  updatePrompt,
  deletePrompt,
} from "./../../controllers/promptController/prompt.controller";

const router = express.Router();

router.post("/", createPrompt);
router.get("/", getPrompts);
router.get("/:id", getPrompt);
router.put("/:id", updatePrompt);
router.delete("/:id", deletePrompt);

export default router;