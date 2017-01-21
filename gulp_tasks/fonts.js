'use strict';

var gulp;
// собсвтенно сам сборщик - gulp
gulp = require('gulp');


// Сборка шрифтов:
module.exports = function (options) {
	return function () {
		return gulp.src(options.src, {since: gulp.lastRun(options.taskName)})
			.pipe(gulp.dest(options.dst));
	};
};
