const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes'); // 1. Import the food routes

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

app.use(cors()); 
app.use(express.json()); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes); // 2. Use the food routes

app.get('/', (req, res) => {
    res.send("🍔 Food Delivery App API is Live!");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));