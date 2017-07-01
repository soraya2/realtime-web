// App/routes.js
var express = require('express');
var router = express.Router();
var https = require('https');
var concat = require('concat-stream');
var User = require('../models/user');
var twit = require('twitter');

module.exports = function(passport, io) {
    var allTweets = [];
    var users = [];
    var connections = [];
    var usersId = [];

    // app.get('/', function (req, res) {
    //   res.render('index', {title: 'Home'});
    // });

    // app.get('/login', function (req, res) {
    //       // Render the page and pass in any flash data if it exists
    //   res.render('login', {title: 'Login'});
    // });

    // app.get('/signup', function (req, res) {
    //       // Render the page and pass in any flash data if it exists
    //   res.render('signup', {title: 'signup'});
    // });

    // app.get('/oauth/twitter', passport.authenticate('twitter'));


    //   // Handle the callback after twitter has authenticated the user
    // app.get('/auth/twitter/callback', passport.authenticate('twitter', {successRedirect: '/profile', failureRedirect: '/', failureFlash: true}));

    router.get('/', isLoggedIn, function(req, res) {
        var userId = req.user.id;
        // Find user in database
        io.sockets.on('connection', function(socket) {
            User.findById(userId, function(err, doc) {
                // console.log(socket.id);

                // var number = 0;

                var twitter = new twit({
                    consumer_key: process.env.TWITTER_CONSUMER_KEY,
                    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                    access_token_key: doc.twitter.token,
                    access_token_secret: doc.twitter.secret
                });
                var params = { screen_name: doc.twitter.username };
                twitter.get('friends/list', params, function(error, tweets, response) {
                    if (err) {
                        return err;
                    }

                    if (!error) {
                        // getUserFriends(tweets);


                        saveData({ 'twitter.username': req.user.twitter.username }, 'twitter.friends', [tweets]);


                    }
                });

                twitter.stream('user', function(stream) {
                    stream.on('data', function(data) {

                        var newTweet = { name: data.user.name, tweet: data.text, date: data.created_at };
                        allTweets.push(newTweet);

                        // console.log(data.created_at);
                        // req.user.twitter.tweets = ['req.user.username'];

                        console.log('tweets loaded');
                        saveData({ 'twitter.username': req.user.twitter.username }, 'twitter.tweets', allTweets);

                        // User.findOne(req.user.twitter.username, function(err, docs) {
                        // Make sure the database only stores unique values
                        // function databaseCheck() {
                        //     if (docs.twitter.tweets.length > 0) {
                        //         function isBigEnough(value) {
                        //             var testTweet = docs.twitter.tweets.map(function(e) {
                        //                 return e.tweet;
                        //             }).indexOf(value.tweet.substr(0, 20));

                        //             if (testTweet === -1) {
                        //                 return true;
                        //             }
                        //             return false;
                        //         }

                        //         var filtered = allTweets.filter(isBigEnough);

                        //         return filtered;
                        //     } else if (docs.twitter.tweets.length === 0) {
                        //         console.log('no tweets', allTweets[0]);

                        //         return [allTweets[0]];
                        //     }
                        // }

                        // });

                    });
                });

            }); 
            var number = 0;

            function callbackData(userTimeline, usersFriends) {
                console.log(usersFriends.length);
                // var tweets = JSON.parse(userTimeline);
                // var friends = JSON.parse(argument2);
                function myTimer() {



                    var randomPositionNumber = Math.floor(Math.random() * usersFriends.length);

                    usersFriends.splice(randomPositionNumber, 0, { name: userTimeline[number].name });
                    // usersFriends.join();
                    if (number !== userTimeline.length) {
                        number++;
                    }
                    console.log(userTimeline[number], 'argument2');

                    socket.emit('time', { info: userTimeline[number], friends: usersFriends });
                    var index = usersFriends.indexOf(userTimeline[number].name);
                    if (index > -1) {
                        usersFriends.splice(index, 1);

                        // console.log(usersFriends.length);
                    }
                }
                setInterval(function() { myTimer(); }, 5000);
            }
            getUserData({ 'twitter.username': req.user.twitter.username }, callbackData);

            // console.log('why?');

        }); 
        res.render('profile', { title: 'profile', username: req.user.twitter.username, displayname: req.user.twitter.displayName });
    });



    // app.get('/logout', function (req, res) {
    //   req.logout();
    //   res.redirect('/');
    // });


    // app.get('/*', function (err, req, res, next) {
    //     res.status(err.status || 500);
    //     res.render('error', {
    //       message: err.message,
    //       error: {}
    //     });
    //   });

    return router;
};
// Check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}

function getUserFriends(tweets) {
    // setInterval(function() {


    // socket.emit('time', { info: doc.twitter.tweets[number], friends: usersFriends });
    // }, 3000);

    // saveData(query, arrayName, data);
}

function saveData(query, arrayName, data) {
    var addToSet = {};
    addToSet[arrayName] = { $each: data };
    // only store unique values and ignore duplicates
    User.findOneAndUpdate(query, {
        "$addToSet": addToSet

    }, { upsert: true, unique: true, sparse: true }, function(err) {
        if (err) {
            return console.log(err);
        }
    });
}

function getUserData(query, callback) {

    User.findOne(query, function(err, document) {
        if (err) {
            return console.log(err);
        }
        // console.log(document);

        // document.twitter.tweets

        // document.twitter.friends
        // randomFriends(document.twitter.friends);

        callback(document.twitter.tweets, randomFriends(document.twitter.friends));


    });


}


function randomFriends(data) {

    var usersFriends = [];
    // Get random friends from user account
    var arr = [];

    while (arr.length < 3) {

        var randomnumber = Math.floor(Math.random() * data[0].users.length);
        if (arr.indexOf(randomnumber) > -1) {
            continue;
        }

        arr[arr.length] = randomnumber;
    }

    for (var i = 0; i < arr.length; i++) {

        usersFriends.push(data[0].users[arr[i]]);

    }
    // var randomPositionNumber = Math.floor(Math.random() * usersFriends.length);

    // usersFriends.splice(randomPositionNumber, 0, { name: doc.twitter.tweets[number].name });
    // usersFriends.join();

    // console.log(usersFriends);
    // if (number !== doc.twitter.tweets.length) {
    //     number++;
    // }
    // console.log(usersFriends.length);
    return usersFriends;
}
