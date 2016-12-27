var mongoose = require('mongoose');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var config = require('../../config');
var jwt = require('jsonwebtoken');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// create a schema
var userSchema = new Schema({
  name: String,
  username: { type: String, required: true, unique: true },
  location: String,
  meta: {
    age: Number,
    website: String
  },
  created_at: {type:Date, default: Date.now},
  updated_at: Date,
  hash: String,
  salt: String
});

// Methods
userSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');

	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

	return this.hash === hash;
};

// Create a JSON web token
userSchema.methods.generateJWT = function() {

  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, config.secret);
};

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;