const Application = require("../models/Application");
const User = require("../models/User");
const Job = require("../models/Job");

// Controller function to apply to a job
exports.applyToJob = async (req, res) => {
    try {
        const candidateId = req.user.id; 

        const { jobId, coverLetter, resume } = req.body;

        // Validate input
        if (!jobId || !resume) {
            return res.status(400).json({
                success: false,
                message: "Job ID and resume are required fields.",
            });
        }

        // Find the job to ensure it exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found.",
            });
        }

        // Check if the candidate has already applied to this job
        const existingApplication = await Application.findOne({ job: jobId, candidate: candidateId });
        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "You have already applied to this job.",
            });
        }

        // Create a new application
        const newApplication = await Application.create({
            job: jobId,
            candidate: candidateId,
            coverLetter,
            resume,
        });

        // Update the job's applications array
        job.applications.push(newApplication._id);
        await job.save();

        // Update the candidate's jobApplications array
        const candidate = await User.findById(candidateId);
        candidate.jobApplications.push(jobId);
        await candidate.save();

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully.",
            application: newApplication,
        });
    } 
    catch (err) {
        console.error("Error applying to job:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while applying to job.",
        });
    }
};



// Controller function to get applications by job
exports.getApplicationsByJob = async (req, res) => {
    try {
        const { jobId } = req.body;

        // Validate input
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required.",
            });
        }

        // Find the job to ensure it exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found.",
            });
        }

        // Find all applications for the job
        const applications = await Application.find({ job: jobId })
            .populate('candidate', 'username email firstName lastName') // Populate candidate details
            .exec();

        return res.status(200).json({
            success: true,
            message: 'Applications retrieved successfully',
            data: applications,
        });
    } 
    catch (err) {
        console.error('Error fetching applications by job:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching applications by job',
        });
    }
};


// Controller function to get applications by user
exports.getApplicationsByUser = async (req, res) => {
    try {
        const userId = req.user.id;

        // Validate user existence
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Find all applications by the user
        const applications = await Application.find({ candidate: userId })
            .populate('job', 'title company location') // Populate job details
            .exec();

        return res.status(200).json({
            success: true,
            message: 'Applications retrieved successfully',
            data: applications,
        });
    } 
    catch (err) {
        console.error('Error fetching applications by user:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching applications by user',
        });
    }
};



// Controller function to update an application
exports.updateApplication = async (req, res) => {
    try {
        const userId = req.user.id;
        const { applicationId, coverLetter, resume } = req.body;

        // Validate the presence of required fields
        if (!applicationId) {
            return res.status(400).json({
                success: false,
                message: 'Application ID is required',
            });
        }

        // Find the application to update
        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        // Ensure the user owns the application
        if (application.candidate.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this application',
            });
        }

        // Update the application fields
        if (coverLetter) application.coverLetter = coverLetter;
        if (resume) application.resume = resume;

        // Save the updated application
        await application.save();

        return res.status(200).json({
            success: true,
            message: 'Application updated successfully',
            data: application,
        });
    } 
    catch (err) {
        console.error('Error updating application:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while updating application',
        });
    }
};



// Controller function to get application details
exports.getApplicationDetails = async (req, res) => {
    try {
        const { applicationId } = req.body;

        // Validate the presence of required fields
        if (!applicationId) {
            return res.status(400).json({
                success: false,
                message: 'Application ID is required',
            });
        }

        // Find the application by ID
        const application = await Application.findById(applicationId)
            .populate('job') // Populate job details
            .populate('candidate') // Populate candidate details
            .exec();

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Application details retrieved successfully',
            data: application,
        });
    } 
    catch (err) {
        console.error('Error fetching application details:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching application details',
        });
    }
};

