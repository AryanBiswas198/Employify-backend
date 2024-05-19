const express = require("express");
const router = express.Router();

const {auth} = require("../middlewares/auth");


const {
    updateProfile,
    getAllUserDetails
} = require("../controllers/Profile");


// Profile Routes
// Route for updating profile
router.put("/updateProfile", auth, updateProfile);

// Route for get all user details
router.get("/getAllUserDetails", auth, getAllUserDetails);



module.exports = router;