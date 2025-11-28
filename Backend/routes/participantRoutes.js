// backend/routes/participantRoutes.js
const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');

// Define the endpoints
router.post('/register', participantController.registerParticipant); // POST request to create
router.get('/', participantController.getAllParticipants);           // GET request to read

module.exports = router;