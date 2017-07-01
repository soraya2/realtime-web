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



// Routes
app.use(morgan('dev')); // Log every request to the console
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessions({
    secret: 'kjdjdj',
    // Name: cookie_name,
    proxy: true,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session()); // Persistent login sessions
app.use(flash()); // Use connect-flash for flash messages stored in session

mongoose.connect(process.env.USERDB);
//
var index = require('./routes/index.js');
var login = require('./routes/login.js');
var logout = require('./routes/logout.js');
var signup = require('./routes/signup.js');
var error = require('./routes/error.js');
var profile = require('./routes/profile.js')(passport, io);
var oauth = require('./routes/twitteroath.js')(passport);

// console.log(mongoose.connection.readyState); //test database connection

var users = [];
var connections = [];
var userId = [];

app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'main', layoutDir: path.join(__dirname, 'views', 'layout') }));
app.set('view engine', 'hbs');

app.use(less(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', index);
app.use('/login', login);
app.use('/logout', logout);
app.use('/profile', profile);
app.use('/signup', signup);
app.use('/auth/twitter', oauth);
// app.use('/*', notfound);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    // var err = new Error('Not Found');
    // err.status = 404;
    res.render('404', { title: '404' });
});

// Error handler
app.use(function(err, req, res) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});

// Socket io connection
app.set('port', process.env.PORT || 3000);

server.listen(app.get('port'), function() {
    console.log('app started on localhost:3000');
});
