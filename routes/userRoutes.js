const express = require("express");
const asyncHandler = require("express-async-handler");
const {validateUser} = require("../utils/userValidator");
const { createUser } = require("../controllers/userController");
const passport = require("../utils/passportConfig");



const userRouter = express.Router();

//wrapping in asynchandler to avoid try catch and pass to error handling middleware

userRouter.get(
  "/login",
  asyncHandler(async (req, res) => {
    res.render("login");
  })
);

userRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  }),
);

userRouter.get(
  "/signup",
  asyncHandler(async (req, res) => {
    res.render("signup");
  })
);

userRouter.post(
  "/signup",
  validateUser,
  createUser,

);

// Dashboard route (only accessible after authentication)
userRouter.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: "Welcome to the dashboard", user: req.user });
  } else {
    res.redirect("/login");
  }
});

module.exports = userRouter;
