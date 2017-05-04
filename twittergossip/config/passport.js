var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var env = require('dotenv').config();

// Load up the user model
var User = require('../models/user');

// Load the auth variables
module.exports = function (passport) {
  // Used to serialize the user for the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Used to deserialize the user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // Code for login (use('local-login', new LocalStategy))
  // code for signup (use('local-signup', new LocalStategy))
 passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

        });

    }));




 // twitter oauth
  passport.use(new TwitterStrategy({

    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTERCALLBACK

  },
  function (token, tokenSecret, profile, done) {
      // Make the code asynchronous
  // User.findOne won't fire until we have all our data back from Twitter
    process.nextTick(function () {
      User.findOne({'twitter.id': profile.id}, function (err, user) {
              // If there is an error, stop everything and return that
              // ie an error connecting to the database
        if (err) {
          return done(err);
        }

              // If the user is found then log them in
        if (user) {
          return done(null, user, token, tokenSecret); // User found, return that user
        }

                  // If there is no user, create them
        var newUser = new User();

                  // Set all of the user data that we need
        newUser.twitter.id = profile.id;
        newUser.twitter.token = token;
        newUser.twitter.secret = tokenSecret;
        newUser.twitter.username = profile.username;
        newUser.twitter.displayName = profile.displayName;

                  // Save our user into the database
        newUser.save(function (err) {
          if (err) {
            throw err;
          }
          return done(null, newUser);
        });
      });
    });
  }));
};
