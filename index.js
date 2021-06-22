const express = require('express');
const conectDB = require('./config/db');
const cors = require('cors');

// Create Server.
const app = express();

// Conect DB.
conectDB();

// CORS
app.use(cors());

// express.json
app.use(express.json({ extended: true }));

// Port App
const PORT = process.env.PORT || 4000;

// Import routes.
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// Run app
app.listen(PORT, () => {
	console.log(`Server in ${PORT}`);
});
