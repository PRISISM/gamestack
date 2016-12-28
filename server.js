// Packages
var express = require('express');
var app = express();
var bodyParser = require('body-parser'); 
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
// var config = require('./config');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var logger = require('morgan');
var mongoose = require('mongoose');

var passportRoutes = require('./app/routes/passport.routes');
var routes = require('./app/routes/routes')(app,passport);
var gamesRoutes = require('./app/routes/games');

// Parser & Morgan
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger('dev'));
app.use(flash()); // use connect-flash for flash messages stored in session

// express-session
// alternatively: 
	//app.use(express.session({secret: 'sheik'})); 

app.use(require('express-session')({
    secret: 'sheik',
    resave: false,
    saveUninitialized: false
}));

// View Engine and related locals
app.set('views', path.join(__dirname,  'public/app/views/pages'));
app.set('view engine', 'pug');
app.locals.moment = require('moment');
app.set('view options', { pretty: true });

// Connect MongoDB
mongoose.connect(ENV[database], function(err,db){
    if (!err){
        console.log('Connected to db!');
    } else{
        console.dir(err); //failed to connect
    }
});

// Set static files location
// used for requests that our frontend will make
app.use('/public', express.static(path.join(__dirname, 'public')));

// Setup Passport
var User = require('./app/models/Users');
app.use(passport.initialize());
app.use(passport.session());

// Routes
// REST/Express Routes: Frontend Client can interact with -- think REST actions
// Angular for switching views  

// eg: /users/:1 -- respond partial

app.use('/users', routes);
app.use('/games', gamesRoutes);
app.use( passportRoutes);

// Passport Config

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
            var origRender = res.render;
            res.render = function (view, locals, callback) {
                if ('function' == typeof locals) {
                    callback = locals;
                    locals = undefined;
                }
                if (!locals) {
                    locals = {};
                }
                locals.req = req;
                origRender.call(res, view, locals, callback);
            };
            next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ 'local.username': username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (user.password != password) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));
// Start Server
app.listen(ENV[port]);
console.log('Server started on port', ENV[port]);