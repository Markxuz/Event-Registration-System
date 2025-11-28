const { Registration, Event, Participant, Payment } = require('../models');

// 1. Register Logic (Updated to create a Payment record)
exports.registerForEvent = async (req, res) => {
    try {
        const { event_id, participant_id } = req.body;

        // Check Capacity
        const event = await Event.findByPk(event_id);
        const currentCount = await Registration.count({ where: { event_id } });
        if (currentCount >= event.capacity) return res.status(400).json({ message: "Event is full!" });

        // Check Duplicate
        const existing = await Registration.findOne({ where: { event_id, participant_id } });
        if (existing) return res.status(400).json({ message: "Already registered!" });

        // Create Registration
        const newReg = await Registration.create({ event_id, participant_id });

        // AUTOMATICALLY Create a Pending Payment Record
        await Payment.create({
            registration_id: newReg.registration_id,
            amount: 0, // You can change this default later
            payment_status: 'Pending'
        });

        res.status(201).json({ message: "Success!", data: newReg });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get Full Dashboard Data (Joins tables)
exports.getDashboardData = async (req, res) => {
    try {
        const data = await Registration.findAll({
            include: [
                { model: Participant },
                { model: Event },
                { model: Payment }
            ]
        });
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Mark Attendance (Toggle Present/Absent)
exports.updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Present' or 'Absent'
        await Registration.update({ attendance_status: status }, { where: { registration_id: id } });
        res.json({ message: "Attendance updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Mark Payment (Toggle Paid/Pending)
exports.updatePayment = async (req, res) => {
    try {
        const { id } = req.params; // This is registrationid
        const { status } = req.body; // 'Paid' or 'Pending'
        
        // Check if a payment record exists for this registration
        const payment = await Payment.findOne({ where: { registration_id: id } });

        if (payment) {
            payment.payment_status = status;
            await payment.save();
        } else {
            await Payment.create({
                registration_id: id,
                amount: 0, // Default amount
                payment_status: status
            });
        }

        res.json({ message: "Payment updated" });
    } catch (error) {
        console.error("Payment Update Error:", error);
        res.status(500).json({ error: error.message });
    }
};