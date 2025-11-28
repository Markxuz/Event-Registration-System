const { Event } = require('../models');

// Create a new Event
exports.createEvent = async (req, res) => {
    try {
        const { name, description, venue, event_date, capacity } = req.body;
        const newEvent = await Event.create({ name, description, venue, event_date, capacity });
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.findAll();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Soft delete ng event
exports.archiveEvent = async (req, res) => {
    try {
        const { id } = req.params;
        // Instead of deleting, we flag it as archived (Soft Delete)
        await Event.update({ is_archived: true }, { where: { event_id: id } });
        res.json({ message: "Event archived" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};