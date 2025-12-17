const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
require('dotenv').config();

const session = require('express-session');

// connect-mongo can export differently depending on version/build (CJS vs ESM)
// This setup works across common variations.
const ConnectMongo = require('connect-mongo');
const MongoStore = ConnectMongo?.default || ConnectMongo;

// Routers
const authRouter = require('./routes/auth');

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
let sessionStore;

// Prefer MongoStore.create() when available (most common)
if (MongoStore && typeof MongoStore.create === 'function') {
  sessionStore = MongoStore.create({ mongoUrl: process.env.MONGODB_URI });
} else {
  // Fallback: constructor-style store (some builds/versions)
  sessionStore = new MongoStore({ mongoUrl: process.env.MONGODB_URI });
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { httpOnly: true },
  })
);

// Make userId available in ALL EJS views
app.use((req, res, next) => {
  res.locals.userId = req.session.userId || null;
  next();
});

/* ======================= ROUTES ======================= */
app.get('/', (req, res) => {
  res.render('home');
});

app.use('/auth', authRouter);

// Optional: temporary placeholder 
app.get('/trips', (req, res) => {
  res.send('Trips route coming next ✅');
});

/* ======================= SERVER ======================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


