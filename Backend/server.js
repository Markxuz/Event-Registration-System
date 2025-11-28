const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
app.use(express.json());
app.use(cors());

// Import Routes
const participantRoutes = require('./routes/participantRoutes');
const eventRoutes = require('./routes/eventRoutes');          // <--- NEW
const registrationRoutes = require('./routes/registrationRoutes'); // <--- NEW

// Use Routes
app.use('/api/participants', participantRoutes);
app.use('/api/events', eventRoutes);              // <--- NEW
app.use('/api/registrations', registrationRoutes); // <--- NEW

sequelize.sync({ alter: true })
    .then(() => {
        console.log("✅ Database Synced & Ready!");
        app.listen(3000, () => console.log("🚀 Server running on port 3000"));
    })
    .catch(err => console.log(err));