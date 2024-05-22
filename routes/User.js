const express = require("express");
const router = express.Router();

const {
    sendOtp, 
    signup,
    login,
} = require("../controllers/Auth");

const {
    resetPasswordToken,
    resetPassword
} = require("../controllers/ResetPassword");


const {auth} = require("../middlewares/auth");

// Authentication Routes

// Route for sendOtp
router.post("/sendotp", sendOtp);

// Route for Signup
router.post("/signup", signup);

// Route for Login
router.post("/login", login);



// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)



module.exports = router;