const express = require("express");
const router = express.Router();

const {auth, isCandidate, isRecruiter} = require("../middlewares/auth");

const {
    createCategory,
    showAllCategories,
    getJobsByCategory
} = require("../controllers/Category");



// Category Routes
// Route for createCategory
router.post("/createCategory", auth, isRecruiter, createCategory);

// Route for show all Categories
router.get("/showAllCategories", showAllCategories);

// Route for all jobs of specific category
router.get("/getJobsByCategory", getJobsByCategory);

module.exports = router;