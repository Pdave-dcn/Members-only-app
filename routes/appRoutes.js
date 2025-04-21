import express from "express";
import {
  signUpPost,
  signInPost,
  dashboardGet,
  createPostPost,
  joinClubPost,
  adminPost,
  deletePostGet,
} from "../controllers/appControllers.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", signUpPost);

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/signin", signInPost);

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
};

router.get("/dashboard", isAuthenticated, dashboardGet);

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/create-post", isAuthenticated, (req, res) => {
  res.render("createPost", { errors: [] });
});
router.post("/create-post", isAuthenticated, createPostPost);
export { router };

router.get("/join-club", isAuthenticated, (req, res) => {
  res.render("joinClub", { errors: [] });
});
router.post("/join-club", isAuthenticated, joinClubPost);

router.get("/admin", isAuthenticated, (req, res) => {
  res.render("adminForm", { errors: [] });
});
router.post("/admin", isAuthenticated, adminPost);

router.get("/delete-post/:id", isAuthenticated, deletePostGet);
