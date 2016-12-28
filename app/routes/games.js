var express = require('express');
// var config = require('../../config');
var request = require('request');
var mongoose = require('mongoose');

router = express.Router();

router.get('/', function(req, res) {
	if (typeof req.query.page === 'undefined')
		req.query.page = 1;

	request({
			url: 'http://giantbomb.com/api/games',
			qs: {
				api_key: process.env.gbApiKey,
				format: 'json',
				field_list: 'name,id,image',
				offset: (req.query.page * 100) - 100
			},
			headers: {
				'User-Agent': 'request'
			}
		},
		function(err, response, body) {
			var jsonGames = JSON.parse(body);
			res.render('all-games', {
				title: 'All Games',
				user: req.user,
				body: jsonGames,
				myPage: parseInt(req.query.page,10),
				path: req.baseUrl + req.path
			});
			console.log(req.user);

		});

});

router.get('/search', function(req, res, next) {
	if (typeof req.query.page === 'undefined')
		req.query.page = 1;

	console.log('Page is', req.query.page);

	console.log(req.baseUrl + req.path);

	request({
			url: 'http://giantbomb.com/api/search',
			qs: {
				api_key: process.env.gbApiKey,
				format: 'json',
				resources: 'game',
				query: req.query.keyword,
				page: req.query.page
			},
			headers: {
				'User-Agent': 'request'
			}
		},
		function(err, response, body) {
			var jsonGames = JSON.parse(body);
			res.render('game-search', {
				title: 'Search Results',
				user: req.user,
				body: jsonGames,
				query: req.query.keyword,
				myPage: parseInt(req.query.page,10),
				path: req.baseUrl + req.path
			});

		});
});

// Route for a single Game

router.param('game', function(req, res, next, id) {
	console.log('middleware param for', id);
	req.id = id;
	return next();

});

router.get('/:game', function(req, res, next) {
	console.log('Game Id is:', req.params.game);
	request({
		url: 'http://www.giantbomb.com/api/game/3030-' + req.id,
		qs: {
			api_key: process.env.gbApiKey,
			format: 'json'
		},
		headers: {
			'User-Agent': 'request'
		}
	}, function(err, response, body) {
		if (err) {
            return res.render('home', {
                error: 'A game with the given ID was not found.',
                title: 'Home'
            });
		}
		var jsonGame = JSON.parse(body);
		if (jsonGame.number_of_total_results === 0) {
            return res.render('home', {
                error: 'A game with the given ID was not found.',
                title: 'Home'
            });
		} else {

			if (jsonGame.results.description){
				var bodyDesc = jsonGame.results.description;
				var strippedDesc = bodyDesc.replace(/<\/?a[^>]*>/g, "");
			}

			else
				var strippedDesc = '';
			// console.log(strippedDesc);

			res.render('game-page', {
				title: jsonGame.results.name,
				body: jsonGame,
				user: req.user,
				desc: strippedDesc
			});
		}

	});
});

router.get('/test', function(req, res) {

	request({
			url: 'http://giantbomb.com/api/search',
			qs: {
				api_key: process.env.gbApiKey,
				format: 'json',
				field_list: 'name,id,image'

			},
			headers: {
				'User-Agent': 'request'
			},
		},
		function(err, response, body) {
			var jsonGames = JSON.parse(body);
			res.render('game', {
				body: jsonGames
			});


		});

});

module.exports = router;