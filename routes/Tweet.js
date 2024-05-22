const express = require("express");
const router = express.Router();

const {auth, isCandidate, isRecruiter} = require("../middlewares/auth");

const {
    createTweet,
    updateTweet,
    deleteTweet,
    getAllTweets,
    getTweetById,
    getAllTweetsOfUser
} = require("../controllers/Tweet");


const {
    likeTweet,
    unlikeTweet,
    getLikesByTweet
} = require("../controllers/Like");


const {
    addComment,
    updateComment,
    deleteComment,
    getCommentsByTweet
} = require("../controllers/Comment");



// --------------------------_Routes for Tweet ------------------------------------
// Route for createTweet
router.post("/createTweet", auth, createTweet);

// Route for update Tweet
router.put("/updateTweet", auth, updateTweet);

// Route for delete Tweet
router.delete("/deleteTweet", auth, deleteTweet);

// Route to get all tweets
router.get("/getAllTweets", auth, getAllTweets);

// Route to get tweet by id
router.get("/getTweetById", auth, getTweetById);

// Route to get all tweets of a specific user
router.get("/getAllTweetsOfUser", auth, getAllTweetsOfUser);



// ----------------------------Routes for Likes ---------------------------------------------
// Route for like tweet
router.post("/likeTweet", auth, likeTweet);

// Route for unlike tweet
router.post("/unlikeTweet", auth, unlikeTweet);

// Route to get likes of a tweet
router.get("/getLikesByTweet", auth, getLikesByTweet);





// ----------------------------Routes for Comments -------------------------------------------
// Route to add comment
router.post("/addComment", auth, addComment);

// Route to update comment
router.put("/updateComment", auth, updateComment);

// Route to delete comment
router.delete("/deleteComment", auth, deleteComment);

// Route to get all comments of a tweet
router.get("/getCommentsByTweet", auth, getCommentsByTweet);



module.exports = router;