'use strict';

var User = require('../models/user');
/*
 * Serve JSON to our AngularJS client
 */

exports.register = function (req, res) {
  // validate that terms and conditions have been met if manual signup
  //console.log(req.body)
  req.assert('password', 'Password must be greater than 6 characters')
    .len(6, 20);
  req.assert('tandc', 'Please agree to the terms and conditions')
    .equals('agreed');
  var errors = req.validationErrors();
  if(errors){
    res.json(406, {error: errors});
  }
  else {
    User.findByEmail(req.body.email.trim().toLowerCase(), function(err, user){
      if(user && user.active){
        res.json(406, {error: 'User active, please sign in'});
      }
      if(user && !user.active){
        res.json(406, {error: 'User registered, please activate'});
      }
      else {
        var newUser = new User({
          first: req.body.first,
          last: req.body.last,
          email: req.body.email,
          gender: req.body.gender,
          password: req.body.password,
          birthday: req.body.birthday
        });
        newUser.save(function(err){
          if(err) {
            res.json(406, {error: err});
          }
          else {
            res.json(200, {user: user});
          }
        });
      }
    });
  }
};