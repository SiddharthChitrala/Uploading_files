// server/models/resume.js
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  name: String,
  path: String,
});

module.exports = mongoose.model('Resume', resumeSchema);
