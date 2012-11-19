'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var timestamp = require('mongoose-timestamp')

// var cryptographicService = require('../utils/cryptographicService.js');

// var MAX_LOGIN_ATTEMPTS = 5;
// var LOCK_TIME = 5 * 60 * 1000;
var GENDER = ['unknown', 'male', 'female'];

var roleSchema = new Schema({
  name:'String',
  group: 'ObjectId'
});

// var exports = module.exports = mongoose.model('Role', roleSchema);

var UserSchema = new Schema({
  email: { type: String, required: true, lowercase: true, trim: true,
    index: { unique: true } },
  first:{ type: String, required: true, trim: true },
  last:{ type: String, required: true, trim: true },
  auth: {
    hashed_password: { type: String },
    activationKey: { type: String, sparse: true },
    activationKeyUsed: { type: Boolean, default: false }
    // passwordResetKey: { type: String },
    // passwordResetDate: { type: Date },
    // passwordResetUsed: { type: Boolean },
    // loginAttempts: { type: Number, required: true, default: 0 },
    // lockUntil: { type: Number },
    // accountDeactivated: { type: Boolean, default: false }
  },
  gender: { type: String, required: true, default: 'unknown',
    enum: GENDER },
  birthday: { type: String },
  active:{ type: Boolean, default: false },
  roles:[roleSchema],
  google: {},
  facebook: {}
});

//index
// UserSchema.index({ _id: 1, "auth.passwordResetKey": 1 })

/**
 * Virtuals
 */

UserSchema
   .virtual('id')
   .get(function () {
     return this._id.toHexString();
   });

UserSchema
   .virtual('name')
   .get(function () {
     return this.first +" "+this.last;
   });

UserSchema
   .virtual('password')
   .get(function () {
     return this.auth.hashed_password;
   })
   .set(function (value) {
     this._password = value;
   });

// UserSchema
//   .virtual('isLocked')
//   .get(function() {
//     // check for a future lockUntil timestamp
//     return !!(this.auth.lockUntil && this.auth.lockUntil > Date.now());
//   });

/**
 * Instance Methods
 */

// UserSchema.methods.incLoginAttempts = function(callback) {
//   // if we have a previous lock that has expired, restart at 1
//   if (this.auth.lockUntil && this.auth.lockUntil < Date.now()) {
//     return this.update({
//         $set: { "auth.loginAttempts": 1 },
//         $unset: { "auth.lockUntil": 1 }
//     }, callback);
//   }
//   // otherwise we're incrementing
//   var updates = { $inc: { "auth.loginAttempts": 1 } };
//   // lock the account if we've reached max attempts and it's not locked already
//   if (this.auth.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
//     updates.$set = { "auth.lockUntil": Date.now() + LOCK_TIME };
//   }
//   return this.update(updates, callback);
// };

UserSchema.statics.findByEmail = function(email, callback) {
  if(!email) {
    return callback(new Error('errors.missingEmail'), null);
  }
  else {
    this.findOne({email: email}, function(err, user){
      return callback(err, user);
    });
  }
};

/**
 * Pre Validate
 */
// UserSchema.pre('validate', function (next) {
//   var user = this;

//   //Hash Password
//   // only hash the password if it has been set
//   if (!user._password) {
//     next();
//     return;
//   };
//   // Encrypt the password with bcrypt
//   cryptographicService.cryptPassword(user._password, function(err, hash) {
//     if (err) return next(err);
//     user.auth.hashed_password = hash;
//     next();
//   });
// });

module.exports = mongoose.model('User', UserSchema);