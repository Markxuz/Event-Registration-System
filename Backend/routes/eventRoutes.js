const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/create', eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.put('/:id/archive', eventController.archiveEvent);
router.put('/:id/restore', eventController.restoreEvent);


module.exports = router;