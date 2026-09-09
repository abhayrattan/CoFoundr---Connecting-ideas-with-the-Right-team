const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Team = require('./models/Team');
const Message = require('./models/Message');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return next(new Error('User not found'));
    
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.name} (${socket.id})`);
  
  socket.broadcast.emit('userOnline', socket.user._id);

  socket.on('joinTeamRoom', async (teamId) => {
    try {
      const team = await Team.findById(teamId);
      if (team && team.members.includes(socket.user._id)) {
        socket.join(teamId);
        console.log(`${socket.user.name} joined room ${teamId}`);
      }
    } catch (err) {
      console.error('Error joining team room', err);
    }
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { teamId, content } = data;
      if (!content || !content.trim()) return;

      const team = await Team.findById(teamId);
      if (team && team.members.includes(socket.user._id)) {
        const message = await Message.create({
          teamId,
          senderId: socket.user._id,
          content
        });
        
        const populatedMsg = await Message.findById(message._id).populate('senderId', 'name');
        
        io.to(teamId).emit('receiveMessage', populatedMsg);
      }
    } catch (err) {
      console.error('Error sending message', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.name}`);
    io.emit('userOffline', socket.user._id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
