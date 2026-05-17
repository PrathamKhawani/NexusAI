import Activity from "../models/activityModel.js";

// GET /api/activity/me — current user's activity log
export const getMyActivity = async (req, res) => {
    try {
        const { limit = 20 } = req.query;
        const activities = await Activity.find({ userId: req.user._id })
            .sort({ timestamp: -1 })
            .limit(Number(limit));
        res.status(200).json({ activities });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

// POST /api/activity — log an activity (internal, auth required)
export const logActivity = async (req, res) => {
    try {
        const { action, metadata, xpEarned } = req.body;
        if (!action) return res.status(400).json({ errorMessage: "Action is required" });

        const activity = await Activity.create({
            userId: req.user._id,
            action,
            metadata: metadata || {},
            xpEarned: xpEarned || 0,
        });

        res.status(201).json({ activity });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

// GET /api/activity/stats — user's stats
export const getActivityStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const total = await Activity.countDocuments({ userId });
        const byAction = await Activity.aggregate([
            { $match: { userId } },
            { $group: { _id: "$action", count: { $sum: 1 }, xpTotal: { $sum: "$xpEarned" } } }
        ]);
        res.status(200).json({ total, byAction });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};
