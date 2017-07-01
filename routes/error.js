var express = require('express');
var router = express.Router();


router.get('/', function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = router;
