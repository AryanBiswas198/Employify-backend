const express = require("express");
const router = express.Router();

const {
    sendOtp, 
    signup,
    login,
} = require("../controllers/Auth");


const {auth} = require("../middlewares/auth");

// Authentication Routes

// Route for sendOtp
router.post("/sendotp", sendOtp);

// Route for Signup
router.post("/signup", signup);

// Route for Login
router.post("/login", login);



module.exports = router;