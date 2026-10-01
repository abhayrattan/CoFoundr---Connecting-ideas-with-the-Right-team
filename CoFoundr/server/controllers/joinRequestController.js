const JoinRequest = require('../models/JoinRequest');
const Startup = require('../models/Startup');
const Team = require('../models/Team');
const Notification = require('../models/Notification');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

exports.createRequest = async (req, res) => {
  try {
    const { startupId, message } = req.body;

    if (!startupId || !message) {
      return res.status(400).json({ success: false, message: 'Please provide startupId and message' });
    }

    const startup = await Startup.findById(startupId);
    if (!startup) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    if (startup.createdBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot join your own startup' });
    }

    if (startup.status === 'full' || startup.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Startup is no longer recruiting' });
    }

    const team = await Team.findOne({ startupId });
    if (team.members.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You are already a member of this team' });
    }
    
    if (team.members.length >= startup.teamSize) {
      if(startup.status !== 'full') {
         startup.status = 'full';
         await startup.save();
      }
      return res.status(400).json({ success: false, message: 'Team is already full' });
    }

    const existingRequest = await JoinRequest.findOne({
      startupId,
      userId: req.user._id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'You already have a pending request for this startup' });
    }

    const request = await JoinRequest.create({
      startupId,
      userId: req.user._id,
      message
    });

    // Send in-app notification to the startup owner
    await Notification.create({
      receiverId: startup.createdBy,
      type: 'NEW_JOIN_REQUEST',
      message: `${req.user.name} applied to join ${startup.title}`,
      relatedId: startup._id
    });

    // Send email to the startup owner
    const owner = await User.findById(startup.createdBy);
    if (owner) {
      await sendEmail({
        to: owner.email,
        subject: `New Application for ${startup.title} - CoFoundr`,
        text: `Hello ${owner.name},\n\n${req.user.name} has submitted an application to join your startup "${startup.title}".\n\nLog in to your CoFoundr dashboard to review their message and accept or reject the request.\n\nBest,\nCoFoundr Team`,
      });
    }

    res.status(201).json({ success: true, request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await JoinRequest.find({ userId: req.user._id })
      .populate('startupId', 'title domain status')
      .sort('-createdAt');
    res.json({ success: true, requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getStartupRequests = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.startupId);
    if (!startup) {
      return res.status(404).json({ success: false, message: 'Startup not found' });
    }

    if (startup.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these requests' });
    }

    const requests = await JoinRequest.find({ startupId: req.params.startupId })
      .populate('userId', 'name email skills')
      .sort('-createdAt');
      
    res.json({ success: true, requests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await JoinRequest.findById(req.params.requestId);
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Request is already processed' });
    }

    const startup = await Startup.findById(request.startupId);
    if (startup.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (status === 'accepted') {
      const team = await Team.findOne({ startupId: startup._id });
      if (team.members.length >= startup.teamSize) {
        return res.status(400).json({ success: false, message: 'Team is full' });
      }

      if (!team.members.includes(request.userId)) {
        team.members.push(request.userId);
        await team.save();
      }

      if (team.members.length >= startup.teamSize) {
        startup.status = 'full';
        await startup.save();
      }
    }

    request.status = status;
    await request.save();

    await Notification.create({
      receiverId: request.userId,
      type: status === 'accepted' ? 'JOIN_ACCEPTED' : 'JOIN_REJECTED',
      message: `Your join request for ${startup.title} was ${status}`,
      relatedId: startup._id
    });

    const user = await User.findById(request.userId);
    if (user) {
      await sendEmail({
        to: user.email,
        subject: `Join Request ${status === 'accepted' ? 'Accepted' : 'Rejected'} - CoFoundr`,
        text: `Hello ${user.name},\n\nYour join request for the startup "${startup.title}" was ${status}.\n\nBest,\nCoFoundr Team`,
      });
    }

    res.json({ success: true, request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
