const { Sequelize } = require('sequelize');

// ⚠️ CHANGE 'root' and 'your_password' to your actual MySQL credentials
const sequelize = new Sequelize('event_registration_system', 'root', 'Airewnansm2626', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Set to true if you want to see SQL queries in the terminal
});

module.exports = sequelize;