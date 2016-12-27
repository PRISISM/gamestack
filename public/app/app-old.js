// var app = angular.module('gamesCollection', []);

// function mainController($scope, $http) {
	
// }

// app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

// 	$stateProvider

// 		.state('home', {
// 			url: '/home',
// 			templateUrl: 'public/app/views/pages/home.html'
// 		})

// 		.state('about', {
// 			url: '/about',
// 			templateUrl: 'public/app/views/pages/about.html'
// 		})

// 		.state('login', {
// 			url: '/login',
// 			templateUrl: 'public/app/views/pages/login.html',
// 			controller: 'AuthCtrl',
// 			onEnter: ['$state', 'auth', function($state, auth) {
// 				if (auth.isLoggedIn()) {
// 					$state.go('home');
// 				}
// 			}]
// 		})

// 		.state('register', {
// 			url: '/register',
// 			templateUrl: 'public/app/views/pages/register.html',
// 			controller: 'AuthCtrl',
// 			onEnter: ['$state', 'auth', function($state, auth) {
// 				if (auth.isLoggedIn()) {
// 					$state.go('home');
// 				}
// 			}]
// 		});

// 	$urlRouterProvider.otherwise('home');
// 	$locationProvider.html5Mode(true);
// });

// app.factory('auth', ['$http', '$window', function($http, $window) {
// 	var auth = {};

// 	auth.saveToken = function (token){
// 	  $window.localStorage['games-collection-token'] = token;
// 	};

// 	auth.getToken = function (){
// 	  return $window.localStorage['games-collection-token'];
// 	};

// 	auth.isLoggedIn = function(){
// 	  var token = auth.getToken();

// 	  if(token){
// 	  	var payload = JSON.parse(window.atob(window.localStorage['games-collection-token'].split('.')[1]));
// 	    // var payload = JSON.parse($window.atob(token.split('.')[1]));

// 	    return payload.exp > Date.now() / 1000;
// 	  } else {
// 	    return false;
// 	  }
// 	};

// 	auth.currentUser = function(){
// 	  if(auth.isLoggedIn()){
// 	    var token = auth.getToken();
// 	    var payload = JSON.parse(window.atob(token.split('.')[1]));

// 	    return payload.username;
// 	  }
// 	};

// 	auth.register = function(user){
// 	  return $http.post('/register', user).then(function(data){
// 	    auth.saveToken(data.token);
// 	  });
// 	};


// 	auth.logIn = function(user){
// 	  return $http.post('/login', user).then(function(data){ //success??
// 	    auth.saveToken(data.token);
// 	  });
// 	};

// 	auth.logOut = function(){
// 	  $window.localStorage.removeItem('games-collection-token');
// 	};

// 	return auth;

// }]);

// app.controller('AuthCtrl', [
// '$scope',
// '$state',
// 'auth',
// function($scope, $state, auth){
//   // alternatively: vm = this 
//   $scope.user = {};

//   $scope.register = function(){
//   	auth.register($scope.user).then(function() {
//   		$state.go('home');
//   	});

//     // auth.register($scope.user).error(function(error){
//     //   $scope.error = error;
//     // }).then(function(){
//     //   $state.go('home');
//     // });
//   };

//   $scope.logIn = function(){
//   	auth.logIn($scope.user).then(function() {
//   		$state.go('home');
//   	});
//     // auth.logIn($scope.user).error(function(error){
//     //   $scope.error = error;
//     // }).then(function(){
//     //   $state.go('home');
//     // });
//   };
// }]);
