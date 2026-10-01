const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
}, { timestamps: true });
module.exports = mongoose.model('Review', reviewSchema);
