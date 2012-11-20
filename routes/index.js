
/*
 * GET home page.
 */

exports.index = function(req, res){
  var homeURL = req.isAuthenticated() ? 'indexAuthenticated' : 'index';
  // var homeURL = 'index';
  res.render(homeURL, {title: 'Home'});
};

exports.account = function (req, res) {
  var name = req.params.name;
  res.render('account/' + name);
};

exports.modals = function (req, res) {
  var name = req.params.name;
  res.render('modals/' + name);
};

// exports.error = function (req, res) {
//   var name = req.params.name;
//   res.render('error', { title: 'Error' });
// };