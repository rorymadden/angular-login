'use strict';

var uuid = require('uuid-v4');

// models
var User = require('../models/user');

//utils
var cryptographicService = require('./cryptographicService');
// load messages for ease of maintenance
var errorMessages = require('../../config/errors');


/**
 * Authenticate user on login
 * Validate if they are locked (too many bad attempts)
 * Validate if they are active (not yet activated) or deactivated
 * Validate that the passwords match
 * @param  {String}   email    Email of user being authenticated.
 * @param  {String}   password Password for user - plain text.
 * @param  {Function} callback Error or user.
 * @return {Function} callback Callback.
 */
exports.authenticate = function(email, password, callback) {
  User.findByEmail(email, function(err, user) {
    if (err) {
      return callback(null, null, err);
    }
    //check if user is locked
    else if (user.isLocked) {
      user.incLoginAttempts(function(err) {
        if (err) { return callback(null, null, err); }
        return callback(null, null, errorMessages.userLocked);
      });
    }
    //if the user is not active check if de-activated
    else if (!user.active) {
      if (user.auth.accountDeactivated) {
        return callback(null, null, errorMessages.userDeactivated);
      }
      else {
        return callback(null, null, errorMessages.userRegisteredNotActive);
      }
    }
    else {
      cryptographicService.comparePassword(password, user.password,
        function(err, isPasswordMatch) {
        if (!isPasswordMatch) {
          // password is incorrect, increment login attempts before responding
          user.incLoginAttempts(function(err) {
            if (err) { return callback(null, null, err); }
            return callback(null, null, errorMessages.incorrectPassword);
          });
        }
        // if there's no lock or failed attempts, just return the user
        else if (!user.auth.loginAttempts && !user.auth.lockUntil) {
          return callback(null, user, null);
        }
        // if there were previous attempts, reset attempts and lock info
        else {
          var updates = {
            $set: { 'auth.loginAttempts': 0 },
            $unset: { 'auth.lockUntil': 1 }
          };
          user.update(updates, function(err) {
            if (err) {
              return callback(null, null, err);
            }
            return callback(null, user, null);
          });
        }
      });
    }
  });
};

/**
 * Called from Social Media logins (Facebook, Google, etc)
 * Logs user in if Oauth2 profile already linked to a user
 * Logs user in and associates Oauth2 provider if email already linked to a user
 * Creates new account if above conditions are not found
 * @param  {String}   provider Name of Oauth2 provider - facebook, google.
 * @param  {Object}   profile  Profile returned from Oauth2 supplier.
 * @param  {Function} done     Error or user.
 */
exports.loginOrCreate = function(provider, profile, done) {
  var providerId = {};
  providerId[provider + '.id'] = profile.id;

  //find by oauth2 provider
  User.findOne(providerId, function(err, user) {
    if (err) { return done(err); }
    if (!user || !user.active) {
      // validate if email already exists
      User.findByEmail(profile.emails[0].value, function(err, user) {
        //create new user if email does not exist
        if (err || !user) {
          //create a new user
          user = new User({
              first: profile.name.givenName || profile.given_name
            , last: profile.name.familyName || profile.family_name
            , email: profile.emails[0].value
            , gender: profile.gender || profile._json.gender
            , password: uuid()
            , active: profile.verified_email || true
          });
        }
        //update existing user if they exist
        user[provider] = profile._json;
        if (!user.dob || user.dob.slice(0,4) === '0000') {
          var newDateFormat = profile._json.birthday;
          //convert facebook date
          var dateElements = profile._json.birthday.split('/');
          if(dateElements[1]) {
            newDateFormat = dateElements[2] + "-" + dateElements[0] + "-" +
              dateElements[1];
          }
          user.dob = newDateFormat;
        }
        if (!user.active) { user.active = profile.verified_email || true; }
        user.auth.accountDeactivated = false;
        //save new user or updated user
        user.save(function(err) {
          // if (!user.active) {
          //   exports.resendActivationLink(user.email, function(err, token) {
          //     req.session.success = sessionMessages.ACTIVATION_LINK_GENERATED;
          //   });
          // }
          return done(err, user);
        });
      });
    }
    else {
      return done(null, user);
    }
  });
};