const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import the connection we just made

// --- 1. Define the Tables ---

// Event Table
const Event = sequelize.define('Event', {
    event_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    venue: { type: DataTypes.STRING, allowNull: false },
    event_date: { type: DataTypes.DATE, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('Upcoming', 'Ongoing', 'Completed', 'Cancelled'), defaultValue: 'Upcoming' },
    is_archived: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Participant Table
const Participant = sequelize.define('Participant', {
    participant_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING },
    organization_or_school: { type: DataTypes.STRING }
});

// Registration Table (Links Events & Participants)
const Registration = sequelize.define('Registration', {
    registration_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    attendance_status: { type: DataTypes.ENUM('Registered', 'Present', 'Absent'), defaultValue: 'Registered' }
});

// Payment Table
const Payment = sequelize.define('Payment', {
    payment_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_status: { type: DataTypes.ENUM('Pending', 'Paid', 'Unpaid'), defaultValue: 'Pending' },
    recorded_by: { type: DataTypes.STRING }
});

// --- 2. Define Relationships (Associations) ---

// Event <-> Registration
Event.hasMany(Registration, { foreignKey: 'event_id' });
Registration.belongsTo(Event, { foreignKey: 'event_id' });

// Participant <-> Registration
Participant.hasMany(Registration, { foreignKey: 'participant_id' });
Registration.belongsTo(Participant, { foreignKey: 'participant_id' });

// Registration <-> Payment
Registration.hasOne(Payment, { foreignKey: 'registration_id' });
Payment.belongsTo(Registration, { foreignKey: 'registration_id' });

// --- 3. Export Everything ---
module.exports = { sequelize, Event, Participant, Registration, Payment };