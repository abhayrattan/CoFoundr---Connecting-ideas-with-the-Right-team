const Task = require('../models/Task');
const Team = require('../models/Team');
const Notification = require('../models/Notification');

exports.createTask = async (req, res) => {
  try {
    const { title, description, teamId, startupId, assignedTo, priority, dueDate } = req.body;
    
    if (!title || !teamId || !startupId) {
      return res.status(400).json({ success: false, message: 'Title, teamId, and startupId are required' });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    // Only leader can create task
    if (team.leaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only team leader can create tasks' });
    }

    // Validate assignee belongs to team
    if (assignedTo && !team.members.includes(assignedTo)) {
      return res.status(400).json({ success: false, message: 'Assigned user must be a team member' });
    }

    const task = await Task.create({
      title, description, startupId, teamId, assignedTo, priority, dueDate,
      createdBy: req.user._id,
      status: 'Pending'
    });

    if (assignedTo && assignedTo.toString() !== req.user._id.toString()) {
      await Notification.create({
        receiverId: assignedTo,
        type: 'TASK_ASSIGNED',
        message: `You have been assigned a new task: ${title}`,
        relatedId: task._id
      });
    }

    res.status(201).json({ success: true, task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { teamId, status, priority, assignedTo } = req.query;
    
    // teamId optional now

    let teamIds = [];
    if (teamId) {
      const team = await Team.findById(teamId);
      if (!team || !team.members.includes(req.user._id)) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
      teamIds.push(teamId);
    } else {
      const userTeams = await Team.find({ members: req.user._id });
      teamIds = userTeams.map(t => t._id);
    }

    let query = { teamId: { $in: teamIds } };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    const tasks = await Task.find(query).populate('assignedTo', 'name').sort('-createdAt');
    res.json({ success: true, tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo', 'name').populate('createdBy', 'name');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const team = await Team.findById(task.teamId);
    if (!team.members.includes(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this task' });
    }

    res.json({ success: true, task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const team = await Team.findById(task.teamId);
    const isLeader = team.leaderId.toString() === req.user._id.toString();
    const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();

    if (!isLeader && !isAssignee) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    const { title, description, assignedTo, priority, status, dueDate } = req.body;

    if (!isLeader && (title || description || assignedTo || priority || dueDate)) {
      return res.status(403).json({ success: false, message: 'Only leader can update task details other than status' });
    }

    if (assignedTo && !team.members.includes(assignedTo)) {
      return res.status(400).json({ success: false, message: 'Assigned user must be a team member' });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (assignedTo) {
      if (task.assignedTo?.toString() !== assignedTo.toString()) {
        await Notification.create({
          receiverId: assignedTo,
          type: 'TASK_ASSIGNED',
          message: `You have been assigned to task: ${task.title}`,
          relatedId: task._id
        });
      }
      task.assignedTo = assignedTo;
    }
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    
    if (status && task.status !== status) {
      task.status = status;
      // Notify leader if assignee changed status
      if (!isLeader) {
        await Notification.create({
          receiverId: team.leaderId,
          type: 'TASK_UPDATE',
          message: `Task "${task.title}" status changed to ${status}`,
          relatedId: task._id
        });
      }
    }

    await task.save();
    res.json({ success: true, task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const team = await Team.findById(task.teamId);
    if (team.leaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only team leader can delete tasks' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

