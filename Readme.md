Event Registration System 

A full-stack centralized system for managing events, participants, and registrations. Built with the MERN Stack + MySQL.

Tech Stack
Frontend:React.js (Vite), Tailwind CSS v4
Backend:Node.js, Express.js
Database:MySQL (managed via Sequelize ORM)



Prerequisites
Before running this project, make sure you have:
Node.js installed.
MySQL Server* (MySQL Workbench or XAMPP) running.



How to Run the Project

Database Setup
Open MySQL Workbench or open nalang ng CMD tapos "mysql -u root -p" after non enter nyo password ng database nyo.
then run this query to create the empty database:

    CREATE DATABASE event_registration_system;
    
    Note: You do not need to create tables. The code will do that automatically via Sequelize!


Backend Setup (The Server)
Open a terminal and navigate to the backend folder:

    cd Backend

Install dependencies:

    npm install

Configure your Database Password.
    Open `Backend/config/database.js`.
    Change `'root'` and `'your_password'` to match your laptop's MySQL credentials.

Start the server:

    node server.js

    You should see: "Database Synced & Ready! Server running on port 3000"

Frontend Setup (The UI)
Open  new terminal window (keep the backend running).
Navigate to the React app folder:

    cd Frontend/"Registration Sytem"

Install dependencies:

    npm install

Start the application:

    npm run dev

Open the link shown (usually `http://localhost:5173`).




Participant Registration (Public View)

Select an event from the dropdown and fill in your details to register.

Admin Dashboard
`http://localhost:5173/admin`
View a list of all registered participants.
See stats on total participants and active events.

Create Event
`http://localhost:5173/create-event`
(Or click the "+ Create Event" button on the Dashboard).
Add new events to the system.


Project Structure

/Backend
  ├── /config       # Database connection
  ├── /controllers  # Logic for saving/reading data
  ├── /models       # SQL Table definitions
  ├── /routes       # API Endpoints
  └── server.js     # Main entry point

/Frontend
  └── /Registration Sytem  # React App
      ├── /src
      │   ├── App.jsx           # Routes
      │   ├── Dashboard.jsx     # Admin View
      │   ├── CreateEvent.jsx   # Event Form
      │   └── RegistrationForm.jsx # Public Form