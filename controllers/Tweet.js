const Tweet = require("../models/Tweet");
const User = require("../models/User");
const Comment = require("../models/Comment");

// Controller function to create a new tweet
exports.createTweet = async (req, res) => {
    try {
        const { content } = req.body;

        const userId = req.user.id;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        // Create the new tweet
        const newTweet = await Tweet.create({ 
            content, 
            author: userId 
        });

        // Update the user model to include the tweet ID
        user.tweets.push(newTweet._id);
        await user.save();

        // Return success response
        return res.status(201).json({ 
            success: true, 
            message: "Tweet created successfully", 
            data: newTweet 
        });
    } 
    catch (err) {
        console.error("Error creating tweet:", err);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};


// Controller function to update a tweet
exports.updateTweet = async (req, res) => {
    try {
        const { tweetId, content } = req.body;

        const userId = req.user.id;

        // Validate input
        if (!tweetId || !content) {
            return res.status(400).json({
                success: false,
                message: "Tweet ID and content are required.",
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

        // Check if the tweet belongs to the user
        if (tweet.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this tweet.",
            });
        }

        // Update the tweet content
        tweet.content = content;
        await tweet.save();

        return res.status(200).json({
            success: true,
            message: "Tweet updated successfully.",
            data: tweet,
        });
    } 
    catch (err) {
        console.error("Error updating tweet:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating tweet.",
        });
    }
};



// Controller function to delete a tweet
exports.deleteTweet = async (req, res) => {
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

        // Find the tweet
        const tweet = await Tweet.findByIdAndDelete(tweetId);
        if (!tweet) {
            return res.status(404).json({
                success: false,
                message: "Tweet not found.",
            });
        }

        // Check if the tweet belongs to the user
        if (tweet.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this tweet.",
            });
        }

        // Remove the tweet from the user's tweets array
        await User.findByIdAndUpdate(userId, {
            $pull: { tweets: tweetId },
        });

        return res.status(200).json({
            success: true,
            message: "Tweet deleted successfully.",
        });
    } 
    catch (err) {
        console.error("Error deleting tweet:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting tweet.",
        });
    }
};


// Controller function to get all tweets
exports.getAllTweets = async (req, res) => {
    try {
        // Find all tweets and populate author details
        const tweets = await Tweet.find()
            .populate('author', 'username email firstName lastName')
            .populate('likes', 'username')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username email firstName lastName'
                }
            })
            .select('content author likes comments sharedBy createdAt')
            .exec();

        return res.status(200).json({
            success: true,
            message: 'Tweets retrieved successfully',
            data: tweets,
        });
    } 
    catch (err) {
        console.error('Error fetching tweets:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching tweets',
        });
    }
};


// Controller function to get tweet by ID
exports.getTweetById = async (req, res) => {
    try {
        const {tweetId} = req.body;

        // Find the tweet by its ID and populate author field with user details
        const tweet = await Tweet.findById(tweetId)
            .populate({
                path: 'author',
                select: 'username firstName lastName',
            })
            .populate('likes', 'username')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username firstName lastName',
                }
            })
            .select('content createdAt')
            .exec();

        if (!tweet) {
            return res.status(404).json({
                success: false,
                message: 'Tweet not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Tweet retrieved successfully',
            data: tweet,
        });
    } 
    catch (err) {
        console.error('Error fetching tweet by ID:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching tweet by ID',
        });
    }
};



// Controller function to get all tweets of a different user
exports.getAllTweetsOfUser = async (req, res) => {
    try {
        const { userId } = req.body;

        // Validate input
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required.",
            });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Find all tweets of the user
        const tweets = await Tweet.find({ author: userId })
            .populate('author', 'username email firstName lastName')
            .populate('likes', 'username')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'username email firstName lastName'
                }
            })
            .select('content author likes comments sharedBy createdAt')
            .exec();

        return res.status(200).json({
            success: true,
            message: `Tweets of user ${user.username} retrieved successfully`,
            data: tweets,
        });
    } 
    catch (err) {
        console.error('Error fetching tweets of user:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching tweets of user',
        });
    }
};
