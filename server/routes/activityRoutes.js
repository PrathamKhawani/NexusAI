import express from "express";
import { getMyActivity, logActivity, getActivityStats } from "../controllers/activityController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMyActivity);
router.get("/stats", authMiddleware, getActivityStats);
router.post("/", authMiddleware, logActivity);

export default router;
