const User = require('../models/User');
const Profile = require('../models/Profile');
const OTP = require('../models/OTP');
const bcrypt = require('bcrypt');
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.sendOtp = async (req, res) => {
    try {
        // Fetch email from req body
        const { email } = req.body;

        // Check if user already exists
        const checkUserPresent = await User.findOne({ email });

        // If User already exists, return response
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            });
        }

        // Generate OTP
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
        });

        console.log("OTP Generated: ", otp);

        // Ensure unique OTP
        let result = await OTP.findOne({ otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp });
        }

        // Create an entry in DB for OTP
        const otpPayload = { email, otp };
        const otpBody = await OTP.create(otpPayload);

        // Return Response
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp // For test purpose
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "An error occurred while sending OTP. Please try again later.",
        });
    }
};


// signup Handler
exports.signup = async (req, res) => {
    try {
        // Fetch Data from req body
        const {
            email,
            username,
            firstName,
            lastName,
            password,
            confirmPassword,
            accountType,
            dob,
            contactNo,
            gender,
            city,
            state,
            country,
            otp,
        } = req.body;

        // Validate Data
        if (!email || !username || !firstName || !lastName || !password || !confirmPassword || !accountType || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if password matches or not
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password don't match. Please try again."
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Find most recent OTP stored for the user
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        if (recentOtp.length === 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
        }

        // Validate OTP
        const validOtp = recentOtp[0];
        const currentTime = new Date();
        if (otp !== validOtp.otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        } else if (validOtp.createdAt.getTime() + 5 * 60 * 1000 < currentTime.getTime()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired",
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create profile details
        const profileDetails = await Profile.create({
            dob,
            gender,
            contactNo,
            about: null,
            city,
            state,
            country,
            college: null,
        });

        // Create user entry in DB
        const user = await User.create({
            email,
            username,
            firstName,
            lastName,
            password: hashedPassword,
            accountType,
            profile: profileDetails._id,
            likes: [],
            comments: [],
            sharedPosts: [],
            jobPostings: [],
            jobApplications: [],
            // image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        // Return response
        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user,
        });
    } catch (err) {
        console.error(err);
        return res.status(502).json({
            success: false,
            message: "User registration failed. Please try again.",
        });
    }
};



// login
exports.login = async (req, res) => {

    // Get data from req body
    // validate data
    // user exists or not
    // generate JWT after password matching
    // Create cookie and send response
    try {
        // Get Data
        const { email, password } = req.body;

        // Validate Data
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All Fields are required. Please Try Again"
            });
        }

        // User exists or not
        const user = await User.findOne({ email }).populate("profile");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered. Please SignUp First"
            });
        }

        // Match password and generate token
        if (await bcrypt.compare(password, user.password)) {

            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            user.token = token;
            user.password = undefined;

            // Create Cookie and send response

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged In Successfully",
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Password is Incorrect",
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Login Failure. Please Try again",
        });
    }
}