var express = require('express');
var passport = require('passport');
var User = require('../models/Users');

var router = express.Router();
var path = require('path');
var config = require('../../config');

// put auth in as a middleware for specific routes - whenever they want to write to app

module.exports = function(app, passport) {

    router.param('game', function(req, res, next, id) {
        console.log('middleware param for', id);
        req.id = id;
        return next();

    });

    // Add to user's collection

    router.post('/collection/add', function(req, res) {
        console.log(req.body);
        console.log(req.user);

        req.user.games.push(req.body.game);
        req.user.save(function(err, user) {
            console.log(user);
        });

        res.send("Collection");
    });


    
    // router.param('username', function(req, res, next, username) {
    //     console.log('middleware param for', username);
    //     return next();
    //     // var query = User.findOne({
    //     //     username: username
    //     // });

    //     // query.exec(function  (err, user) {
    //     //     if (err)
    //     //         return next(err);
    //     //     if (!user)
    //     //         return next(new Error('Can\'t find user!'));

    //     //     req.user = user;
    //     //     return next(user);
    //     // });
    // });

    // Get a single user

    router.get('/:username', function(req, res, next) {
        console.log(req.params.username);

        var query = User.findOne({
            username: req.params.username
        });

        query.exec(function(err, foundUser) {
            if (err)
                return next(err);
            if (!foundUser)
                return res.render('home', {
                    error: 'The user with the given username was not found.',
                    title: 'Home',
                    user: req.user
                });
            else
                return res.render('user', {
                    title: foundUser.username,
                    foundUser: foundUser,
                    user: req.user
                });
        });
    });

    // Get all Users
    router.get('/', function(req, res, next) {
        User.find(function(err, users) {
            if (err)
                return next(err);

            res.json(users);
        });

    // // Create a new User
    // // TODO: Authenticate, other fields
    // router.post('/new', function(req, res, next) {
    //     var newUser = new User();

    //     newUser.name = req.body.name; // set the users name (comes from the request)
    //     newUser.username = req.body.username; // set the users username (comes from the request)
    //     newUser.password = req.body.password; // set the users password (comes from the request)

    //     newUser.save(function(err) {
    //         if (err) {
    //             // duplicate entry
    //             if (err.code == 11000)
    //                 return res.json({
    //                     success: false,
    //                     message: 'A user with that username already exists. '
    //                 });
    //             else
    //                 return res.send(err);
    //         }

    //         // return a message
    //         res.json({
    //             message: 'User created!'
    //         });
    //     });
    // });

    });

    return router;
};