import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, maxlength: 300 },
    createdAt: { type: Date, default: Date.now }
});

const aiToolSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, maxlength: 600 },
    category: {
        type: String,
        enum: ['LLM', 'Image Gen', 'Code', 'Voice', 'Data', 'Productivity', 'Video', 'Research', 'DevTools', 'Other'],
        default: 'Other'
    },
    url: { type: String, required: true, unique: true },
    logoUrl: { type: String, default: '' },
    tags: [{ type: String }],
    pricing: { type: String, enum: ['Free', 'Freemium', 'Paid', 'Open Source'], default: 'Freemium' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    reviews: [reviewSchema],
    isVerified: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', default: null },
    upvotes: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
}, { timestamps: true });

aiToolSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model("AiTool", aiToolSchema, "ai_tools");
