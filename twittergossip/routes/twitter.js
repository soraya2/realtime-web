var express = require('express');

var http = require('http');
var request = require('request');
var router = express.Router();
var env = require( 'dotenv' ).config();

var twit = require('twitter');

var twitter = new twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});
// function log(log) {
//   console.log(log);
// }

var tweets = [];
module.exports = function(io)
{

var count = 0;

twitter.stream('user',function (stream) {
// twitter.stream('statuses/filter', {track: 'news'}, function (stream) {
// user api is very very very slow
  stream.on('data', function (data) {

        io.emit('time', { info: data });

    // stream.destroy();
  });
});

};


