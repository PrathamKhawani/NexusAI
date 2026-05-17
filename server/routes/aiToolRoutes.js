import express from "express";
import { getTools, getToolById, createTool, upvoteTool, rateTool, triggerToolsCron } from "../controllers/aiToolController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getTools);
router.get("/cron-update", triggerToolsCron);
router.get("/:id", getToolById);
router.post("/", authMiddleware, createTool);
router.put("/:id/upvote", authMiddleware, upvoteTool);
router.put("/:id/rate", authMiddleware, rateTool);

export default router;
