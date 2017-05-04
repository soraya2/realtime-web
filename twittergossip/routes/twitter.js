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

router.get('/', function (req, res) {
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

  socketIo: function (io) {
    var count = 0;
    twitter.stream('user', function (stream) {
// Twitter.stream('statuses/filter', {track: 'news'}, function (stream) {
// user api is very very very slow
      stream.on('data', function (data) {
    // Console.log(data);

        io.emit('time', {info: data});
      });

      stream.destroy();
    });
  },
  router: router

};
