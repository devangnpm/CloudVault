const express = require("express");
const passport = require("passport");
const expressSession = require("express-session");
const path = require("path");
const {PrismaSessionStore} = require("@quixo3/prisma-session-store");
const {PrismaClient} = require("@prisma/client");
const userRouter = require("./routes/userRoutes");


const app = express();

// parses url-encoded request bodies into a JS object (req.body)
// handling form data encoded as application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// setting our views path and view engine to ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(passport.initialize());
app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use("/", userRouter);

app.listen(3000, console.log("Server Running 3000"));
