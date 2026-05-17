import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
    // AI Platform profile fields
    bio: { type: String, default: '', maxlength: 300 },
    avatar: { type: String, default: '' }, // URL or initials key
    skills: [{ type: String }],
    xpPoints: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastLogin: { type: Date, default: null },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    twitterUrl: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model("Users", userSchema, "auth_users");