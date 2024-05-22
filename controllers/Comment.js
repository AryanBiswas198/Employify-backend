const Comment = require("../models/Comment");
const Tweet = require("../models/Tweet");
const User = require("../models/User");

// Controller function to add a comment to a tweet
exports.addComment = async (req, res) => {
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

        // Check if the tweet exists
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            return res.status(404).json({
                success: false,
                message: "Tweet not found.",
            });
        }

        // Create a new comment
        const comment = new Comment({
            content,
            author: userId,
            tweet: tweetId,
        });

        // Save the comment
        await comment.save();

        // Add the comment to the tweet's comments array
        tweet.comments.push(comment._id);
        await tweet.save();

        // Add the comment to the user's comments array
        await User.findByIdAndUpdate(userId, {
            $push: { comments: comment._id },
        });

        return res.status(201).json({
            success: true,
            message: "Comment added successfully.",
            data: comment,
        });
    } 
    catch (err) {
        console.error("Error adding comment:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while adding comment.",
        });
    }
};


// Controller function to update a comment
exports.updateComment = async (req, res) => {
    try {
        const { commentId, content } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!commentId || !content) {
            return res.status(400).json({
                success: false,
                message: "Comment ID and content are required.",
            });
        }

        // Find the comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found.",
            });
        }

        // Check if the comment belongs to the user
        if (comment.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this comment.",
            });
        }

        // Update the comment content
        comment.content = content;
        await comment.save();

        return res.status(200).json({
            success: true,
            message: "Comment updated successfully.",
            data: comment,
        });
    } 
    catch (err) {
        console.error("Error updating comment:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating comment.",
        });
    }
};


// Controller function to delete a comment
exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.body;
        const userId = req.user.id;

        // Validate input
        if(!commentId) {
            return res.status(400).json({
                success: false,
                message: "Comment ID is required.",
            });
        }

        // Find the comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found.",
            });
        }

        // Check if the comment belongs to the user
        if (comment.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this comment.",
            });
        }

        // Remove the comment
        await Comment.findByIdAndDelete(commentId);

        // Remove the comment from the associated tweet's comments array
        await Tweet.findByIdAndUpdate(comment.tweet, {
            $pull: { comments: commentId },
        });

        // Remove the comment from the user's comments array
        await User.findByIdAndUpdate(userId, {
            $pull: { comments: commentId },
        });

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully.",
        });
    } 
    catch (err) {
        console.error("Error deleting comment:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting comment.",
        });
    }
};


// Controller function to get comments by tweet
exports.getCommentsByTweet = async (req, res) => {
    try {
        const { tweetId } = req.body;

        // Validate input
        if (!tweetId) {
            return res.status(400).json({
                success: false,
                message: "Tweet ID is required.",
            });
        }

        // Find the tweet to ensure it exists
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            return res.status(404).json({
                success: false,
                message: "Tweet not found.",
            });
        }

        // Find all comments for the tweet
        const comments = await Comment.find({ tweet: tweetId })
            .populate('author', 'username email firstName lastName')
            .exec();

        return res.status(200).json({
            success: true,
            message: 'Comments retrieved successfully',
            data: comments,
        });
    } 
    catch (err) {
        console.error('Error fetching comments by tweet:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching comments by tweet',
        });
    }
};
