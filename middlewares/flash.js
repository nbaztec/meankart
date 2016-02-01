/**
 * @author nisheeth
 * @date 29 Sep 2015
 */

module.exports = function(req, res, next) {
  res.locals.flash_messages = req.flash();
  next();
};