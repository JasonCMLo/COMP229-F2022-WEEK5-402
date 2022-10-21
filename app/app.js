// Third-Party Modules
import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";

// ES Modules fix for __dirname
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

// Auth step 1 - import modules
import passport from "passport";
import passportLocal from "passport-local";
import flash from "connect-flash";

// Auth step 2 - define auth strategy
let localStrategy = passportLocal.Strategy;

// Auth step 3 - import user model
import User from "./models/user.js";

// Import Mongoose Module
import mongoose from "mongoose";

// Configuration Module
import { MongoURI, Secret } from "../config/config.js";

// Import Routes
import indexRouter from "./routes/index.route.server.js";
import movieRouter from "./routes/movies.route.server.js";
import authRouter from "./routes/auth.route.server.js";

// Instantiate Express Application
const app = express();

// Complete the DB Configuration
mongoose.connect(MongoURI);
const db = mongoose.connection;

//Listen for connection success or error
db.on("open", () => console.log("Connected to MongoDB"));
db.on("error", () => console.log("Mongo Connection Error"));

// Set Up Middlewares

// Setup ViewEngine EJS
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname,'/client')));
app.use(express.static(path.join(__dirname, "../public")));

// Auth step 4 - Setup Express session
app.use(
  session({
    secret: Secret,
    saveUninitialized: false,
    resave: false,
  })
);

// Auth step 5 - steup flash
app.use(flash());

// Auth step 6 - initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Auth step 7 - implement the auth strategy
passport.use(User.createStrategy());

// Auth step 8 - setup serialization and deserialization

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Use Routes
app.use("/", indexRouter);
app.use("/", movieRouter);
app.use("/", authRouter);

export default app;
