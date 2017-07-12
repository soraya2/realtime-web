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
    var userNames = [];
    var lastTime = 0;
    var stop = false;
    var userHighscore;

    var number = 0;
    router.get('/', isLoggedIn, function(req, res) {
        io.sockets.on('connection', function(socket) {
            var userId = req.user.id;
            // Find user in database
            var usernameIndex = userNames.indexOf(req.user.twitter.username);
            if (usernameIndex === -1) {
                userNames.push(req.user.twitter.username);
                // console.log(userNames);
            }
            socket.emit('send username', { name: userNames });

            socket.emit('new user', { userId: req.user.twitter.username });

            socket.on('new highScore', function(data) {
                console.log(data);
                data.username = req.user.twitter.username;

                updateField(req.user.twitter.username, 'twitter.highscore', data.score);
                socket.broadcast.emit('highscore', data);

            });

            socket.on('user data', function(data) {
                console.log(data);

                socket.emit('final data', data);
            });

            User.findById(userId, function(err, document) {
                var promise = new Promise(function(resolve) {

                    if (document) {
                        resolve(document);
                    }
                });

                promise.then(function(result) {

                    callback(result);

                }, function(err) {
                    console.log(err); // Error: "It broke"
                });


                function callback(doc) {

                    var twitter = new twit({
                        consumer_key: process.env.TWITTER_CONSUMER_KEY,
                        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                        access_token_key: doc.twitter.token,
                        access_token_secret: doc.twitter.secret
                    });

                    var params = { screen_name: doc.twitter.username };
                    if (doc.twitter.friends.length < 3) {
                        console.log('you have tweets');

                        twitter.get('friends/list', params, function(error, friends, response) {
                            if (err) {
                                return err;
                            }

                            if (!error) {

                                saveData({ 'twitter.username': req.user.twitter.username }, 'twitter.friends', friends.users);
                            }
                        });

                    }
                    if (doc.twitter.tweets.length >= 10) {

                        getUserData({ 'twitter.username': req.user.twitter.username }, callbackData);

                    } else {
                        console.log('back up data');
                        backupData(twitter, req.user.twitter.username, allTweets, params, callbackData);
                    }
                    if (doc.twitter.tweets.length < 100) {
                        twitter.stream('user', function(stream) {


                            stream.on('data', function(data) {

                                var newTweet = { name: data.user.name, tweet: data.text, date: data.created_at };
                                allTweets.push(newTweet);

                                console.log('tweets loaded');
                                if (allTweets.length <= 50) {

                                    saveData({ 'twitter.username': req.user.twitter.username }, 'twitter.tweets', allTweets);

                                    // getUserData({ 'twitter.username': req.user.twitter.username }, callbackData);
                                } else {
                                    console.log('stop');

                                    stream.destroy();
                                    // getUserData({ 'twitter.username': req.user.twitter.username }, callbackData);

                                }
                            });
                            stream.on('error', function(error) {
                                console.log(error, "ERROR HAS OCCURED LOOK FOR STATUSCODE");
                            });

                        });
                    }
                }

                var lastTime2 = 0;
                var time = ((new Date() - lastTime) / 60000).toFixed(1);
                var timer;

                function getInfo(tweet) {

                    var time = ((new Date() - lastTime2) / 60000);
                    var seconds = (time - Math.floor(time)).toFixed(1);

                    // De first seconds seconds is larger then 0.7 (because of new date).
                    if (seconds < 2) {
                        console.log(seconds === 1 && tweet === undefined, seconds, 'seconds');

                        if (seconds === 1 && tweet === undefined) {

                            clearInterval(getTweets);

                        }
                    }
                }
                //TODO: move down;
                //Callback data gets the data from the user stored in the database.
                function callbackData(userTimeline, usersFriends) {
                    console.log('callbackData');
                    var getTweets;

                    function myTimer() {
                        console.log('timer');

                        var randomUserFriends = randomFriends(usersFriends);
                        var randomPositionNumber = Math.floor(Math.random() * randomUserFriends.length);

                        if (userTimeline[number]) {
                            var index = randomUserFriends.indexOf(userTimeline[number].name);

                            randomUserFriends.splice(randomPositionNumber, 0, userTimeline[number].name);

                            if (number < userTimeline.length && userTimeline[number] !== undefined) {
                                // console.log('number');

                                number++;
                                socket.emit('start', { info: userTimeline[number], friends: randomUserFriends, username: req.user.twitter.username });

                                if (index > -1) {
                                    randomUserFriends.splice(index, 1);
                                }
                            }
                        } else {
                            // clearInterval(myTimer);
                            // console.log('stop', getTweets);

                            socket.emit('stop', { tweets: false, username: req.user.twitter.username });
                            clearInterval(getTweets);

                            // timer = setInterval(function() { getInfo(userTimeline[number]); }, 1000);
                            // setTimeout(function() { clearInterval(timer); }, 60000);
                        }
                    }

                    if (userTimeline.length >= 2) {

                        getTweets = setInterval(function() { myTimer(); }, 6000);

                    }

                    socket.on('end game', function(reset) {
                        // reser.data
                        number = 0;
                        console.log('END GAME');
                        clearInterval(getTweets);

                    });
                }
            }); 
        }); 


        io.sockets.on('connection', function(socket) {

            socket.on('reset', function(reset) {
                // reser.data
                number = 0;

            });
            socket.emit('get highscore', function(data) {



            });

            socket.on('disconnect', function(data) {
                delete users[socket.userId];
            });

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

function updateField(query, fieldName, data) {
    //Save comments to the database based on series name
    var set = {};
    set[fieldName] = data;
    User.findOneAndUpdate(query, {
        '$set': set
    }, { upsert: true }, function(err, document) {
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

        var promise = new Promise(function(resolve) {

            if (document.twitter.tweets) {
                resolve(document.twitter.tweets);
            }
        });

        promise.then(function(result) {
            console.log('promise result');

            callback(document.twitter.tweets, document.twitter.friends);

        }, function(err) {
            console.log(err); // Error: "It broke"
        });

    });

}

function randomFriends(data) {
    var usersFriends = [];
    var arr = [];

    // Get random friends from user account
    while (arr.length < 4) {
        if (data) {

            var randomnumber = Math.floor(Math.random() * data.length);

            if (arr.indexOf(randomnumber) > -1) {
                continue;
            }
            arr[arr.length] = randomnumber;
        }
    }

    for (var i = 0; i < arr.length; i++) {
        usersFriends.push(data[arr[i]].name);
    }

    return usersFriends;
}



function backupData(twitter, username, allTweets, params, callback) {
    var arr = [];
    twitter.get('statuses/home_timeline', params, function(error, tweets, response) {
        if (error) {
            return error;
        }

        if (!error) {
            console.log('FALLBACK DATA');
            console.log(tweets.length);
            // allTweets.push(tweets);

            tweets.forEach(function(object) {

                arr.push({ name: object.user.name, tweet: object.text, date: object.created_at });
            });

            saveData({ 'twitter.username': username }, 'twitter.tweets', arr);
            getUserData({ 'twitter.username': username }, callback);

        }
    });
}
