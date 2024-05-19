const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  dob: {
    type: String,
  },

  gender: {
    type: String,
  },

  contactNo: {
    type: String,
  },

  about: {
    type: String,
    trim: true,
  },

  city: {
    type: String,
    trim: true,
  },

  state: {
    type: String,
    trim: true,
  },

  country: {
    type: String,
    trim: true,
  },

  college: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model("Profile", profileSchema);
