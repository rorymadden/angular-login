'use strict';

var nodemailer = require('nodemailer');
var Errors = require('./errors');

// email templates
var path = require('path');
var emailTemplates = require('email-templates');
var templatesDir = path.resolve(__dirname, '../views/', 'emailTemplates');

// configuration
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];
// var logger = require('./loggerService.js').logger;

// Create a transport object
if (typeof(config.amazon) !== 'undefined') {
  // Create an Amazon SES transport object
  var transport = nodemailer.createTransport('SES', {
    AWSAccessKeyID: config.amazon.AWSAccessKeyID,
    AWSSecretKey: config.amazon.AWSSecretKey,
    ServiceUrl: config.amazon.ServiceUrl
  });
}
else {
  var transport = nodemailer.createTransport('SMTP', {
    service: config.smtp.service,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass
    }
  });
}

/**
 * Send a single email
 * @param  {object}   options  options.template = required email template
 *                             Need a folder in views/emailTemplates.
 *                             options.from = from email address
 *                             "First Last <email>".
 *                             options.subject = subject line.
 * @param  {object}   data     Data to be populated in the email
 *                             e.g data.email, data.name.
 * @param  {Function} callback needs variables err and template.
 *                             Either error out or pass through to the
 *                             template generation.
 */
exports.sendMail = function(options, data, callback) {
  emailTemplates(templatesDir, function(err, template) {
    if (err) {
      callback(new Errors.MailerError(err));
    } else {
      // Send a single email
      template(options.template, data, function(err, html, text) {
        if (err) {
          callback(new Errors.MailerError(err));
        } else {
          transport.sendMail({
            from: options.from,
            to: data.email,
            subject: options.subject,
            html: html,
            // generateTextFromHTML: true,
            text: text
          }, function(err, responseStatus) {
            if (err) {
              callback(new Errors.MailerError(err));
            } else {
              callback(null, responseStatus);
            }
          });
        }
      });
    }
  });
};
