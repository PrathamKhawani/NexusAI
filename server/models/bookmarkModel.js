import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    itemType: { type: String, enum: ['Post', 'AiTool'], required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'itemType' },
    note: { type: String, default: '', maxlength: 200 },
}, { timestamps: true });

// Ensure a user can only bookmark the same item once
bookmarkSchema.index({ userId: 1, itemId: 1 }, { unique: true });

export default mongoose.model("Bookmark", bookmarkSchema, "bookmarks");
