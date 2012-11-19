
/*
 * GET home page.
 */

exports.index = function(req, res){
  // var homeURL = req.isAuthenticated() ? 'indexAuthenticated' : 'index';
  var homeURL = 'index';
  res.render(homeURL, {title: 'Home'});
};

// exports.login = function(req, res){
//   res.render('account/login', {title: 'Login'});
// };
// exports.register = function(req, res){
//   res.render('account/register', {title: 'Register'});
// };
// exports.resendActivation = function(req, res){
//   res.render('account/resendActivation');
// };
// exports.forgotPassword = function(req, res){
//   res.render('account/forgotPassword');
// };

// exports.partials = function (req, res) {
//   var name = req.params.name;
//   res.render('partials/' + name);
// };

exports.account = function (req, res) {
  var name = req.params.name;
  res.render('account/' + name);
};

exports.modals = function (req, res) {
  var name = req.params.name;
  res.render('modals/' + name);
};