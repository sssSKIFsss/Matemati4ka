'use strict';

var $, gulp;
// автоподключение плагинов gulp-
$ = require('gulp-load-plugins')();
// собсвтенно сам сборщик - gulp
gulp = require('gulp');

// флаг отладки(с маппингом) / релиза(без маппинга)
var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

// Сборка sprite:
module.exports = function (options) {
	return function () {
		return gulp.src(options.src)
			.pipe($.plumber())
			.pipe($.svgo())
			.pipe($.svgSprite({
				shape: {spacing: {padding: 1}}, // отступы вокруг картинок
				mode: {
					css: {
						dest: '.', // корневая папка - option.src(build)/css
						bust: !isDevelopment, // писать или не писать хеш-имена файлов
						sprite: '../img/sprite.svg', // имя файла со спрайтом
						layout: 'vertical', // вертикальное расположение картинок в спрайте
						prefix: '.icon-', // префикс переменных в scss-файле, описывающем срайт
						dimensions: true, // добавлять или нет размеры картинок в спрайте
						render: {
							scss: { // определяется тип рендеринга
								dest: 'sprite.scss' // файл с css-описанием спрайта
							}
						}
					}
				}
			}))
			.pipe($.if('*.scss', gulp.dest(options.tmp), gulp.dest(options.dst)));
	}
};
