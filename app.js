var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var mongoose = require('mongoose');
var validator = require('express-validator');

// Config mongodb
require('./config/mongodb')(mongoose);

// Setup redis
var redis = require('./config/redis');


var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//console.log(process.env.NODE_ENV);

if (app.get('env') !== 'test') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(validator({
  customValidators: {
    isObjectId: function(val) {
      return mongoose.Types.ObjectId.isValid(val);
    }
  }
}));
app.use(cookieParser());
app.use(session({
  secret: 'l0lkat',
  store: new redisStore({host: 'localhost', port: 6379, client: redis()}),
  saveUninitialized: false,
  resave: false
}));

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

/*
app.use(function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  next();
});
*/
// Attach middlewares
app.use(require('./middlewares/flash'));
app.use(require('./middlewares/login'));
app.use(require('./config/app')());

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    //res.json({error: err.message, stack: err.stack});
    res.render('error', {
      message: err.message,
      error: err,
      stack: err.stack
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
