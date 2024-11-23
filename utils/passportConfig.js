const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("brcryptjs");
const asyncHandler = require("express-async-handler");
const {findUserByUsername,findUserByID }= require("../db/queries");
const passport = require("passport");

passport.use(
  new LocalStrategy(
    asyncHandler(async (username, password, done) => {
      // step 1 - retrieving user object by username
      const user = await findUserByUsername(username);

      console.log(user);

      if (!user) {
        return done(null, false, {
          message: "Username not found or incorrect",
        });
      }

      // step2 - validating user provided pass with hash pass in db
      const passwordMatch = await bcrypt.compare(
        password,
        user.hashed_password,
      );

      // step3 - if password not found return msg
      if (!passwordMatch) {
        console.log("Incorrect password");
        return done(null, false, { message: "Password is incorrect" });
      }

      // Authentication succeeded
      return done(null, user);
    })
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.user_id);
});


passport.deserializeUser(
  asyncHandler(async (user_id, done) => {
    try {
      const user = await findUserByID(user_id);
      done(null, user); // Pass the user object back to the session
    } catch (error) {
      done(error); // Pass any errors back to the done callback
    }
  })
);
