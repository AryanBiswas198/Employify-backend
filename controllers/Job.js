const Job = require('../models/Job');
const User = require('../models/User');
const Category = require('../models/Category');
const Application = require("../models/Application");

// Create Job Cotroller
exports.createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            company,
            location,
            salary,
            categoryId,
            skills
            // skills: _skills  // Expecting this to be a JSON stringified array
        } = req.body;

        const recruiterId = req.user.id;

        // Parse the skills from stringified JSON to array
        // const skills = JSON.parse(_skills);

        // Validate inputs
        if (!title || !description || !company || !location || !categoryId || !skills || !skills.length) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        // Check if the category exists
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Create a new job
        const newJob = await Job.create({
            title,
            description,
            company,
            location,
            salary,
            skills,
            recruiter: recruiterId,
            category: categoryId
        });

        // Update the recruiter's job postings
        await User.findByIdAndUpdate(recruiterId, {
            $push: { 
                jobPostings: newJob._id
            }
        });

        return res.status(201).json({
            success: true,
            message: 'Job created successfully',
            job: newJob,
        });
    } 
    catch (err) {
        console.error('Error creating job:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while creating job',
        });
    }
};


// Controller function to update a job
exports.updateJob = async (req, res) => {
    try {
        const { jobId } = req.body;  // Extract jobId from req.body
        const recruiterId = req.user.id;

        // Find the job by ID
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // Check if the recruiter is the one who created the job
        if (job.recruiter.toString() !== recruiterId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this job",
            });
        }

        // Extract update fields from req.body
        const {
            title,
            description,
            company,
            location,
            salary,
            skills,
            category
        } = req.body;

        // Optional: Validate category if provided
        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
                });
            }
        }

        // Update job fields
        if (title) job.title = title;
        if (description) job.description = description;
        if (company) job.company = company;
        if (location) job.location = location;
        if (salary) job.salary = salary;
        if (skills) job.skills = skills;
        if (category) job.category = category;

        // Save the updated job
        const updatedJob = await job.save();

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: updatedJob,
        });
    } 
    catch (err) {
        console.error("Error updating job:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while updating job",
        });
    }
};



// Controller function to delete a job
exports.deleteJob = async (req, res) => {
    try {
        const { jobId } = req.body;  // Extract jobId from req.body
        const recruiterId = req.user.id;

        // Find the job by ID
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // Check if the recruiter is the one who created the job
        if (job.recruiter.toString() !== recruiterId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this job",
            });
        }

        // Find all applications related to this job
        const applications = await Application.find({ job: jobId });

        // Remove the job from the candidates' jobApplications array
        const candidateIds = applications.map(app => app.candidate);
        await User.updateMany(
            { _id: { $in: candidateIds } },
            { $pull: { jobApplications: jobId } }
        );

        // Delete all applications related to this job
        await Application.deleteMany({ job: jobId });

        // Delete the job
        await Job.findByIdAndDelete(jobId);

        // Remove the job from the recruiter's jobPostings
        await User.findByIdAndUpdate(
            recruiterId,
            { $pull: { jobPostings: jobId } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });
    } 
    catch (err) {
        console.error("Error deleting job:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting job",
        });
    }
};





// Controller function to get all jobs
exports.getAllJobs = async (req, res) => {
    try {
        // Find all jobs
        const jobs = await Job.find()
                        .populate('category')
                        .populate('recruiter')
                        .exec();

        return res.status(200).json({
            success: true,
            message: 'Jobs retrieved successfully',
            data: jobs,
        });
    } 
    catch (err) {
        console.error('Error fetching jobs:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching jobs',
        });
    }
};


// Controller function to get job details by jobId
exports.getJobDetails = async (req, res) => {
    try {
        
        const { jobId } = req.body;

        // Validate jobId
        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: 'Job ID is required',
            });
        }

        // Find job by ID
        const job = await Job.findById(jobId)
                             .populate('category')
                             .populate('recruiter')
                             .exec();

        // Check if job exists
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Job details retrieved successfully',
            data: job,
        });
    } 
    catch (err) {
        console.error('Error fetching job details:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching job details',
        });
    }
};



// Controller function to search jobs by category
exports.searchJobsByCategory = async (req, res) => {
    try {

        const { categoryId } = req.body;

        // Validate categoryId
        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: 'Category ID is required',
            });
        }

        // Check if category exists
        const categoryExists = await Category.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Find jobs by category
        const jobs = await Job.find({ category: categoryId })
                              .populate('category')
                              .populate('recruiter')
                              .exec();

        return res.status(200).json({
            success: true,
            message: 'Jobs retrieved successfully',
            data: jobs,
        });
    } 
    catch (err) {
        console.error('Error searching jobs by category:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while searching jobs by category',
        });
    }
};
