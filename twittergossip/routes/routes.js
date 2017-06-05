// App/routes.js
var https = require('https');
var concat = require('concat-stream');
var User = require('../models/user');
var twit = require('twitter');


module.exports = function(app, passport, io) {
    var usersFriends = [];
    var allTweets = [];
    var users = [];
    var connections = [];
    var usersId = [];

    app.get('/', function(req, res) {
        res.render('index', { title: 'Home' });
    });

    app.get('/login', function(req, res) {
        // Render the page and pass in any flash data if it exists
        res.render('login', { title: 'Login' });
    });

    app.get('/signup', function(req, res) {
        // Render the page and pass in any flash data if it exists
        res.render('signup', { title: 'signup' });
    });

    app.get('/oauth/twitter', passport.authenticate('twitter'));

    // Handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/profile', failureRedirect: '/', failureFlash: true }));

    app.get('/profile', isLoggedIn, function(req, res) {

        var userId = req.user.id;
        // find user in database
        User.findById(userId, function(err, doc) {
            io.sockets.on('connection', function(socket) {
                console.log(io.sockets.connected[socket.id]);

                function myfunction() {

                    setInterval(function() {
                        io.sockets.connected[socket.id].emit('time', { info: doc.twitter.tweets });


                    }, 3000);

                }
                myfunction();

                var twitter = new twit({
                    consumer_key: process.env.TWITTER_CONSUMER_KEY,
                    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                    access_token_key: doc.twitter.token,
                    access_token_secret: doc.twitter.secret
                });
                var params = { screen_name: doc.twitter.username };
                twitter.get('friends/list', params, function(error, tweets, response) {
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

                        for (var i = 0; i < arr.length; i++) {

                            usersFriends.push(tweets.users[arr[i]]);
                        }


                        twitter.stream('user', function(stream) {
                            stream.on('data', function(data) {

                                var ObjectId = require('mongoose').Types.ObjectId;
                                var query = { _id: ObjectId(userId) };

                                req.user.twitter.tweets = ['req.user.username'];

                                var newTweet = { name: data.user.name, tweet: data.text };
                                allTweets.push(newTweet);

                                User.findById(userId, function(err, docs) {
                                    // Make sure the database only stores unique values
                                    function databaseCheck() {

                                        if (docs.twitter.tweets.length > 0) {

                                            function isBigEnough(value) {
                                                console.log(value.tweet.substr(0, 20));
                                                var testTweet = docs.twitter.tweets.map(function(e) {
                                                    return e.tweet;
                                                }).indexOf(value.tweet.substr(0, 20));


                                                if (testTweet === -1) {

                                                    return true;
                                                }
                                                return false;
                                            }

                                            var filtered = allTweets.filter(isBigEnough);

                                            return filtered;
                                        } else if (docs.twitter.tweets.length === 0) {
                                            console.log('no tweets', allTweets[0]);

                                            return [allTweets[0]];
                                        }

                                    }


                                    User.findOneAndUpdate(query, {
                                        "$addToSet": {
                                            "twitter.tweets": { $each: databaseCheck() }
                                        }
                                    }, { upsert: true }, function(err, document) {
                                        if (err) return console.log(err);
                                        // console.log(req.user.id);



                                    });



                                    io.sockets.emit('friend', { names: usersFriends });
                                });

                            });

                        });
                    }
                });
            });
        });
        // io.sockets.on('connection', function(socket) {
        // connections.push(socket);

        // console.log(req.sessionID);

        // socket.join('timer');
        // usersId.push(socket.id);
        // var ustest = socket.id;
        // io.sockets.emit('user connectionId', { connectionId: ustest });


        // console.log('connected %s sockets', connections.length);

        // socket.on('disconnect', function() {
        //     userId.splice(userId.indexOf(socket), 1);

        //     connections.splice(connections.indexOf(socket), 1);

        //     console.log(' amount of sockets connected %s ', connections.length);
        // });

        // // Send message
        // socket.on('send message', function(data) {
        //     var currentUser = socket.id;

        //     io.sockets.emit('new message', { msg: data, user: socket.userName, id: currentUser, idList: userId });
        // });
        // });



        res.render('profile', { title: 'profile', username: req.user.twitter.username, displayname: req.user.twitter.displayName });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    app.get('/*', function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
};
// Check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}
