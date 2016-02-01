/**
 * @author nisheeth
 * @date 29 Sep 2015
 */

module.exports = {
  requireLogin: function(req, res, next) {
    if (req.session.user) return next();
    //console.log(req);
    if (req.method === 'GET') req.session.returnToUrl = req.originalUrl;
    req.flash('error', 'Not Logged In');
    res.redirect('/#/login');
  },

  hasAuthorization: function(username, redirect) {
    return function(req, res, next) {
      if (req.session.user.username === username) return next();
      req.flash('error', 'Not Authorized');
      res.redirect(redirect)
    }
  }
};