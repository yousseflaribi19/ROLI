require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cardRoutes = require('./routes/cardRoutes');
const userRoutes = require('./routes/userRoutes');
const shopRoutes = require('./routes/shopRoutes');


const bodyParser = require('body-parser');


const app = express();

connectDB();

app.use(cors());
app.use(helmet());
app.use(cookieParser());                    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes publiques
app.use('/api/auth', authRoutes);
app.use('/api/shop', shopRoutes);

// Routes  backoffices
app.use('/admin/cards', cardRoutes);
app.use('/admin/users', userRoutes);

// Config EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

module.exports = app;
