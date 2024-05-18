const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
  },

  company: {
    type: String,
    required: true,
    trim: true,
  },

  location: {
    type: String,
    required: true,
    trim: true,
  },

  salary: {
    type: String,
    trim: true,
  },

  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  skills: [
    {
      type: String,
      trim: true,
    },
  ],

  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
    },
  ],
});

module.exports = mongoose.model("Job", jobSchema);
