'use strict';

var gulp = require('gulp');

// копируем файлы:
module.exports = function (options) {
	return function () {
		return gulp.src(options.src)
			.pipe(gulp.dest(options.dst));
	};
};