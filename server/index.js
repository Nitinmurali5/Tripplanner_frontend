require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Super Travel Backend is Alive' });
});

// Socket.io Collaboration Logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_trip', (tripId) => {
    socket.join(tripId);
    console.log(`User joined trip room: ${tripId}`);
  });

  socket.on('send_message', (data) => {
    socket.to(data.tripId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`[SERVER] Running on luxury channel: ${PORT}`);
});
