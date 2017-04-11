var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var path = require('path');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// var favicon = require('serve-favicon');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');
var hbs = require('express-handlebars');

var index = require('./routes/index');
// var users = require('./routes/users');


var users = [];
var connections = [];




app.engine('hbs', hbs({extname:'hbs', defaultLayout: 'main', layoutDir: __dirname + 'views/layout'}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/', index);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.set('port', process.env.PORT || 3000);

io.sockets.on('connection', function (socket){
 connections.push(socket);
 console.log('connected %s sockets', connections.length);

 socket.on('disconnect', function (data){
  // if(!socket.userName){
  //  return;
  // }else{
  //  users.splice(users.indexOf(socket.userName), 1);
  //    updateUserNames();

  // }

    users.splice(users.indexOf(socket.userName), 1);
     updateUserNames();
  connections.splice(connections.indexOf(socket), 1);
   console.log(' amount of sockets connected %s ', connections.length);

 });

 //send message
 socket.on('send message', function(data){
  // console.log(data);
  io.sockets.emit('new message', {msg: data, user: socket.userName});
 });
// new user
 socket.on('new user', function(data, callback){

  //if statement op true zetten
  callback(true);
  socket.userName = data;
  users.push(socket.userName);
  console.log(socket.userName);
  updateUserNames();
 });

function updateUserNames() {

  io.sockets.emit('get users', users);

}

});


server.listen(app.get('port'), function(){
    console.log('app started on localhost:3000');
});

module.exports = app;
