const Tweet = require("../models/Tweet");
const User = require("../models/User");

exports.likeTweet = async (req, res) => {
    try {
        const { tweetId } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!tweetId) {
            return res.status(400).json({
                success: false,
                message: "Tweet ID is required.",
            });
        }

        // Check if the tweet exists
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            return res.status(404).json({
                success: false,
                message: "Tweet not found.",
            });
        }

        // Check if the user already liked the tweet
        if (tweet.likes.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "You have already liked this tweet.",
            });
        }

        // Add the user's ID to the likes array of the tweet
        tweet.likes.push(userId);
        await tweet.save();

        // Update the user's likes array
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { likes: tweetId } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Tweet liked successfully.",
            data: user,
        });
    } 
    catch (err) {
        console.error("Error liking tweet:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while liking tweet.",
        });
    }
};


exports.unlikeTweet = async (req, res) => {
    try {
        const { tweetId } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!tweetId) {
            return res.status(400).json({
                success: false,
                message: "Tweet ID is required.",
            });
        }

        // Check if the tweet exists
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            return res.status(404).json({
                success: false,
                message: "Tweet not found.",
            });
        }

        // Check if the user has liked the tweet
        if (!tweet.likes.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "You have not liked this tweet.",
            });
        }

        // Remove the user's ID from the likes array of the tweet
        tweet.likes = tweet.likes.filter(id => id !== userId);
        await tweet.save();

        // Update the user's likes array
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { likes: tweetId } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Tweet unliked successfully.",
            data: user,
        });
    } catch (err) {
        console.error("Error unliking tweet:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while unliking tweet.",
        });
    }
};


exports.getLikesByTweet = async (req, res) => {
    try {
        const { tweetId } = req.body;

        // Validate input
        if (!tweetId) {
            return res.status(400).json({
                success: false,
                message: "Tweet ID is required.",
            });
        }

        // Find the tweet
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            return res.status(404).json({
                success: false,
                message: "Tweet not found.",
            });
        }

        // Populate the likes array in the tweet model to get user details
        await tweet.populate("likes", "username email firstName lastName").execPopulate();

        return res.status(200).json({
            success: true,
            message: "Likes retrieved successfully.",
            data: tweet.likes,
        });
    } catch (err) {
        console.error("Error fetching likes by tweet:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching likes by tweet.",
        });
    }
};
