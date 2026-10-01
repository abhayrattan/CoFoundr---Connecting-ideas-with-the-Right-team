const Review = require('../models/Review');
const User = require('../models/User');

const createReview = async (req, res) => {
  try {
    const { reviewee, startupId, rating, comment } = req.body;
    const reviewer = req.user._id;

    if (reviewer.toString() === reviewee.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot review yourself' });
    }

    // Check for duplicate review
    const existingReview = await Review.findOne({ reviewer, reviewee, startupId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this user for this startup' });
    }

    // Check if they were in the same startup/team
    const Team = require('../models/Team');
    const team = await Team.findOne({ startupId });
    if (!team || !team.members.includes(reviewer) || !team.members.includes(reviewee)) {
      return res.status(403).json({ success: false, message: 'You can only review team members you worked with' });
    }

    const review = await Review.create({
      reviewer,
      reviewee,
      startupId,
      rating,
      comment
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: 'Server error creating review' });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const reviews = await Review.find({ reviewee: userId })
      .populate('reviewer', 'name email avatar') // avatar if exists
      .populate('startupId', 'title')
      .sort({ createdAt: -1 });

    let averageRating = 0;
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
      averageRating = (sum / reviews.length).toFixed(1);
    }

    res.json({
      success: true,
      data: {
        reviews,
        averageRating
      }
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user reviews' });
  }
};

module.exports = {
  createReview,
  getUserReviews
};
