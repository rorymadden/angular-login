'use strict';

var bcrypt = require('bcrypt');
var Errors = require('./errors');

/**
 * Salt and Hash a string
 * @param  {String}   password String to be salted and hashed.
 * @param  {function} callback Callback.
 */
exports.cryptPassword = function(password, callback) {
   bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return callback(new Errors.DatabaseError(err));
    }
    else {
      bcrypt.hash(password, salt, function(err, hash) {
          return callback(err, hash);
      });
    }
  });
};

/**
 * Compare a text string to a salted and hashed password
 * @param  {String}   password     String to be compared.
 * @param  {String}   userPassword Salted and Hashed password.
 * @param  {Function} callback     Callback. */
exports.comparePassword = function(password, userPassword, callback) {
   bcrypt.compare(password, userPassword, function(err, isPasswordMatch) {
      if (err) {
        return callback(new Errors.DatabaseError(err));
      }
      else {
        return callback(null, isPasswordMatch);
      }
   });
};