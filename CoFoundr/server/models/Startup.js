const mongoose = require('mongoose');

const startupSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  domain: { type: String, required: true },
  requiredSkills: { type: [String], default: [] },
  teamSize: { type: Number, required: true, min: 1 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['recruiting', 'full', 'completed'], default: 'recruiting' },
}, { timestamps: true });

module.exports = mongoose.model('Startup', startupSchema);
