require('dotenv').config();
const express = require('express');
const path = require('path');

const { connectDB } = require('./config/db');
const { cloudinaryConfig } = require('./config/cloudinary');
const securityMiddleware = require('./middleware/security');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const mediaRoutes = require('./routes/media');

const app = express();

// Connect to DB
connectDB();

// Cloudinary config
cloudinaryConfig();

// Security & parsers
securityMiddleware(app);

// JSON parsing
app.use(express.json({ limit: '5mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
