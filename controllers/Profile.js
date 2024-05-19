const User = require("../models/User");
const Profile = require("../models/Profile");
const Job = require("../models/Job");

// Controller function to update user profile
exports.updateProfile = async (req, res) => {
    try {
        // Fetch Data
        const {
            firstName = "",
            lastName = "",
            dob = "",
            about = "",
            contactNo = "",
            gender = "",
            city = "",
            state = "",
            country = "",
            college = ""
        } = req.body;

        // Get User ID
        const id = req.user.id;

        // Find User and Profile
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const profileId = userDetails.profile;
        const profileDetails = await Profile.findById(profileId);

        if (!profileDetails) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        // Update User fields
        userDetails.firstName = firstName || userDetails.firstName;
        userDetails.lastName = lastName || userDetails.lastName;

        await userDetails.save();

        // Update Profile fields
        profileDetails.gender = gender || profileDetails.gender;
        profileDetails.dob = dob || profileDetails.dob;
        profileDetails.about = about || profileDetails.about;
        profileDetails.contactNo = contactNo || profileDetails.contactNo;
        profileDetails.city = city || profileDetails.city;
        profileDetails.state = state || profileDetails.state;
        profileDetails.country = country || profileDetails.country;
        profileDetails.college = college || profileDetails.college;

        await profileDetails.save();

        // Find the updated user details
        const updatedUserDetails = await User.findById(id)
            .populate("profile")
            .exec();

        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            data: updatedUserDetails,
        });
    } 
    catch (err) {
        console.error("Error updating profile:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating profile",
        });
    }
};


// Controller function to get all user details
exports.getAllUserDetails = async (req, res) => {
    try {
        const userId = req.user.id; // Fetch userId from req.user.id

        // Find user details
        const userDetails = await User.findById(userId)
                                .populate("profile")
                                .populate("jobApplications")
                                .exec();

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Find user job applications
        const jobApplications = await Job.find({ _id: 
            { 
                $in: userDetails.jobApplications 
            } 
            }).exec();


        return res.status(200).json({
            success: true,
            message: "User details retrieved successfully",
            userDetails: {
                user: userDetails,
                jobApplications: jobApplications,
            },
        });
    } 
    catch (err) {
        console.error("Error fetching user details:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching user details",
        });
    }
};



// TODO: Add delete Account controller function