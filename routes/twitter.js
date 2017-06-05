var express = require('express');
var OAuth2 = require('OAuth').OAuth2;
var https = require('https');

var http = require('http');
var request = require('request');
var router = express.Router();
var env = require('dotenv').config();

var twit = require('twitter');

var twitter = new twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});
// Function log(log) {
//   console.log(log);
// }
var _requestSecret;
// Router.get('/', function (req, res) {
//   res.render('index', {title: 'Chat'});
// // getData(receiveData);

// });

router.get('/', function(req, res) {
    res.render('index');

    // Twitter.stream('user',function (stream) {

    // stream.on('data', function (data) {
    //     console.log(data);
    //       io.emit('time', { info: 'data' });

    //   // stream.destroy();
    //  });
    // });
});

var tweets = [];

module.exports = {

    socketIo: function(io) {
        var count = 0;
        twitter.stream('user', function(stream) {
            // Twitter.stream('statuses/filter', {track: 'news'}, function (stream) {
            // user api is very very very slow
            stream.on('data', function(data) {
                // Console.log(data);

                io.emit('time', { info: data });
            });

            stream.destroy();
        });
    },
    router: router

};






io.emit('time', { Friends: 'usersFriends' });
User.findById(req.user.id, function(err, doc) {
            var tweets = [];
            var usersFriends = [];
            // doc is a Document
            // console.log(doc.twitter.secret);
            // console.log(doc.twitter.token);
            var twitter = new twit({
                consumer_key: process.env.TWITTER_CONSUMER_KEY,
                consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                access_token_key: doc.twitter.token,
                access_token_secret: doc.twitter.secret
            });

            var params = { screen_name: 'susu_2' };
            twitter.get('friends/list', params, function(error, tweets, response) {
                if (error) {
                    throw error

                }
                if (!error) {


                    // get random friends from user account
                    var arr = [];
                    while (arr.length < 3) {
                        var randomnumber = Math.floor(Math.random() * tweets.users.length);
                        if (arr.indexOf(randomnumber) > -1) continue;
                        arr[arr.length] = randomnumber;
                    }
                    // console.log(arr);

                    for (var i = 0; i < arr.length; i++) {
                        // Things[i]
                        var rand = tweets.users[arr[i]];
                    }
                    usersFriends.push(rand);
                    console.log(usersFriends);



                }



            });

            twitter.stream('user', function(stream) {
                //   console.log(stream);

                // twitter.stream('statuses/filter', {track: 'news'}, function (stream) {
                // user api is very very very slow
                stream.on('data', function(data) {
                    // console.log(data);
                    tweets.push(data);
                    console.log(data);

                });

                // stream.destroy();
            });








            User.findById(req.user.id, function(err, doc) {
                var tweets = [];
                var usersFriends = [];
                // doc is a Document
                // console.log(doc.twitter.secret);
                // console.log(doc.twitter.token);
                var twitter = new twit({
                    consumer_key: process.env.TWITTER_CONSUMER_KEY,
                    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                    access_token_key: doc.twitter.token,
                    access_token_secret: doc.twitter.secret
                });

                var params = { screen_name: 'susu_2' };
                twitter.get('friends/list', params, function(error, tweets, response) {
                    if (!error) {


                        // get random friends from user account
                        var arr = [];
                        while (arr.length < 3) {
                            var randomnumber = Math.floor(Math.random() * tweets.users.length);
                            if (arr.indexOf(randomnumber) > -1) continue;
                            arr[arr.length] = randomnumber;
                        }
                        // console.log(arr);

                        for (var i = 0; i < arr.length; i++) {
                            // Things[i]
                            var rand = tweets.users[arr[i]];
                        }
                        console.log(rand);
                        usersFriends.push(rand);


                    }



                });

                twitter.stream('user', function(stream) {
                    //   console.log(stream);

                    // twitter.stream('statuses/filter', {track: 'news'}, function (stream) {
                    // user api is very very very slow
                    stream.on('data', function(data) {
                        // console.log(data);
                        tweets.push(data);

                    });

                    // stream.destroy();
                });


                io.emit('time', { tweets: tweets, usersFriends });


            });

            var express = require('express');
            var OAuth2 = require('OAuth').OAuth2;
            var https = require('https');

            var http = require('http');
            var request = require('request');
            var router = express.Router();
            var env = require('dotenv').config();

            var twit = require('twitter');

            var twitter = new twit({
                consumer_key: process.env.CONSUMER_KEY,
                consumer_secret: process.env.CONSUMER_SECRET,
                access_token_key: process.env.ACCESS_TOKEN_KEY,
                access_token_secret: process.env.ACCESS_TOKEN_SECRET,
            });
            // function log(log) {
            //   console.log(log);
            // }
            var _requestSecret;
            // router.get('/', function (req, res) {
            //   res.render('index', {title: 'Chat'});
            // // getData(receiveData);

            // });
            router.get("/", function(req, res) {

                res.send();

                // twitter.getRequestToken(function(err, requestToken, requestSecret) {
                //     if (err)
                //         res.status(500).send(err);
                //     else {
                //         _requestSecret = requestSecret;
                //         res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
                //     }
                // });
            });

            var tweets = [];


            module.exports = {
                socketIo: function(io) {
                    var count = 0;
                    twitter.stream('user', function(stream) {
                        // twitter.stream('statuses/filter', {track: 'news'}, function (stream) {
                        // user api is very very very slow
                        stream.on('data', function(data) {

                            // io.emit('time', { info: data });

                            // stream.destroy();
                        });
                    });
                },

                router: router

            };



            var oauth2 = new OAuth2(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET, 'https://api.twitter.com/', null, 'oauth2/token', null);
            oauth2.getOAuthAccessToken('', {
                'grant_type': 'client_credentials'
            }, function(e, access_token) {
                console.log(access_token); //string that we can use to authenticate request

                var options = {
                    hostname: 'api.twitter.com',
                    path: '/1.1/statuses/user_timeline.json?screen_name=sosy_2',
                    headers: {
                        Authorization: 'Bearer ' + access_token
                    }
                };


                https.get(options, function(result) {
                    var buffer = '';
                    result.setEncoding('utf8');
                    result.on('data', function(data) {
                        buffer += data;
                        console.log(tweets, 'tweets'); // the tweets!
                    });
                    result.on('end', function() {
                        var tweets = JSON.parse(buffer);
                    });
                });
            });


            var tweets = [];
            module.exports = function(io) {

                var count = 0;

                twitter.stream('user', function(stream) {
                    // twitter.stream('statuses/filter', {track: 'news'}, function (stream) {
                    // user api is very very very slow
                    stream.on('data', function(data) {

                        io.emit('time', { info: data });

                        // stream.destroy();
                    });
                });

            };
