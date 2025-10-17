const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io'); 
const connectDB = require('./config/db');

dotenv.config();

connectDB();

// Express App initialisieren
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? process.env.CLIENT_URL
      : 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.set('io', io);

// Middleware
app.use(express.json());

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL
    : 'http://localhost:5173',
  credentials: true
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/users', require('./routes/users'));
app.use('/api/trades', require('./routes/trades'));
app.use('/api/messages', require('./routes/messages'));

const connectedUsers = new Map(); 

io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('register', (userId) => {
    if (userId) {
      connectedUsers.set(userId, socket.id);
      console.log(`✅ User ${userId} registered with socket ${socket.id}`);
      console.log(`👥 Connected users: ${connectedUsers.size}`);
    }
  });

  socket.on('send_message', (data) => {
    const { receiverId, message } = data;
    
    // Finde Socket des Empfängers
    const receiverSocketId = connectedUsers.get(receiverId);
    
    if (receiverSocketId) {
      // Empfänger ist online → Sende direkt
      io.to(receiverSocketId).emit('receive_message', message);
      console.log(`💬 Message sent to ${receiverId} (online)`);
    } else {
      console.log(`📭 Message for ${receiverId} (offline - will see on next login)`);
    }
  });

  socket.on('typing', (data) => {
    const { receiverId, isTyping, username } = data;
    const receiverSocketId = connectedUsers.get(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_typing', {
        userId: data.senderId,
        username,
        isTyping
      });
    }
  });

  socket.on('disconnect', () => {
    // Finde und entferne User aus connectedUsers Map
    for (let [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`❌ User ${userId} disconnected`);
        break;
      }
    }
    console.log(`👥 Connected users: ${connectedUsers.size}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 Socket.io ready for connections`);
});