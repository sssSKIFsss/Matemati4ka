'use strict';

var $, gulp, combiner;
// автоподлючение плагинов gulp
$ = require('gulp-load-plugins')();
// собсвтенно сам сборщик - gulp
gulp = require('gulp');
// отслеживание ошибок
combiner = require('stream-combiner2').obj;

// флаг отладки(с маппингом) / релиза(без маппинга)
var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

// Сборка html:
module.exports = function (options) {
	return function () {
		return gulp.src(options.src)
			// вывод ошибки без прерывания работы gulp
			.pipe($.plumber())
			// объединение файлов .html в один
			.pipe($.rigger())
			// замена путей и урлов
			.pipe($.revReplace({ manifest: gulp.src('manifest/html_url.json') }))
			// замена имён файлов (css,js) на их хеш-имена
			.pipe($.if(!isDevelopment, combiner(
				$.revReplace({
					manifest: gulp.src('manifest/css_hash.json', {allowEmpty: true})
				}),
				$.revReplace({
					manifest: gulp.src('manifest/js_hash.json', {allowEmpty: true})
				})
			)))
			// запись в конечный файл
			.pipe(gulp.dest(options.dst))
	}
};
