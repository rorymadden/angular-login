'use strict';
/**
 * Module dependencies.
 */

var express = require('express');
var mongoose = require('mongoose');
var RedisStore = require('connect-redis')(express);
var expressValidator = require('express-validator');

// load app utilities
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

var mongodbURI = 'mongodb://' + config.mongodb.user + ':' +
  config.mongodb.password + '@' + config.mongodb.host + ':' +
  config.mongodb.port + '/' + config.mongodb.database;
mongoose.connect(mongodbURI);

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
      // //for auto-populating forms on failure
      // , formData: formData
      // //for changing templates depending on whether the user is logged in
      // , get user() {
      //   return req.user;
      // }
      // , isAuthenticated: req.isAuthenticated
      // , publicDir: __dirname
    });
    next();
  });
  //session messages
  // app.use(function(req, res, next) {

  //   var err = req.session.error,
  //       msg = req.session.success,
  //       info = req.session.info,
  //       syntax = function(type){
  //         return '<div class="alert alert-' + type +
  //           '"><a class="close" data-dismiss="alert">×</a>';
  //       };

  //   delete req.session.error;
  //   delete req.session.success;
  //   delete req.session.info;

  //   res.locals.message = '';

  //   if (err) {res.locals.message = syntax('error') + err + '</div>';}
  //   else if (msg) {res.locals.message = syntax('success') + msg + '</div>';}
  //   else if (info) {res.locals.message = syntax('info') + info + '</div>';}
  //   next();
  // });

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

app.get('/', routes.index);
app.get('/account/:name', routes.account);
app.post('/account/register', accountService.register);
// app.get('/login', routes.login);
// app.get('/register', routes.register);
// app.get('/forgotPassword', routes.forgotPassword);
// app.get('/resendActivationLink', routes.resendActivation);
// app.get('/partials/:name', routes.partials);
app.get('/modals/:name', routes.modals);


// JSON API

app.get('/api/name', api.name);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Start server

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
