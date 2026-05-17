import Users from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Activity from "../models/activityModel.js";
import Bookmark from "../models/bookmarkModel.js";
import AiTool from "../models/aiToolModel.js";


// Register User
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ errorMessage: "Please fill all the fields" });
        }

        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ errorMessage: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await Users.create({ name, email, password: hashedPassword });
        res.status(200).json({ message: "User registered successfully", userId: user._id });
    }
    catch (error) {
        res.status(500).json({ errorMessage: error.message })
    }
}

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ errorMessage: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errorMessage: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        res.status(500).json({ errorMessage: error.message })
    }
}

// Get Profile
export const getMe = async (req, res) => {
    try {
        // Deterministically calculate XP based on true DB state (as requested by user)
        const bookmarkCount = await Bookmark.countDocuments({ userId: req.user._id });

        const calculatedXp = (bookmarkCount * 5);
        
        // Ensure it doesn't drop below 0
        req.user.xpPoints = Math.max(0, calculatedXp);
        await req.user.save();

        res.status(200).json({ user: req.user });
    }
    catch (error) {
        res.status(500).json({ errorMessage: error.message })
    }
}

// Update Profile
export const updateProfile = async (req, res) => {
    try {
        const updatedUser = await Users.findByIdAndUpdate(
            req.user._id,
            { $set: req.body },
            { new: true }
        ).select("-password");
        res.status(200).json({ user: updatedUser });
    }
    catch (error) {
        res.status(500).json({ errorMessage: error.message })
    }
}

// Logout User
export const logoutUser = async (req, res) => {
    try {
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        res.status(500).json({ errorMessage: error.message })
    }
}