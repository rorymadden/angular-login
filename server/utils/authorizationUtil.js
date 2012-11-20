'use strict';

var User = require('../models/user');
var LoginToken = require('../models/loginToken');
var useragent = require('express-useragent');

/**
 * Middelware to validate whether the user is logged is
 * @param  {object}   req  Request.
 * @param  {object}   res  Response.
 * @param  {function} next next middleware.
 * @return {mixed}         Success: Fall through
 *                         Error: Redirect to login page.
 */
exports.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    return res.redirect('/login');
  }
};

/**
 * Middelware to validate whether the user is anonymous
 * @param  {object}   req  Request.
 * @param  {object}   res  Response.
 * @param  {function} next next middleware.
 * @return {mixed}         Success: Fall through
 *                         Error: Redirect to home page.
 */
exports.isAnonymous = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  else {
    return res.redirect('/');
  }
};

/**
 * Routing middleware to automatically login a user from a cookie
 * @param  {object}   req  Request.
 * @param  {object}   res  Response.
 * @param  {object}   next Middleware chain.
 * @return {mixed}         Error: Redirects to Login - login failed
 *                         Success: Fall through.
 */
// exports.loginFromCookie = function(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   // login request with cookie
//   else if (req.signedCookies.logintoken) {
//     var cookie = JSON.parse(req.signedCookies.logintoken);
//     LoginToken.findOne(
//       { email: cookie.email
//         , series: cookie.series
//         , token: cookie.token }, function(err, token) {
//       if (!token) {
//         LoginToken.remove({email: cookie.email, series: cookie.series}
//           , function(err) {
//           // TODO: this means cookie has been compromised - warning?
//           res.clearCookie('logintoken');
//           return next();
//         });
//       }
//       else {
//         User.findOne({ email: cookie.email }, function(err, user) {
//           if (!user) return next();
//           else {
//             //Login User
//             req.login(user, function(err) {
//               //Update Token
//               token.ip = req.ip;
//               token.userAgent = useragent.parse(req.headers['user-agent'])
//               token.save(function(){
//                 res.cookie('logintoken', token.cookieValue,
//                   { maxAge: 2 * 604800000, signed: true, httpOnly: true });
//                   return next();
//               });
//             });
//           }
//         });
//       }
//     });
//   }
//   else return next();
// };
