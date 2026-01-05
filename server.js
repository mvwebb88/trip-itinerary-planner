// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const morgan = require("morgan");
const methodOverride = require("method-override");
const session = require("express-session");

// Routes
const authRouter = require("./routes/auth");
const tripsRouter = require("./routes/trips");

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET || "devsecret";

// ✅ Heroku is behind a proxy (needed for secure cookies)
app.set("trust proxy", 1);

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Connect DB
(async function connectDB() {
  try {
    if (!MONGODB_URI) {
      console.log("⚠️ MONGODB_URI missing. App will run but DB features will fail.");
      return;
    }
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
})();

// ✅ CONNECT-MONGO (deployment-safe import)
let MongoStoreLib;
try {
  MongoStoreLib = require("connect-mongo");
} catch (e) {
  console.error("❌ connect-mongo not installed. Did you run npm i?");
}

// ✅ Session config
const sessionOptions = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // secure cookies only in production (Heroku)
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
};

// ✅ Build the store in a way that works across connect-mongo versions
if (MONGODB_URI && MongoStoreLib) {
  // Newer versions: MongoStore.create(...)
  if (typeof MongoStoreLib.create === "function") {
    sessionOptions.store = MongoStoreLib.create({
      mongoUrl: MONGODB_URI,
      collectionName: "sessions",
    });
  }
  // Older versions: connect-mongo returns a function that takes session
  else if (typeof MongoStoreLib === "function") {
    const MongoStore = MongoStoreLib(session);
    sessionOptions.store = new MongoStore({
      mongooseConnection: mongoose.connection,
      collection: "sessions",
    });
  }
}

app.use(session(sessionOptions));

// Make logged-in user available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Home
app.get("/", (req, res) => {
  res.render("home");
});

// Routes
app.use("/auth", authRouter);
app.use("/trips", tripsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});








