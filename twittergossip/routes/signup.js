var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
    // Render the page and pass in any flash data if it exists
    res.render('signup', { title: 'signup' });
});
module.exports = router;
