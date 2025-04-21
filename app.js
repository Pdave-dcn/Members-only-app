import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { router } from "./routes/appRoutes.js";
import passport from "passport";
import session from "express-session";
import pgSession from "connect-pg-simple";
import localStrategy from "passport-local";
import { getUserByUsername } from "./db/queries.js";
import pool from "./db/pool.js";
import bcrypt from "bcryptjs";

const PORT = 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
const PostgresqlStore = pgSession(session);
const sessionStore = new PostgresqlStore({
  pool: pool,
  createTableIfMissing: true,
  tableName: "session",
});

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: false,
      httpOnly: true,
      path: "/",
      sameSite: "strict",
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

const LocalStrategy = localStrategy.Strategy;
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await getUserByUsername(username);

      if (!user) return done(null, false, { message: "Incorrect username" });

      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );

      if (!isValidPassword)
        return done(null, false, { message: "Incorrect password" });

      done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = result.rows[0];
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
