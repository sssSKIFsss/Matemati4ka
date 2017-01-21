'use strict';

var $, gulp, pngquant;
$ = require('gulp-load-plugins')();
gulp = require('gulp');
pngquant  = require('imagemin-pngquant');

// Сборка картинок:
module.exports = function (options) {
	return function () {
		return gulp.src(options.src, {since: gulp.lastRun(options.taskName)})
			.pipe($.plumber())
			.pipe($.imagemin({
				progressive: true,
				svgoPlugins: [{removeViewBox: false}],
				use: [pngquant()],
				interlaced: true
			}))
			.pipe(gulp.dest(options.dst));
	};
};
