var express = require('express');
var router = express.Router();
var https = require('https');
var env = require('dotenv').config();
var bodyParser = require('body-parser');



/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', {title: 'Chat'});
// getData(receiveData);

});






// router.get("/", function(req, resp){
//     getData(receiveData);

//     function receiveData(data){

//      // resp.render('index',{data:data});
//      resp.render('index');
//     }
// });


// function getData(recieve){
//     https.get(`https://newsapi.org/v1/articles?source=techcrunch&apiKey=${process.env.NEWSAPI_KEY}`, function (res) {
//     res.pipe(concat(callback));

//        function callback(argument) {

//         var data = JSON.parse(argument);
//         recieve(data);
//        }
//   });
// }

module.exports = router;
