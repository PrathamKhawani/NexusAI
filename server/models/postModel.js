import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    summary: { type: String, required: true, maxlength: 500 },
    content: { type: String, default: '' },
    source: { type: String, default: 'NovaAI' },
    url: { type: String, default: '', unique: true, sparse: true },
    imageUrl: { type: String, default: '' },
    category: {
        type: String,
        enum: ['AI', 'ML', 'Robotics', 'Web3', 'DevTools', 'Research', 'Product', 'General'],
        default: 'General'
    },
    tags: [{ type: String }],
    author: { type: String, default: 'NovaAI Editorial' },
    publishedAt: { type: Date, default: Date.now },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    // who submitted (if user-submitted)
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', default: null },
}, { timestamps: true });

// Full-text search index
postSchema.index({ title: 'text', summary: 'text', tags: 'text' });

export default mongoose.model("Post", postSchema, "ai_posts");
