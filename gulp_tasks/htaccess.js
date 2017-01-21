'use strict';

var gulp = require('gulp');

// а htaccess:
module.exports = function (options) {
	return function () {
		return gulp.src(options.src)
			.pipe(gulp.dest(options.dst));
	};
};
