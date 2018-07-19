var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	aIncome: {
		type: String
	},
	income: {
		type: String
	},
	expenses: {
		type: String
	},
	savings: {
		type: String
	},
	ltg1: {
		type: String
	},
	an1: {
		type: String
	},
	ltg2: {
		type: String
	},
	stg1: {
		type: String
	},
	stg2: {
		type: String
	},
	stg3: {
		type: String
	},
	stg4: {
		type: String
	},
	an2: {
		type: String
	},
	an3: {
		type: String
	},
	an4: {
		type: String
	},
	lan1: {
		type: String
	},
	lan2: {
		type: String
	},
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}