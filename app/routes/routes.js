var express = require('express');
var passport = require('passport');
var User = require('../models/Users');
var request = require('request');

var router = express.Router();
var path = require('path');
// var config = require('../../config');

// put auth in as a middleware for specific routes - whenever they want to write to app

module.exports = function(app, passport) {

    router.param('game', function(req, res, next, id) {
        console.log('middleware param for', id);
        req.id = id;
        return next();

    });

    // Add to user's collection

    router.post('/collection/add', function(req, res) {

        request({
                url: 'http://www.giantbomb.com/api/game/3030-' + req.body.game,
                qs: {
                    api_key: ENV[gbApiKey],
                    format: 'json',
                    field_list: 'name,id,image'
                },
                headers: {
                    'User-Agent': 'request'
                }
            },
            function(err, response, body) {
                jsonGame = JSON.parse(body);


                req.user.games[req.body.game] = jsonGame;
                req.user.markModified('games');
                req.user.save(function(err, user) {
                    console.log(user);
                });
                res.json({
                    success: "Updated Successfully",
                    status: 200
                });
            });

    });

    // Remove from a user's collection
    router.post('/collection/remove', function(req, res) {
        // console.log(req.user, req.body.game);
        delete req.user.games[req.body.game];
        req.user.markModified('games');
        req.user.save(function(err, user) {
            console.log(user);
        });

        res.json({
            success: "Updated Successfully",
            status: 200
        });
        // res.redirect(req.get('referer'));

    });


    // Get a single user

    router.get('/:username', function(req, res, next) {
        console.log(req.params.username);

        var query = User.findOne({
            username: req.params.username
        });

        userGames = {};
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

            return res.render('all-users', {
                title: 'All Users',
                users: users,
                user: req.user
            });
        });

    });

    return router;
};