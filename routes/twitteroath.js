var express = require('express');

var router = express.Router();

module.exports = function(passport, io) {
    router.get('/', passport.authenticate('twitter'));

    // Handle the callback after twitter has authenticated the user
    router.get('/callback', passport.authenticate('twitter', { successRedirect: '/profile', failureRedirect: '/', failureFlash: true }));
    return router;

};
