const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, bio, skills, experience, github, linkedin, portfolio, availability, onboardingCompleted } = req.body;

    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) {
      if (typeof skills === 'string') {
        user.skills = skills.split(',').map(s => s.trim()).filter(s => s !== '');
      } else if (Array.isArray(skills)) {
        user.skills = skills;
      }
    }
    if (experience !== undefined) user.experience = experience;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (availability !== undefined) user.availability = availability;
    if (onboardingCompleted !== undefined) user.onboardingCompleted = onboardingCompleted;

    const updatedUser = await user.save();
    
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json({ success: true, user: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
const path = require('path');
const fs = require('fs');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF, DOC, or DOCX file.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete old resume if it exists
    if (user.resume) {
      let oldResumeObj = null;
      try {
        oldResumeObj = JSON.parse(user.resume);
      } catch(e) {
        oldResumeObj = { url: user.resume };
      }
      
      if (oldResumeObj.url && oldResumeObj.url.startsWith('/uploads/')) {
        const oldFilename = oldResumeObj.url.replace('/uploads/', '');
        const oldFilePath = path.join(__dirname, '../uploads', oldFilename);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    // Since we're changing resume to an object format from String, wait, User model says:
    // resume: { type: String, default: '' }
    // We can just store a JSON stringified object OR simply just change the schema dynamically,
    // but Mongoose schema is defined as String.
    // If I just store the JSON as a string, it might be weird.
    // I can just store the URL in the string if it's only local, but the prompt says:
    // "If a resume already exists: Resume.pdf [View] [Download] [Replace] [Delete]"
    // I need the filename. I can store a JSON string in the String field to avoid breaking any generic string validations, 
    // or I can modify the User.js model.
    // Let's modify the User.js model. I'll do it separately.

    // Store URL and filename as stringified JSON to avoid schema conflicts or modify schema?
    // Modifying the schema is better. I will update User.js shortly.

    user.resume = JSON.stringify({
      url: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      publicId: req.file.filename
    });

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ success: true, message: 'Resume uploaded successfully', user: userResponse, fileUrl: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.error(error);
    if (error.message.includes('Invalid file type')) {
       return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.resume) {
      return res.status(404).json({ success: false, message: 'No resume found to delete' });
    }

    let resumeObj = null;
    try {
      resumeObj = JSON.parse(user.resume);
    } catch(e) {
      // old format or just url string
      resumeObj = { url: user.resume };
    }

    if (resumeObj.url && resumeObj.url.startsWith('/uploads/')) {
      const filename = resumeObj.url.replace('/uploads/', '');
      const filePath = path.join(__dirname, '../uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    user.resume = '';
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ success: true, message: 'Resume deleted successfully', user: userResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
