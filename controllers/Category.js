const Category = require("../models/Category");
const Job = require("../models/Job");

// Controller function to get all jobs by category
exports.getJobsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.body;

        // Validate category ID
        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required.",
            });
        }

        // Fetch jobs by category
        const jobs = await Job.find({ category: categoryId }).populate("category");

        return res.status(200).json({
            success: true,
            message: "Jobs retrieved successfully.",
            jobs,
        });
    } catch (err) {
        console.error("Error fetching jobs by category:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching jobs by category.",
        });
    }
};


// Controller function to create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is Required !!"
            });
        }

        // Check if the category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: "Category with this name already exists."
            });
        }

        // Create the category
        const category = await Category.create({
            name: name,
            description: description,
        });

        console.log(category);

        // Return success response
        return res.status(201).json({
            success: true,
            message: "Category created successfully.",
            category
        });
    } 
    catch (err) {
        console.error("Error creating category:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating category."
        });
    }
};



// Controller function to fetch all categories
exports.showAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});

        return res.status(200).json({
            success: true,
            message: "All Categories returned successfully",
            categories
        });
    } 
    catch (err) {
        console.error("Error fetching categories:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching categories."
        });
    }
};



// Controller function to get all jobs by category
exports.getJobsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.body;

        // Validate category ID
        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required.",
            });
        }

        // Fetch jobs by category
        const jobs = await Job.find({ category: categoryId }).populate("category");

        return res.status(200).json({
            success: true,
            message: "Jobs retrieved successfully.",
            jobs,
        });
    } catch (err) {
        console.error("Error fetching jobs by category:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching jobs by category.",
        });
    }
};
