// App/routes.js
var https = require('https');
var concat = require('concat-stream');
var User = require('../models/user');
var twit = require('twitter');
module.exports = function (app, passport, io) {
  app.get('/', function (req, res) {
    res.render('index', {title: 'Home'});
  });

  app.get('/login', function (req, res) {
        // Render the page and pass in any flash data if it exists
    res.render('login', {title: 'Login'});
  });

  app.get('/signup', function (req, res) {
        // Render the page and pass in any flash data if it exists
    res.render('signup', {title: 'signup'});
  });

  app.get('/oauth/twitter', passport.authenticate('twitter'));

    // Handle the callback after twitter has authenticated the user
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {successRedirect: '/profile', failureRedirect: '/', failureFlash: true}));

  app.get('/profile', isLoggedIn, function (req, res) {

  // find user in database
    User.findById(req.user.id, function (err, doc) {

      var usersFriends = [];
      var twitter = new twit({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: doc.twitter.token,
        access_token_secret: doc.twitter.secret
      });
      var params = {screen_name: 'susu_2'};
      twitter.get('friends/list', params, function (error, tweets, response) {
        if (!error) {
            // Get random friends from user account
          var arr = [];
          while (arr.length < 3) {
            var randomnumber = Math.floor(Math.random() * tweets.users.length);
            if (arr.indexOf(randomnumber) > -1) {
              continue;
            }
            arr[arr.length] = randomnumber;
          }
            // Console.log(arr);

          for (var i = 0; i < arr.length; i++) {
                // Things[i]
            var rand = tweets.users[arr[i]];
          }
          // console.log(rand);
          usersFriends.push(rand);
        }
      });

      twitter.get('user', function (stream) {

      });

            // User api is very very very slow
      // Twitter.stream('user',function (stream) {
      twitter.stream('statuses/filter', {track: 'news', stall_warnings: true}, function (stream) {
        stream.on('data', function (data) {

          function myFunction() {
            setInterval(function () {
              io.sockets.in('timer').emit('time', {info: data });
            }, 5000);
          }myFunction();
        });

        // stream.destroy();
      });
    });
    console.log(req.user.twitter.username);
    res.render('profile', {title: 'profile', username: req.user.twitter.username,  displayname: req.user.twitter.displayName});
  });

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });
};

// Check if user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}

