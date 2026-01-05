// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");

const authRouter = require("./routes/auth");
const tripsRouter = require("./routes/trips");
const isSignedIn = require("./middleware/isSignedIn");

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const SESSION_SECRET = process.env.SESSION_SECRET || "devsecret";

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true },
};

if (MONGODB_URI) {
  sessionOptions.store = MongoStore.create({
    mongoUrl: MONGODB_URI,
    collectionName: "sessions",
  });
}

app.use(session(sessionOptions));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/auth", authRouter);

app.use("/trips", isSignedIn, tripsRouter);

app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});







