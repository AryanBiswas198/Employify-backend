const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();


// auth
exports.auth = async(req, res, next) => {
    try{

        // Extract Token
        const token = req.cookies.token || 
                req.body.token ||
                req.header("Authorization").replace("Bearer ", "");

        
        // If token missing, return response
        if(!token){
            return res.status(402).json({
                success: false,
                message: "Token is missing"
            });
        }


        // Verify Token 
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);

            req.user = decode;
        }
        catch(err){
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }
        next();
    }
    catch(err){
        console.log(err);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token"
        });
    }
}


// is Candidate
exports.isCandidate = async(req, res, next) => {

    try{
        if(req.user.accountType !== 'candidate'){
            return res.status(400).json({
                success: false,
                message: "This is a protected route for Candidates only"
            })
        }
        next();
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified. Please Try Again"
        });
    }
}


// isRecruiter
exports.isRecruiter = async(req, res, next) => {

    try{
        if(req.user.accountType !== 'recruiter'){
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Recruiters only."
            });
        }
        next();
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified. Please Try Again"
        });
    }
}