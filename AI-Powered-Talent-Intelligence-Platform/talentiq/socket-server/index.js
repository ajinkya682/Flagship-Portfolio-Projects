require('dotenv').config({ path: '../.env' }); // load from parent if needed, or specify
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // In production, restrict this to your domain
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // When a user joins the interview room
  socket.on('join-room', ({ roomId, userId }) => {
    socket.join(roomId);
    console.log(`User ${userId} (${socket.id}) joined room ${roomId}`);
    
    // Tell others in the room that a new user connected
    socket.to(roomId).emit('user-connected', { userId, socketId: socket.id });

    // Handle incoming WebRTC offers
    socket.on('offer', (payload) => {
      io.to(payload.target).emit('offer', {
        caller: socket.id,
        sdp: payload.sdp,
      });
    });

    // Handle WebRTC answers
    socket.on('answer', (payload) => {
      io.to(payload.target).emit('answer', {
        caller: socket.id,
        sdp: payload.sdp,
      });
    });

    // Handle ICE candidates
    socket.on('ice-candidate', (payload) => {
      socket.to(roomId).emit('ice-candidate', {
        caller: socket.id,
        candidate: payload.candidate,
      });
    });

    // Handle Media Toggles (Camera/Mic)
    socket.on('toggle-media', (payload) => {
      socket.to(roomId).emit('peer-media-toggled', {
        userId,
        ...payload
      });
    });

    // Handle Real-time Chat
    socket.on('chat-message', (payload) => {
      socket.to(roomId).emit('chat-message', payload);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected from room ${roomId}`);
      socket.to(roomId).emit('user-disconnected', { userId, socketId: socket.id });
    });
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebRTC Signaling Server running on port ${PORT}`);
});
