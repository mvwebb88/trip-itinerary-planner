// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const connectMongo = require("connect-mongo");
const path = require("path");

const authRouter = require("./routes/auth");
const tripsRouter = require("./routes/trips");

const app = express();
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.path);
  next();
});


const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET || "devsecret";

// Connect DB
(async function connectToMongo() {
  try {
    if (!MONGODB_URI) {
      console.log("⚠️ Missing MONGODB_URI. Server will run without DB.");
      return;
    }
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.log("❌ MongoDB connection error:", err.message);
  }
})();

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(morgan("dev"));

// Sessions
const sessionOptions = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true },
};

// Session store
if (MONGODB_URI) {
  const cm = connectMongo.default || connectMongo;

  if (typeof cm.create === "function") {
    sessionOptions.store = cm.create({
      mongoUrl: MONGODB_URI,
      collectionName: "sessions",
    });
  } else if (typeof cm === "function") {
    const MongoStore = cm(session);
    sessionOptions.store = new MongoStore({
      mongoUrl: MONGODB_URI,
      collectionName: "sessions",
    });
  }
}

app.use(session(sessionOptions));

// Locals
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.get("/", (req, res) => res.render("home"));
app.use("/auth", authRouter);
app.use("/trips", tripsRouter);

// Start
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));






