var express = require('express');
// Var OAuth2 = require('OAuth').OAuth2;
var https = require('https');
var session = require('express-session');
var sys = require('util');
var oauth = require('oauth');

var http = require('http');
var request = require('request');

var router = express.Router();
var env = require('dotenv').config();

var _twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
var _twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;
// Console.log("_twitterConsumerKey: %s and _twitterConsumerSecret %s", _twitterConsumerKey, _twitterConsumerSecret);

var consumer = new oauth.OAuth(
      'https://twitter.com/oauth/request_token',
      'https://twitter.com/oauth/access_token',
      _twitterConsumerKey, _twitterConsumerSecret,
      '1.0A',
      process.env.HOSTPATH + '/sessions/callback',
      'HMAC-SHA1'

    );

router.get('/connect', function (req, res) {
  consumer.getOAuthRequestToken(function (error, oauthToken, oauthTokenSecret, results) {
    if (error) {
      res.send('Error getting OAuth request token : ' + error, 500);
    } else {
      req.session.oauthRequestToken = oauthToken;
      req.session.oauthRequestTokenSecret = oauthTokenSecret;
      // Console.log("Double check on 2nd step");
      console.log('connect');
      console.log('<<' + req.session.oauthRequestToken);
      console.log('<<' + req.session.oauthRequestTokenSecret);
      res.redirect('https://twitter.com/oauth/authorize?oauth_token=' + req.session.oauthRequestToken);
    }
  });
});

router.get('/callback', function (req, res) {
  console.log('callback');
  console.log('>>' + req.session.oauthRequestToken);
  console.log('>>' + req.session.oauthRequestTokenSecret);
  console.log('>>' + req.query.oauth_verifier);
  consumer.getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function (error, oauthAccessToken, oauthAccessTokenSecret, results) {
    if (error) {
      console.log(res.statusCode);
    } else {
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;

      res.redirect('/sessions/home');
    }
  });
});
// https://userstream.twitter.com/1.1/user.json
// https://api.twitter.com/1.1/account/verify_credentials.json
// https://stream.twitter.com/1.1/statuses.json?track=twitter
router.get('/home', function (req, res) {
      // consumer.get("https://userstream.twitter.com/1.1/user.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
      //     console.log(data,['data']);

      // });

  consumer.get('https://api.twitter.com/1.1/account/verify_credentials.json?oauth_token=6KiYlQAAAAAA0QQBAAABW8rNtwg&oauth_verifier=E6MoGrYkCGFbV64bsVOPiseGXFoJHRY0', req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
    console.log(response, ['response'], data, ['data']);
    if (error) {
      console.log(error);
      res.redirect('/sessions/connect');
    } else {
      var parsedData = JSON.parse(data);
        // Res.send(parsedData);
      res.send('You are signed in: ' + parsedData.screen_name);
    }
  });
});

router.get('*', function (req, res) {
  res.redirect('/home');
});

// Var _googleAppID = config.GOOGLE_APP_ID;
// var _googleAppSecret = config.GOOGLE_CONSUMER_SECRET;
// console.log("_googleAppID: %s and _googleAppSecret %s", _googleAppID, _googleAppSecret);

// function consumer2() {
//   return new oauth.OAuth2(
//      _googleAppID,
//      _googleAppSecret,
//      'https://accounts.google.com/o',
//       '/oauth2/auth',
//       '/oauth2/token',
//       null
//    );
// }

// router.get('/sessions/connect2', function(req, res){
//   res.redirect( consumer2().getAuthorizeUrl({
//        'scope': 'https://www.googleapis.com/auth/calendar.readonly',
//        'response_type': 'code',
//        'redirect_uri': config.HOSTPATH+'/sessions/oauth2'
//   }));
// });

// router.get('/sessions/oauth2', function(req, res){
//   req.session.oauth2AuthorizationCode = req.query['code'];
//   consumer2().getOAuthAccessToken( req.session.oauth2AuthorizationCode,
//          {'grant_type': 'authorization_code',
//           'redirect_uri': config.HOSTPATH+'/sessions/oauth2'},
//     function(error, access_token, refresh_token, results){ //callback when access_token is ready
//       if (error) {
//         res.send("Error getting OAuth access token : " + sys.inspect(error), 500);
//       } else {
//         req.session.oauth2AccessToken = access_token;
//         req.session.oauth2RefreshToken = refresh_token;
//         consumer2().get( //use the access token to request the data
//           'https://www.googleapis.com/calendar/v3/users/me/calendarList',
//           req.session.oauth2AccessToken,
//           function(error,data) { //callback when data is returned
//             if (error) {
//               res.send("Error getting data : " + sys.inspect(error), 500);
//             } else {
//               data = JSON.parse(data);
//               console.log('we have data ' + sys.inspect(data) );
//               res.send("Google says "+ sys.inspect(data));
//             };
//           }
//         );
//       };
//     }
//   );
// });

module.exports = router;
