const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
require('dotenv').config();

const session = require('express-session');

// connect-mongo export can vary (CJS vs ESM default export)
const ConnectMongo = require('connect-mongo');
const MongoStore = ConnectMongo.default || ConnectMongo;

// Routers
const authRouter = require('./routes/auth');
const tripsRouter = require('./routes/trips');

const app = express();

/* ======================= DATABASE ======================= */
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

/* ======================= VIEW ENGINE ======================= */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ======================= MIDDLEWARE ======================= */
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

/* ======================= SESSIONS ======================= */
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create
      ? MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
      : new MongoStore({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { httpOnly: true },
  })
);

// Make userId available in all EJS views
app.use((req, res, next) => {
  res.locals.userId = req.session.userId || null;
  next();
});

/* ======================= ROUTES ======================= */
app.get('/', (req, res) => {
  res.render('home');
});

app.use('/auth', authRouter);
app.use('/trips', tripsRouter);

/* ======================= SERVER ======================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});




