import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    action: {
        type: String,
        enum: [
            'login', 'logout', 'register',
            'view_post', 'view_tool', 'bookmark_add', 'bookmark_remove',
            'tool_add', 'tool_rate', 'post_view', 'profile_update',
            'search', 'upvote_tool'
        ],
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    xpEarned: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
}, { timestamps: false });

// Index for fast per-user queries, sorted by time
activitySchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model("Activity", activitySchema, "user_activity");
