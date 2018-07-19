var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

// Register
router.get('/register', function (req, res) {
	res.render('register');
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});

// Register User
router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var aIncome = req.body.aIncome;
	var income = req.body.income;
	var expenses = req.body.expenses;
	var savings = req.body.savings;
	var stg1 = req.body.stg1;
	var an1 = req.body.an1;
	var ltg1 = req.body.ltg1;
	var stg2 = req.body.stg2;
	var ltg2 = req.body.ltg2;
	var stg3 = req.body.stg3;
	var stg4 = req.body.stg4;
	var an2 = req.body.an2;
	var an3 = req.body.an3;
	var an4 = req.body.an4;
	var lan1 = req.body.lan1;
	var lan2 = req.body.lan2;


	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	req.checkBody('aIncome', 'Annual Income is required').notEmpty();
	req.checkBody('income', 'Income is required').notEmpty();
	req.checkBody('expenses', 'Expenses is required').notEmpty();
	req.checkBody('savings', 'Savings is required').notEmpty();
	req.checkBody('stg1', 'Goal is required').notEmpty();
	req.checkBody('an1', 'Amount is required').notEmpty();
	req.checkBody('ltg1', 'Goal is required').notEmpty();
	req.checkBody('stg2', 'Goal is required').notEmpty();
	req.checkBody('ltg2', 'Goal is required').notEmpty();
	req.checkBody('stg3', 'Goal is required').notEmpty();
	req.checkBody('stg4', 'Goal is required').notEmpty();
	req.checkBody('an1', 'Amount is required').notEmpty();
	req.checkBody('an2', 'Amount is required').notEmpty();
	req.checkBody('an3', 'Amount is required').notEmpty();
	req.checkBody('an4', 'Amount is required').notEmpty();
	req.checkBody('lan1', 'Amount is required').notEmpty();
	req.checkBody('lan2', 'Amount is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({ username: { 
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('register', {
						user: user,
						mail: mail
					});
				}
				else {
					var newUser = new User({
						name: name,
						email: email,
						username: username,
						password: password,
						aIncome: aIncome,
						income: income,
						expenses: expenses,
						savings: savings,
						stg1: stg1,
						an1: an1,
						ltg1: ltg1,
						stg2: stg2,
						ltg2: ltg2,
						stg3: stg3,
						stg4: stg4,
						an2: an2,
						an3: an3,
						an4: an4,
						lan1: lan1,
						lan2: lan2,
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         	req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/users/login');
				}
			});
		});
	}
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;