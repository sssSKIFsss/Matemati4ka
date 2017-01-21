'use strict';

var $, gulp, combiner, rebase;
// автоматическое подключение плагинов gulp
$ =require('gulp-load-plugins')();
// собсвтенно сам сборщик - gulp
gulp = require('gulp');
/* отслеживание ошибок*/
combiner = require('stream-combiner2').obj;

// флаг отладки (файлы с маппингом)/релиза (файлы без маппинга)
var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';


// Сборка js:
module.exports = function (options) {
	return function () {
		return gulp.src([options.file1,options.file2])
			.pipe($.plumber())
			.pipe(gulp.dest(options.dst))
			.pipe(gulp.src(options.src))
			.pipe($.if(isDevelopment, $.sourcemaps.init()))
			.pipe($.rigger())
			.pipe($.revReplace({
				manifest: gulp.src('manifest/js_url.json')
			}))
			.pipe($.uglify())
			.pipe($.if(isDevelopment, $.sourcemaps.write()))
			.pipe($.if(!isDevelopment, $.rev()))
			.pipe(gulp.dest(options.dst))
			.pipe($.if(!isDevelopment, combiner(
				$.rev.manifest('js_hash.json'), gulp.dest('manifest')
			)));
	}
};
