const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

// Existing Route
router.post('/', registrationController.registerForEvent);

// NEW Routes for Dashboard
router.get('/dashboard', registrationController.getDashboardData); // Get full list
router.put('/:id/attendance', registrationController.updateAttendance); // Update attendance
router.put('/:id/payment', registrationController.updatePayment); // Update payment

module.exports = router;