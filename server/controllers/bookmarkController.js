import Bookmark from "../models/bookmarkModel.js";
import Activity from "../models/activityModel.js";
import Users from "../models/userModel.js";

// GET /api/bookmarks/me — user's bookmarks
export const getMyBookmarks = async (req, res) => {
    try {
        const { itemType } = req.query;
        let query = { userId: req.user._id };
        if (itemType) {
            query.itemType = itemType === 'post' ? 'Post' : (itemType === 'tool' ? 'AiTool' : itemType);
        }

        const bookmarks = await Bookmark.find(query)
            .sort({ createdAt: -1 })
            .populate({
                path: 'itemId',
                select: 'title name summary description category tags url rating upvotes publishedAt createdAt pricing'
            });

        res.status(200).json({ bookmarks });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

// POST /api/bookmarks — add bookmark
export const addBookmark = async (req, res) => {
    try {
        const { itemType, itemId, note } = req.body;
        if (!itemType || !itemId) return res.status(400).json({ errorMessage: "itemType and itemId are required" });

        // Map frontend types to exactly match Mongoose model names
        const mappedItemType = itemType === 'post' ? 'Post' : (itemType === 'tool' ? 'AiTool' : itemType);

        // Check duplicate
        const exists = await Bookmark.findOne({ userId: req.user._id, itemId });
        if (exists) return res.status(400).json({ errorMessage: "Already bookmarked" });

        const bookmark = await Bookmark.create({ userId: req.user._id, itemType: mappedItemType, itemId, note });

        // Award XP + log
        await Users.findByIdAndUpdate(req.user._id, { $inc: { xpPoints: 5 } });
        await Activity.create({
            userId: req.user._id,
            action: 'bookmark_add',
            metadata: { itemType: mappedItemType, itemId },
            xpEarned: 5
        });

        res.status(201).json({ message: "Bookmarked", bookmark });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

// DELETE /api/bookmarks/:id — remove bookmark
export const removeBookmark = async (req, res) => {
    try {
        const bookmark = await Bookmark.findOne({ _id: req.params.id, userId: req.user._id });
        if (!bookmark) return res.status(404).json({ errorMessage: "Bookmark not found" });

        await bookmark.deleteOne();
        await Users.findByIdAndUpdate(req.user._id, { $inc: { xpPoints: -5 } }); // Deduct XP
        await Activity.create({
            userId: req.user._id,
            action: 'bookmark_remove',
            metadata: { bookmarkId: req.params.id },
            xpEarned: -5
        });

        res.status(200).json({ message: "Bookmark removed" });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};

// GET /api/bookmarks/check/:itemId — check if bookmarked
export const checkBookmark = async (req, res) => {
    try {
        const bookmark = await Bookmark.findOne({ userId: req.user._id, itemId: req.params.itemId });
        res.status(200).json({ isBookmarked: !!bookmark, bookmarkId: bookmark?._id });
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
};
