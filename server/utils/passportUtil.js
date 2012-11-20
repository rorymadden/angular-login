'use strict';

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// models
var User = require('../models/user');

var accountUtil = require('../utils/accountUtil');

// load configuration
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];

/**
 * Boot the passport settings into the server
 * @param  {object} passport Passport object.
 * @param  {object} config   Config object.
 */
exports.boot = function (passport, config){
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user){
      done(err, user);
    });
  });

  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      accountUtil.authenticate(email, password, function(err, user, msg) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: msg });
        }
        else {
          return done(null, user);
        }
      });
    }
  ));

  // use facebook strategy
  passport.use(new FacebookStrategy({
        clientID: config.facebook.appId
      , clientSecret: config.facebook.appSecret
      , callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      accountUtil.loginOrCreate('facebook', profile, done);
    }
  ));

  // use google strategy
  passport.use(new GoogleStrategy({
        clientID: config.google.clientID
      , clientSecret: config.google.clientSecret
      , callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      accountUtil.loginOrCreate('google', profile, done);
    }
  ));
};
