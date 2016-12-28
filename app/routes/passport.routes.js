var express = require('express');
var passport = require('passport');
var User = require('../models/Users');
var path = require('path');
// var config = require('../../config');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('home', {
        title: 'Home',
        user: req.user
    });
});

router.get('/register', function(req, res) {
    res.render('register', {
        title: 'Register'
    });
});

router.post('/register', function(req, res, next) {
    User.register(new User({
        username: req.body.username
    }), req.body.password, function(err, user) {
        if (err) {
            return res.render('register', {
                error: err.message,
                title: 'Register'
            });
        }

        passport.authenticate('local')(req, res, function() {
            req.session.save(function(err) {
                if (err) {
                    return next(err);
                }
                console.log('user registered!');
                res.redirect('/');
            });
        });
    });
});


router.get('/login', function(req, res, next) {
    if (req.user === undefined) {
        res.render('login', {
            title: 'Login',
            user: req.user,
            error: req.flash('error')
        });
    }
    else
        next();

});

router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    function(req, res) {
        res.redirect('/');
    });

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res) {
    res.status(200).send("pong!");
});

// Catch All

router.get('*', function(req, res) {
    res.render('home', {
        title: 'Home',
        user: req.user
    });
});


module.exports = router;