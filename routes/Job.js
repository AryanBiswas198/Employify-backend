const express = require("express");
const router = express.Router();

const {auth, isCandidate, isRecruiter} = require("../middlewares/auth");

const {
    createJob, 
    updateJob,
    deleteJob,
    getAllJobs,
    getJobDetails,
    searchJobsByCategory
} = require("../controllers/Job");

const {
    createCategory,
    showAllCategories,
    getJobsByCategory
} = require("../controllers/Category");


// Job Routes
// Route for create Job
router.post("/createJob", auth, isRecruiter, createJob);

// Route for updateJob
router.put("/updateJob", auth, isRecruiter, updateJob);

// Route for deleteJob
router.delete("/deleteJob", auth, isRecruiter, deleteJob);

// Route for get all jobs
router.get("/getAllJobs", auth, getAllJobs);

// Route for getJobDetails
router.get("/getJobDetails", auth, getJobDetails);

// Route for search Jobs by Category
router.get("/searchJobsByCategory", auth, searchJobsByCategory);


// Category Routes
// Route for createCategory
router.post("/createCategory", auth, isRecruiter, createCategory);

// Route for show all Categories
router.get("/showAllCategories", showAllCategories);

// Route for all jobs of specific category
router.get("/getJobsByCategory", getJobsByCategory);

module.exports = router;