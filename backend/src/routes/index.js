const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');

// Mount routes
router.use('/auth', authRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
