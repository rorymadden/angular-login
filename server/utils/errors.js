'use strict';

var util = require('util');

/**
 * Application wide error codes.
 * @type {ErrorCodes}
 */

// From http://dustinsenos.com/articles/customErrorsInNode
// Create a new Abstract Error constructor
var AbstractError = function (code, msg, constr) {
  // If defined, pass the constr property to V8's
  // captureStackTrace to clean up the output
  Error.captureStackTrace(this, constr || this);

  // If defined, store a custom error message
  this.message = msg || 'Error';

  // if defined store the code
  this.code = code;
};
util.inherits(AbstractError, Error);
AbstractError.prototype.name = 'Abstract Error';
AbstractError.prototype.code = 0;

// Create the ApiError
var ApiError = function (code, msg) {
  ApiError.super_.call(this, code, msg, this.constructor);
};
util.inherits(ApiError, AbstractError);
ApiError.prototype.message = 'API Error';

// Create the DatabaseError
var DatabaseError = function (msg) {
  DatabaseError.super_.call(this, msg, this.constructor);
};
util.inherits(DatabaseError, AbstractError);
DatabaseError.prototype.message = 'Database Error';

// Create the MailerError
var MailerError = function (msg) {
  MailerError.super_.call(this, msg, this.constructor);
};
util.inherits(MailerError, AbstractError);
MailerError.prototype.message = 'Mailer Error';

module.exports = {
  ApiError: ApiError,
  DatabaseError: DatabaseError,
  MailerError: MailerError
};