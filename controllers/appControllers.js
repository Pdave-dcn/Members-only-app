import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import {
  createUser,
  getPosts,
  createUserPost,
  updateUserMembership,
  deletePost,
} from "../db/queries.js";
import passport from "passport";
import { parse } from "dotenv";

const validateUser = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isAlpha()
    .withMessage("Must contain only letters"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isAlpha()
    .withMessage("Must contain only letters"),
  body("username").trim().notEmpty().withMessage("Username is required"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("A password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password do not match");
    }
    return true;
  }),
];

export const signUpPost = [
  validateUser,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signup", {
        errors: errors.array(),
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const username = req.body.username;

      const newUser = await createUser(
        firstName,
        lastName,
        username,
        hashedPassword
      );

      req.login(newUser, (err) => {
        if (err) return next(err);

        return res.redirect("/dashboard");
      });
    } catch (error) {
      console.error("Error in signUpPOST: ", error);
      res.status(500).render("signup", {
        errors: [{ msg: "Something went wrong. Please try again." }],
      });
    }
  },
];

export const signInPost = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Authentication failed
      return res.render("signin", {
        errors: [{ msg: info.message || "Authentication failed" }],
      });
    }
    // Authentication successful - log the user in
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Redirect to dashboard or home page after successful login
      return res.redirect("/dashboard");
    });
  })(req, res, next);
};

export const dashboardGet = async (req, res) => {
  const result = await getPosts();

  res.render("dashboard", { user: req.user, posts: result });
};

const validatePost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters"),
];

export const createPostPost = [
  validatePost,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createPost", { errors: errors.array() });
    }

    try {
      const userId = req.user.id;
      const postTitle = req.body.title;
      const postContent = req.body.content;

      await createUserPost(postTitle, postContent, userId);

      return res.redirect("/dashboard");
    } catch (error) {
      console.error("Error in createPostPost: ", error);
      res.status(500).render("createPost", {
        errors: [{ msg: "Something went wrong. Please try again." }],
      });
    }
  },
];

export const joinClubPost = [
  body("password").trim().notEmpty().withMessage("A password is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("joinClub", { errors: errors.array() });
    }

    const password = req.body.password;
    if (password !== process.env.CLUB_PASSWORD) {
      return res
        .status(400)
        .render("joinClub", { errors: [{ msg: "Incorrect password" }] });
    }

    const userId = req.user.id;
    const membershipStatus = "premium";

    await updateUserMembership(userId, membershipStatus);
    res.redirect("/dashboard");
  },
];

export const adminPost = [
  body("adminPassword").trim().notEmpty().withMessage("A password is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("adminForm", { errors: errors.array() });
    }

    const password = req.body.adminPassword;

    if (password !== process.env.ADMIN_PASSWORD) {
      return res
        .status(400)
        .render("adminForm", { errors: [{ msg: "Incorrect credentials" }] });
    }

    const userId = req.user.id;
    const membershipStatus = "admin";
    await updateUserMembership(userId, membershipStatus);

    res.redirect("/dashboard");
  },
];

export const deletePostGet = async (req, res) => {
  const postId = parseInt(req.params.id, 10);
  if (isNaN(postId)) {
    return res.status(400).render("dashboard", {
      errors: [{ msg: "Invalid post ID" }],
    });
  }

  try {
    await deletePost(postId);
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error in deletePostGet: ", error);
    res.status(500).render("dashboard", {
      errors: [{ msg: "Something went wrong. Please try again." }],
    });
  }
};
