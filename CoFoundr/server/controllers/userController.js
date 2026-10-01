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

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
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
const cloudinary = require('cloudinary').v2;

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
      
      if (oldResumeObj.publicId) {
        await cloudinary.uploader.destroy(oldResumeObj.publicId, { resource_type: 'raw' });
      } else if (oldResumeObj.url && oldResumeObj.url.startsWith('/uploads/')) {
        const oldFilename = oldResumeObj.url.replace('/uploads/', '');
        const oldFilePath = path.join(__dirname, '../uploads', oldFilename);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    user.resume = JSON.stringify({
      url: req.file.path,
      fileName: req.file.originalname,
      publicId: req.file.filename
    });

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ success: true, message: 'Resume uploaded successfully', user: userResponse, fileUrl: req.file.path });
  } catch (error) {
    console.error(error);
    if (error.message && error.message.includes('Invalid file type')) {
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
      resumeObj = { url: user.resume };
    }

    if (resumeObj.publicId) {
      await cloudinary.uploader.destroy(resumeObj.publicId, { resource_type: 'raw' });
    } else if (resumeObj.url && resumeObj.url.startsWith('/uploads/')) {
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
