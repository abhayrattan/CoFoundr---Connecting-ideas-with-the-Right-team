const Message = require('../models/Message');
const Team = require('../models/Team');

exports.getTeamMessages = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);
    if (!team || !team.members.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const messages = await Message.find({ teamId }).populate('senderId', 'name').sort('createdAt');
    res.json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
