const Job = require('../models/Job');
const User = require('../models/User');
const Category = require('../models/Category');

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
            skills: _skills  // Expecting this to be a JSON stringified array
        } = req.body;

        const recruiterId = req.user.id;

        // Parse the skills from stringified JSON to array
        const skills = JSON.parse(_skills);

        // Validate inputs
        if (!title || !description || !company || !location || !categoryId || !skills.length) {
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

