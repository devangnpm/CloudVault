const express = require("express");
const asyncHandler = require("express-async-handler");

const userRouter = express.Router();

//wrapping in asynchandler to avoid try catch and pass to error handling middleware

userRouter.get("/login", asyncHandler(async (req,res) => {
    res.render("login");
}));

userRouter.get("/signup", asyncHandler(async (req, res) => {
    res.render("signup");
}));

userRouter.post("/signup", 

userRouter.get("/dashboard", asyncHandler(async (req, res) => {
    res.render("dashboard");
}));

module.exports = [
    userRouter
]