var express = require('express');
var router = express.Router();
// Needed to add Mongo Schema Data
var User = require('../models/user.js');

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	User.find(req.params.id, function(err, user) {
	// matches handlebars with all user data
		res.render('index', { content: user	
	})
	
		
		
	});
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;