const Startup = require('../models/Startup');
const Team = require('../models/Team');
const JoinRequest = require('../models/JoinRequest');
const User = require('../models/User');

exports.createStartup = async (req, res) => {
  try {
    const { title, description, domain, requiredSkills, teamSize } = req.body;
    
    if (!title || !description || !domain || !teamSize) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const startup = await Startup.create({
      title,
      description,
      domain,
      requiredSkills: requiredSkills ? (Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(',').map(s=>s.trim()).filter(Boolean)) : [],
      teamSize,
      createdBy: req.user._id,
      status: 'recruiting'
    });

    // Create corresponding team
    const team = await Team.create({
      startupId: startup._id,
      leaderId: req.user._id,
      members: [req.user._id], // Leader is implicitly a member
      teamRoles: [{ user: req.user._id, role: 'Leader' }]
    });

    res.status(201).json({ success: true, startup, teamId: team._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getStartups = async (req, res) => {
  try {
    const { search, domain, skills, status } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (domain) query.domain = domain;
    if (status) query.status = status;
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.requiredSkills = { $in: skillsArray };
    }

    const startups = await Startup.find(query).populate('createdBy', 'name email').sort('-createdAt');
    res.json({ success: true, startups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getStartupById = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id).populate('createdBy', 'name email');
    if (!startup) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }
    res.json({ success: true, startup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateStartup = async (req, res) => {
  try {
    let startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    if (startup.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this startup' });
    }

    const { title, description, domain, requiredSkills, teamSize, status } = req.body;
    
    if (title) startup.title = title;
    if (description) startup.description = description;
    if (domain) startup.domain = domain;
    if (teamSize) startup.teamSize = teamSize;
    if (status) startup.status = status;
    
    if (requiredSkills) {
      startup.requiredSkills = Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(',').map(s=>s.trim()).filter(Boolean);
    }

    await startup.save();
    res.json({ success: true, startup });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteStartup = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    if (startup.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this startup' });
    }

    await Startup.findByIdAndDelete(req.params.id);
    await Team.findOneAndDelete({ startupId: req.params.id });
    await JoinRequest.deleteMany({ startupId: req.params.id });

    res.json({ success: true, message: 'Startup removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.bookmarkStartup = async (req, res) => {
  try {
    const startupId = req.params.id;
    const user = await User.findById(req.user._id);

    if (!user.savedStartups.includes(startupId)) {
      user.savedStartups.push(startupId);
      await user.save();
    }
    res.json({ success: true, message: 'Startup bookmarked' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.unbookmarkStartup = async (req, res) => {
  try {
    const startupId = req.params.id;
    const user = await User.findById(req.user._id);
    
    user.savedStartups = user.savedStartups.filter(id => id.toString() !== startupId);
    await user.save();
    
    res.json({ success: true, message: 'Startup unbookmarked' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getSavedStartups = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedStartups',
      populate: { path: 'createdBy', select: 'name email' }
    });
    res.json({ success: true, startups: user.savedStartups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
