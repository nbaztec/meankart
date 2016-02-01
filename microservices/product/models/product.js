/**
 * @author nisheeth
 * @date 23 Oct 2015
 */

var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  description: {type: String, required: true, unique: true},
  brand: {type: String, required: true},
  price: {type: Number, required: true},
});


module.exports = mongoose.model('Product', ProductSchema);