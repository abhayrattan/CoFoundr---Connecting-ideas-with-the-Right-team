const Team = require('../models/Team');
const Startup = require('../models/Startup');

exports.getTeamByStartup = async (req, res) => {
  try {
    const team = await Team.findOne({ startupId: req.params.startupId })
      .populate('leaderId', 'name email')
      .populate('members', 'name email skills')
      .populate('teamRoles.user', 'name');

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    res.json({ success: true, team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId)
      .populate('leaderId', 'name email')
      .populate('members', 'name email skills bio')
      .populate('teamRoles.user', 'name');

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    res.json({ success: true, team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.assignRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    if (team.leaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only leader can assign roles' });
    }

    if (!team.members.includes(userId)) {
      return res.status(400).json({ success: false, message: 'User is not a member of this team' });
    }

    const existingRoleIndex = team.teamRoles.findIndex(r => r.user.toString() === userId.toString());
    
    if (existingRoleIndex > -1) {
      team.teamRoles[existingRoleIndex].role = role;
    } else {
      team.teamRoles.push({ user: userId, role });
    }

    await team.save();
    res.json({ success: true, team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
exports.getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({ members: req.user._id })
      .populate('startupId', 'title')
      .populate('leaderId', 'name email');
    res.json({ success: true, teams });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

