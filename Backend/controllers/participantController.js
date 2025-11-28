// backend/controllers/participantController.js
const { Participant } = require('../models'); // Import the model we made earlier

// 1. Logic to Register a new Participant
exports.registerParticipant = async (req, res) => {
    try {
        // Data coming from the Frontend (React)
        const { first_name, last_name, email, phone, organization_or_school } = req.body;

        // Validation: Check if email already exists
        const existingParticipant = await Participant.findOne({ where: { email } });
        if (existingParticipant) {
            return res.status(400).json({ message: 'Email already registered!' });
        }

        // Create the new Participant in MySQL
        const newParticipant = await Participant.create({
            first_name,
            last_name,
            email,
            phone,
            organization_or_school
        });

        // Send success response back to Frontend
        res.status(201).json({
            message: 'Participant registered successfully!',
            data: newParticipant
        });

    } catch (error) {
        console.error("Error registering participant:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// 2. Logic to Get All Participants (For the Admin Dashboard)
exports.getAllParticipants = async (req, res) => {
    try {
        const participants = await Participant.findAll();
        res.status(200).json(participants);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching participants' });
    }
};