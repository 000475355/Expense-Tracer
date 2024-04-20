const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; 

const err400 = ['Email, Password or name missing!'];
const err401 = ['Incorrect Credentials', 'User doesn\'t exist', 'Invalid token', 'Malformed token', 'No authorization header', 'You are not authorized to create an expense!', 'Please provide token'];
const err403 = ['Email already in use!'];
const err500 = ['Error connecting to the database'];

const UserRoutes = require('./routes/user');
const ExpenseRoutes = require('./routes/expense');

app.use(express.json());

mongoose.connect(process.env.MONGO_URL, { dbName: 'expense_tracker' })
  .then(() => console.log('Connected to the database'))
  .catch(error => console.error(`Error connecting to the database: ${error}`));

app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api/user', UserRoutes);
app.use('/api/expense', ExpenseRoutes);

// Handle 404 Not Found
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
});

// Centralized error handling
app.use((err, req, res, next) => {
    if (err400.includes(err.message)) {
        res.status(400).json({ message: err.message });
    } else if (err401.includes(err.message)) {
        res.status(401).json({ message: err.message });
    } else if (err403.includes(err.message)) {
        res.status(403).json({ message: err.message });
    } else if (err500.includes(err.message)) {
        res.status(500).json({ message: err.message });
    } else {
        next(err);
    }
});

app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));
