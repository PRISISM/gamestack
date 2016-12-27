var gulp = require('gulp');
var gulpInject = require('gulp-inject');

var indexTarget = gulp.src(['./public/app/views/index.html']);
var pageTargets = gulp.src(['./public/app/views/pages/*.html', './public/app/views/pages/*.pug', './public/app/views/pages/partials/*.pug']);
var sources = gulp.src([
	'./public/assets/css/*.css',
	'./public/assets/js/jquery.min.js',
	'./public/assets/js/angular.min.js',
	'./public/assets/js/*.js',
	'./public/app/**/*.js',
	'./public/app/*.js'
], {
	read: false
});

gulp.task('transfer', function() {
	// Move CSS
	var cssSources = ["./node_modules/bootstrap/dist/css/bootstrap.css",
		"./node_modules/bootstrap/dist/css/bootstrap.css.map",
		"./node_modules/font-awesome/css/font-awesome.css"
	];

	gulp.src(cssSources).
	pipe(gulp.dest('./public/assets/css'));

	// Move JS
	var jsSources = ["./node_modules/bootstrap/dist/js/bootstrap.min.js",
		"./node_modules/angular/angular.min.js",
		"./node_modules/jquery/dist/jquery.min.js",
		"./node_modules/angular-ui-router/release/angular-ui-router.min.js",
		"./node_modules/moment/moment.js"
	];

	gulp.src(jsSources).
	pipe(gulp.dest('./public/assets/js'));

	// Move Fonts
	var fonts = ["./node_modules/font-awesome/fonts/*.*"];

	gulp.src(fonts).
	pipe(gulp.dest('./public/assets/fonts'));

});


gulp.task('index', function() {

	// Inject Index
	indexTarget.pipe(gulpInject(sources)).
	pipe(gulp.dest('public/app/views'));

	return pageTargets.pipe(gulpInject(sources)).
	pipe(gulp.dest('public/app/views/pages'));

});