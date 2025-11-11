require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRoutes);

// Moteur EJS pour backoffice
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

module.exports = app;
