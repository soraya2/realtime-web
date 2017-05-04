var path = require('path');
var http = require('http');

var express = require('express');
var hbs = require('express-handlebars');
var less = require('less-middleware');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessions = require('express-session');
var mongoose = require('mongoose');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server); // Use socket io in seperate files
require('./config/passport')(passport);
mongoose.Promise = global.Promise;
// Var twitter = require('./routes/twitter');
// var oauth = require('./routes/oauth');

app.use(morgan('dev')); // Log every request to the console
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(sessions({
  secret: 'kjdjdj',
    // Name: cookie_name,
  proxy: true,
  resave: true,
  saveUninitialized: true,
  cookie: {secure: true}
}));

app.use(passport.initialize());
app.use(passport.session()); // Persistent login sessions
app.use(flash()); // Use connect-flash for flash messages stored in session

mongoose.connect(process.env.USERDB);
require('./routes/routes.js')(app, passport, io);

// Console.log(mongoose.connection.readyState); //test database connection
// twitter.socketIo(io);
var users = [];
var connections = [];
var userId = [];

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'main', layoutDir: path.join(__dirname, 'views', 'layout')}));
app.set('view engine', 'hbs');

app.use(less(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
// app.use('/login', twitter.router);
// app.use('/oauth', oauth);

// store pouchdb with express session??
    // store: new (require('express-sessions'))({
    //     storage: 'mongodb',
    //     instance: mongoose, // optional
    //     host: 'localhost', // optional
    //     port: 27017, // optional
    //     db: 'test', // optional
    //     collection: 'sessions', // optional
    //     expire: 86400 // optional
    // })

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
  socket.join('timer');
  userId.push(socket.id);
  var ustest = socket.id;
  io.sockets.emit('user connectionId', {connectionId: ustest});

  console.log('connected %s sockets', connections.length);

  socket.on('disconnect', function () {
    userId.splice(userId.indexOf(socket), 1);

    connections.splice(connections.indexOf(socket), 1);

    console.log(' amount of sockets connected %s ', connections.length);
  });

 // Send message
  socket.on('send message', function (data) {
    var currentUser = socket.id;

    io.sockets.emit('new message', {msg: data, user: socket.userName, id: currentUser, idList: userId});
  });
});

server.listen(app.get('port'), function () {
  console.log('app started on localhost:3000');
});

