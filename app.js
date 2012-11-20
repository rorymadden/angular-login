'use strict';
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var RedisStore = require('connect-redis')(express);
var expressValidator = require('express-validator');
var passport = require('passport');

// load app utilities
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

var mongodbURI = 'mongodb://' + config.mongodb.user + ':' +
  config.mongodb.password + '@' + config.mongodb.host + ':' +
  config.mongodb.port + '/' + config.mongodb.database;
mongoose.connect(mongodbURI);

// bootstrap passport config
require('./server/utils/passportUtil').boot(passport, config);

var app = module.exports = express();

// Configuration

app.configure(function(){
  app.set('port', config.node.port);
  app.set('views', __dirname + '/server/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(expressValidator);
  app.use(express.cookieParser(config.cookie.secret));

  // Configure session to use Redis as store
  app.use(express.session({
      key: 'express.sid'
    , secret: config.sess.secret
    , store: new RedisStore({
        host: config.redis.host,
        port: config.redis.port,
        db: config.redis.db,
        pass: config.redis.pass,
        ttl: config.redis.ttl
      })
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // csrf
  if (env !== 'test') {
    app.use(express.csrf());
  }

  //dynamic helpers
  app.use(function(req, res, next) {
    // var formData = req.session.formData || {}
    // delete req.session.formData;

    res.locals({
      //for use in templates
        appName: config.appName
      // needed for csrf support
      , token: req.session._csrf
      // //for changing templates depending on whether the user is logged in
      , get user() {
        return req.user;
      }
      , isAuthenticated: req.isAuthenticated
      // , publicDir: __dirname
    });
    next();
  });

  app.use(express.compress());
  // staticCache has been deprecated.
  // TODO: investigate varnish / nginx for caching
  // app.use(express.staticCache());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  var cp = require('child_process');
  var grunt = cp.spawn('grunt', ['--force', 'default', 'watch']);

  grunt.stdout.on('data', function(data) {
      // relay output to console
      console.log("%s", data);
  });
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

var routes = require('./routes');
var api = require('./routes/api');
var accountService = require('./server/apis/accountService');
var accountUtil = require('./server/utils/accountUtil');
var authorizationUtil = require('./server/utils/authorizationUtil');

app.get('/', routes.index);
// app.get('/error', routes.error);
app.get('/account/:name', authorizationUtil.isAnonymous, routes.account);
app.post('/account/register', accountService.register);
app.post('/account/resendActivation', accountService.resendActivationLink);
app.get('/activate/:activationKey', accountService.activate, routes.index);
app.get('/auth/facebook', passport.authenticate('facebook'
  , { scope: 'email, user_birthday' }));
app.get('/auth/facebook/callback', passport.authenticate('facebook'
  , { failureRedirect: '/login', successRedirect: '/' }));
app.get('/auth/google', passport.authenticate('google'
  , { scope: ['https://www.googleapis.com/auth/userinfo.profile'
    , 'https://www.googleapis.com/auth/userinfo.email'] }));
app.get('/auth/google/callback', passport.authenticate('google'
  , { failureRedirect: '/login', successRedirect: '/' }));
app.post('/account/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error) {
      if (typeof(error.message) !== 'undefined') {
        var text = error.message;
        error = text;
      }
      // req.session.error = error;
      // return res.redirect('/login');
      return res.json(406, { error: error });
    }
    req.newUser = user;
    next();
  })(req, res, next);
}, accountService.loginUser);
// app.get('/logout', accountUtil.logout);

// TODO: get modals working
app.get('/modals/:name', routes.modals);

// // JSON API
// app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
