'use strict';

var uuid = require('uuid-v4');
var useragent = require('express-useragent');

// models
var User = require('../models/user');
var LoginToken = require('../models/loginToken');

// utils
var mailerService = require('../utils/mailerUtil');


// load configuration information
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
var errorMessages = require('../../config/errors');
var urls = {
  home: '/',
  login: '/login',
  resendActivation: '/resendActivation',
  error: 'error'
};

/*
 * Serve JSON to our AngularJS client
 */

exports.register = function (req, res) {
  // validate that terms and conditions have been met
  req.assert('password', errorMessages.invalidPassword).len(6, 20);
  req.assert('tandc', errorMessages.invalidTerms).equals('agreed');
  var errors = req.validationErrors();
  if(errors){
    return res.json(406, { error: errors });
  }
  else {
    User.findByEmail(req.body.email.trim().toLowerCase(), function(err, user){
      if(user && user.active){
        return res.json(406, { error: errorMessages.userRegisteredAndActive });
      }
      if(user && !user.active){
        return res.json(406, { error: errorMessages.userRegisteredNotActive });
      }
      else {
        var newUser = new User({
          first: req.body.first,
          last: req.body.last,
          email: req.body.email,
          gender: req.body.gender,
          password: req.body.password,
          birthday: req.body.birthday,
          "auth.activationKey": uuid()
        });
        newUser.save(function(err){
          if(err) {
            return res.json(406, { error: err });
          }
          else {
            // email user
            var options = {
              template: 'invite',
              from: config.appName + ' <' + config.email.registration + '>',
              subject: 'Thank you for registering for ' + config.appName
            };

            var data = {
              email: newUser.email,
              name: newUser.first,
              appName: config.appName,
              activationLink: config.domain + '/activate/' +
                newUser.auth.activationKey
            };

            mailerService.sendMail(options, data, function(err, response) {
              // TODO: what should happen if this email fails???
              // should already be logged by mailerService
            });
            // do not wait for mail callback to proceed. Can take a few seconds
            return res.json(200);
          }
        });
      }
    });
  }
};

/**
 * Resend an activation link if requested by a user
 * Validate if user is already active
 * Validate if user is de-activated - generate a new activation token
 * @param  {String}   email    The email of the user.
 * @param  {Function} callback Error or token (for testing).
 */
exports.resendActivationLink = function(req, res) {
  User.findByEmail(req.body.email, function(err, user) {
    if (user.active) {
      return res.json(406, { error: errorMessages.userRegisteredAndActive });
    }
    else {
      // if the user has been de-activated but wants to re-activate
      // a new token needs to be generated
      if (user.auth.accountDeactivated) {
        user.auth.activationKeyUsed = false;
        user.auth.activationKey = uuid();
        user.save();
      }
      //send email to the user
      var options = {
        template: 'invite',
        from: config.appName + ' <' + config.email.registration + '>',
        subject: 'Activation Key for ' + config.appName
      };

      var data = {
        email: user.email,
        name: user.first,
        appName: config.appName,
        activationLink: config.domain + '/activate/' +
          user.auth.activationKey
      };

      mailerService.sendMail(options, data, function(err, response) {
        //TODO: what should happen if this email fails???
      });
      return res.json(200);
    }
  });
};

/**
 * Middleware to activate a user using the emailed activation key
 * Validates the format of the key to prevent xss
 * Keys are one use only
 * @param  {String}   activationKey Activation Key.
 * @param  {Function} callback      Error or User (for immediate login).
 * @return {Function} Callback      Callback.
 */
exports.activate = function(req, res, next) {
  req.assert('activationKey', errorMessages.invalidActivationKey).isUUID(4);
  var errors = req.validationErrors();
  if(errors){
    return res.render(urls.error, { title: 'Error', body: JSON.stringify(errors[0].msg.message) });
  }
  else {
    User.findOne({ 'auth.activationKey': req.params.activationKey },
      function(err, user) {
      // validate if a user exists for the selected key
      if (err || !user) {
        return res.render(urls.error, { title: 'Error', body: errorMessages.invalidActivationKey.message });
      }
      // validate if the key has already been used
      else if (user.auth.activationKeyUsed) {
        console.log(errorMessages.usedActivationKey);
        return res.render(urls.error, { title: 'Error', body: errorMessages.usedActivationKey.message });
        // return res.redirect(urls.login);
      }
      // activate the user if the validations pass
      else {
        var updates = {
          active: true,
          'auth.activationKeyUsed': true,
          'auth.accountDeactivated': false
        };

        user.update(updates, function(err) {
          if(err) {
            // TODO: what to do in cases of database failure?
            req.session.error = new Error('Failed to update user. Please try again');
            // return res.render(urls.error, { title: 'Error' });
            return res.redirect(urls.resendActivation);
          }
          req.newUser = user;
          return next();
        });
      }
    });
  }
};


/**
 * Routing middleware to automatically login a user
 * Will create cookie if user has "remember me" selected
 * @param  {object}   req  Request.
 * @param  {object}   res  Response.
 * @param  {object}   next Middleware chain.
 * @return {mixed}         Error: Redirects to Login - login failed
 *                         Success: Redirect to home page - not from cookie
 *                         Success: Fall through - from cookie.
 */
exports.loginUser = function(req, res, next) {
  console.log(req.newUser);
  if (req.newUser) {
    //wipe out req.newUser
    var newUser = req.newUser;
    req.newUser = {};

    req.login(newUser, function(err) {
      if (err) {
        return res.redirect(urls.login);
      }
      if (req.body.remember_me) {
        var agent = useragent.parse(req.headers['user-agent']);
        // TODO: add geo ip
        var loginToken = new LoginToken(
          { email: newUser.email, ip: req.ip, userAgent: agent, series: uuid() });
        loginToken.save(function(err) {
          if (err) {
            return res.redirect(urls.login);
          }
          res.cookie('logintoken', loginToken.cookieValue,
            { maxAge: 2 * 604800000, signed: true, httpOnly: true });
          return res.redirect(urls.home);
        });
      }
      else {
        console.log('should make it here');
        return res.redirect(urls.home);
      }
    });
  }
  else { return next(); }
};
