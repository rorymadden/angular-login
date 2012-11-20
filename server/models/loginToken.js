'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('uuid-v4');

var loginTokenSchema = new Schema({
    email: {type: String, required: true }
  , series: {type: String, required: true }
  , token: {type: String, required: true }
  , ip: { type: String, required: true }
  , created: { type: Date, required: true }
  , userAgent: {}
  , location: {}
});

//Indexes
loginTokenSchema.index({ email: 1, series: 1, token: 1 });

loginTokenSchema
  .virtual('id')
  .get(function() {
    return this._id.toHexString();
  });

loginTokenSchema
  .virtual('cookieValue')
  .get(function() {
    return JSON.stringify(
      { email: this.email, series: this.series, token: this.token});
  });

loginTokenSchema.pre('save', function(next) {
  // Automatically create the token
  this.token = uuid();
  this.created = new Date();
  next();
});

/**
 * LoginToken model
 * @type {Model}
 */
module.exports = mongoose.model('LoginToken', loginTokenSchema);
