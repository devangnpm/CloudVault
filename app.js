const express = require("express");
const expressSession = require("express-session");
const path = require("path");
const {PrismaSessionStore} = require("@quixo3/prisma-session-store");
const {PrismaClient} = require("@prisma/client");
const userRouter = require("./routes/userRoutes");
const passport = require("./utils/passportConfig");
const methodOverride = require('method-override');


const app = express();

// parses url-encoded request bodies into a JS object (req.body)
// handling form data encoded as application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// setting our views path and view engine to ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "a santa at nasa", // use env variable always
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),

  })
);

app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use("/", userRouter);

// Global error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message || "Something went wrong!",
    // You can send the error details here if needed (for development purposes)
    // err: err, 
  });
});


app.listen(3000, console.log("Server Running 3000"));
