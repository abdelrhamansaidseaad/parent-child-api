require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/parent', require('./routes/parentRoutes'));
app.use('/api/v1/child', require('./routes/childRoutes'));

// Test endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'API Working', timestamp: new Date() });
});

// Error handling
app.use(require('./middlewares/errorHandler'));

module.exports = app;