'use strict';

var gulp = require('gulp');
// автоподключение плагинов gulp-
var $ = require('gulp-load-plugins')();
// отслеживание ошибок
var combiner = require('stream-combiner2').obj;
// позволяет читать scss формат в postcss
var scssPCSS = require('postcss-scss');

// флаг отладки(с маппингом) / релиза(без маппинга)
var isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

// Сборка scss:
module.exports = function (options) {
	return function () {
		// чтение исходного файла
		return gulp.src(options.src)
			// вывод ошибки без прерывания работы gulp
			.pipe($.plumber())
			// запус процесса отслеживания изменений
			.pipe($.if(isDevelopment, $.sourcemaps.init()))
			.pipe($.postcss([
				// реализация @import scss,css-файлов в т.ч. для bootstrap
				require("postcss-easy-import")({
					extensions: ['.scss'],
					prefix: '_'
				}),
				// удаление комментариев, которые мешают работе cssnext
				require('postcss-discard-comments'),
				// автопрефикс и CSS4
				require("postcss-cssnext"),
				// сокращённый синтаксис css
				require('postcss-short'),
				// инлайн вставка и изменение цветов svg-картинки
				require('postcss-inline-svg'),
			 	// проверка наличия схожих цветов
				require('colorguard'),
				// проверка совместимости с браузерами
				require('doiuse') ({
					browsers: [ 'ie >= 10', '> 10%' ],
					ignore: ['rem'],  // an optional array of features to ignore
					// an optional array of file globs to match against original source file path, to ignore
					ignoreFiles: ['**/normalize.css', '**/bower_components/**/*.*css', '**/vendors/**/*.*css'],
				}),
				// require("stylelint") (нужно вставить параметры.... )
			], {syntax: scssPCSS}))
			// // компиляция scss файлов в css
			.pipe($.sass())
			.pipe($.postcss([
				// вставка изображений инлайн и операции с их размерами
				require('postcss-assets'),
				// генерация спрайтов для png
				require('postcss-sprites')({
					stylesheetPath: options.dst,
					spritePath: options.sprite_dst,
					filterBy: function(image) {
						// Allow only png files
						if (!/\.png$/.test(image.url)) {
							return Promise.reject();
						}
						return Promise.resolve();
					},
					groupBy: function (image) {
						// разделяем 8 и 32-разрядные png-файлы
						if(image.url.indexOf('x24')===-1) {
							if(image.url.indexOf('x8')===-1) {
								return Promise.reject();
							}
							// 8-разрядные спрайты будут в sprite.8.png
							return Promise.resolve('8');
						}
						// 32-разрядные спрайты будут в sprite.22.png
						return Promise.resolve('24');
					}
				}),
				// обработка ретина-экранов
				require('postcss-at2x'),
				// добавление :focus туда, где есть :hover
				require('postcss-focus'),
				// исправление flex-багов
				require('postcss-flexbugs-fixes'),
				// перемещение media-запросов в конец css-файла
				require('css-mqpacker'),
			]))
			// замена урлов
			.pipe($.revReplace({manifest: gulp.src('manifest/css_url.json')}))
			// минификация и переименование в хеш
			.pipe($.if(!isDevelopment, combiner($.cssnano(), $.rev())))
			// добавление в css карты изменений для отладки
			.pipe($.if(isDevelopment, $.sourcemaps.write()))
			// сохранение
			.pipe(gulp.dest(options.dst))
			// запись в манифест нового хеш-имени css-файла для вставки в html-файл
			.pipe($.if(!isDevelopment, combiner(
				$.rev.manifest('css_hash.json'), gulp.dest('manifest')
			)));
	}
};
