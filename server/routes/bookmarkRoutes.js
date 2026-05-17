import express from "express";
import { getMyBookmarks, addBookmark, removeBookmark, checkBookmark } from "../controllers/bookmarkController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMyBookmarks);
router.get("/check/:itemId", authMiddleware, checkBookmark);
router.post("/", authMiddleware, addBookmark);
router.delete("/:id", authMiddleware, removeBookmark);

export default router;
