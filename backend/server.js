const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

// Middleware do logowania zapytań w trybie developerskim
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Trasy
const recipeRoutes = require('./routes/recipeRoutes');
const authRoutes = require('./routes/auth');

app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes);

// Statyczny folder na przesyłane pliki
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
