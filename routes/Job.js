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
    applyToJob,
    getApplicationsByJob,
    getApplicationsByUser,
    updateApplication,
    getApplicationDetails
} = require("../controllers/Application");


const {
    createCategory,
    showAllCategories,
    getJobsByCategory
} = require("../controllers/Category");


// --------------------------------------- Job Routes ------------------------------------------------------------
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




// ---------------------------------------- Application Routes ----------------------------------------------------
// Route for create Application or apply to job
router.post("/applyToJob", auth, isCandidate, applyToJob);

// Route for getting applications by job id
router.get("/getApplicationsByJob", auth, isRecruiter, getApplicationsByJob);

// Route for getting applications of a specific user
router.get("/getApplicationsByUser", auth, isCandidate, getApplicationsByUser);

// Route to update application
router.put("/updateApplication", auth, isCandidate, updateApplication);

// Route to get application details
router.get("/getApplicationDetails", auth, getApplicationDetails);



// ---------------------------------------- Category Routes -------------------------------------------------------
// Route for createCategory
router.post("/createCategory", auth, isRecruiter, createCategory);

// Route for show all Categories
router.get("/showAllCategories", showAllCategories);

// Route for all jobs of specific category
router.get("/getJobsByCategory", getJobsByCategory);

module.exports = router;