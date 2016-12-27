var mongoose = require('mongoose');
// var crypto = require('crypto');
// var bcrypt = require('bcrypt');
var config = require('../../config');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// create a schema

var userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: String,
    created_at: {type:Date, default: Date.now},
    games : []
});

// the schema is useless so far
// we need to create a model using it

userSchema.methods.addGame = function(gameId) {
	this.model.games.push(gameId);
};

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;