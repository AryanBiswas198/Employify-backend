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


module.exports = router;