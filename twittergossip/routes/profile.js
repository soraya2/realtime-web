// App/routes.js
var express = require('express'),
    router = express.Router(),
    https = require('https'),
    concat = require('concat-stream'),
    User = require('../models/user'),
    twit = require('twitter');

module.exports = function(passport, io) {
    var allTweets = [];
    var users = [];
    var connections = [];
    var usersId = [];

    router.get('/', isLoggedIn, function(req, res) {
        var userId = req.user.id;
        // Find user in database
        io.sockets.on('connection', function(socket) {
            User.findById(userId, function(err, doc) {

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
                        saveData({ 'twitter.username': req.user.twitter.username }, 'twitter.friends', [tweets]);
                    }
                });

                twitter.stream('user', function(stream) {
                    stream.on('data', function(data) {

                        var newTweet = { name: data.user.name, tweet: data.text, date: data.created_at };
                        allTweets.push(newTweet);

                        console.log('tweets loaded');
                        saveData({ 'twitter.username': req.user.twitter.username }, 'twitter.tweets', allTweets);

                    });
                });
            }); 

            //Callback data gets the data from the user stored in the database.
            function callbackData(userTimeline, usersFriends) {
                var number = 0;
                // console.log(usersFriends.length);


                function myTimer() {
                    var randomUserFriends = randomFriends(usersFriends);
                    var randomPositionNumber = Math.floor(Math.random() * randomUserFriends.length);


                    if (userTimeline[number].name) {
                        // console.log('yes');

                        var index = randomUserFriends.indexOf(userTimeline[number].name);


                        if (number !== userTimeline.length) {
                            randomUserFriends.splice(randomPositionNumber, 0, userTimeline[number].name);

                            if (index > -1) {
                                randomUserFriends.splice(index, 1);
                            }
                            number++;
                        }
                        socket.emit('time', { info: userTimeline[number], friends: randomUserFriends });
                    } else {
                        console.log('no');
                    }
                }
                setInterval(function() { myTimer(); }, 5000);

            }
            getUserData({ 'twitter.username': req.user.twitter.username }, callbackData);
        }); 
        res.render('profile', { title: 'profile', username: req.user.twitter.username, displayname: req.user.twitter.displayName });
    });

    return router;
};

// Check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
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
        callback(document.twitter.tweets, document.twitter.friends);
    });

}

function randomFriends(data) {
    var usersFriends = [];
    var arr = [];

    // Get random friends from user account
    while (arr.length < 3) {
        if (data[0].users) {


            var randomnumber = Math.floor(Math.random() * data[0].users.length);

            if (arr.indexOf(randomnumber) > -1) {
                continue;
            }
            arr[arr.length] = randomnumber;
        } else {
            console.log('no friends');
        }
    }

    for (var i = 0; i < arr.length; i++) {
        usersFriends.push(data[0].users[arr[i]].name);
    }

    return usersFriends;
}
