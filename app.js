var path = require('path');
var http = require('http');

var express = require('express');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');
var hbs = require('express-handlebars');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var index = require('./routes/index');
// Var users = require('./routes/users');

var users = [];
var connections = [];
var userId = [];

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'main', layoutDir: path.join(__dirname, 'views', 'layout')}));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// App.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function (err, req, res) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Socket io connection
app.set('port', process.env.PORT || 3000);

io.sockets.on('connection', function (socket) {
  connections.push(socket);

  userId.push(socket.id);
  var ustest = socket.id;

  io.sockets.emit('user connectionId', {connectionId: ustest});

  console.log('connected %s sockets', connections.length);

  socket.on('disconnect', function () {
    users.splice(users.indexOf(socket.userName), 1);
    updateUserNames();

    userId.splice(userId.indexOf(socket), 1);

    connections.splice(connections.indexOf(socket), 1);

    console.log(' amount of sockets connected %s ', connections.length);
  });

 // Send message
  socket.on('send message', function (data) {
    var currentUser = socket.id;

    io.sockets.emit('new message', {msg: data, user: socket.userName, id: currentUser, idList: userId});
  });

// New user
  socket.on('new user', function (data, callback) {
  // If statement op true zetten
    callback(true);
    socket.userName = data;
    users.push(socket.userName);
    updateUserNames();
  });

  function updateUserNames() {
    io.sockets.emit('get users', {user: users, idList: userId});
  }
});

server.listen(app.get('port'), function () {
  console.log('app started on localhost:3000');
});

module.exports = app;
