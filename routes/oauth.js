var express = require('express');

var http = require('http');
var request = require('request');
var router = express.Router();

var env = require('dotenv').config();

var twit = require('node-twitter-api');

var twitter = new twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

router.get('/signin', function (req, res) {
  res.send('lsl');
// GetData(receiveData);
});

module.exports = router;
