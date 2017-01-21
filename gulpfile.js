// gulp                  - development version
// NODE_ENV=release gulp - release version
// set NODE_ENV=release && gulp - для windows

'use strict';

//VARIABLES ------------------------------------------------------------------
var gulp = require('gulp');

// js объект в который пропишем все нужные нам пути,
// чтобы при необходимости легко в одном месте их редактировать:
var path = {
	build: { // пути, куда складывать готовые после сборки файлы
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		images: 'build/img/',
		photos: 'build/photos/',
		fonts: 'build/fonts/'
	},
	src: { // Пути откуда брать исходники
		htaccess: '.htaccess',
		favicon: 'src/favicon.ico',
		html: 'src/*.html',
		js: 'src/js/main.js',
		style: 'src/style/main.scss',
	 	images: 'src/images/*.{png,jpg,gif}',
		photos: 'src/photos/*.*',
		svg_sprite: 'src/images/sprites/svg/*.svg',
		fonts: 'src/fonts/**/*.*'
	},
	tmp: { // Место хранения временных файлов
		style: 'tmp/style/'
	},
	manifest: {
		html_path: 'manifest/html_url.json',
		css_path: 'manifest/css_url.json',
		css_hash: 'manifest/css_hash.json',
		js_path: 'manifest/js_url.json',
		js_hash: 'manifest/js_hash.json'
	},
	watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
		html: ['src/*.html','src/html_blocks/**/*.html'],
		js: ['src/js/*.js','src/js/partials/**/*.js'],
		style: ['src/style/*.scss','src/style/partials/**/*.scss','tmp/style/*.scss'],
		images: 'src/images/**/*.{png,jpg,gif}',
		photos: 'src/photos/*.*',
		svg_images: 'src/images/svg/*.svg',
		fonts: 'src/fonts/**/*.*'
	}
};

// вызов тасков через require из task-файлов
function lazyRequireTask(taskName, path, options) {
	options = options || {};
	options.taskName = taskName;
	gulp.task(taskName, function(callback) {
		let task = require(path).call(this,options);
		return task(callback);
	});
}

// TASKS ---------------------------------------------------------------------

// Очистка папки build
lazyRequireTask('clean','./gulp_tasks/clean',{
	src: path.build.html,
	tmp: path.tmp.style,
	css_hash: path.manifest.css_hash,
	js_hash: path.manifest.js_hash
});

// Веб сервер
lazyRequireTask('server','./gulp_tasks/server',{
	src: path.build.html + '**/*.*'
});

// Перенос htaccess:
lazyRequireTask('htaccess:copy', './gulp_tasks/copy', {
	src: path.src.htaccess,
	dst: path.build.html
});

// Перенос favicon:
lazyRequireTask('favicon:copy', './gulp_tasks/copy', {
	src: path.src.favicon,
	dst: path.build.html
});

// Сборка html:
lazyRequireTask('html:build', './gulp_tasks/html', {
	src: path.src.html,
	dst: path.build.html
});

// Сборка css:
lazyRequireTask('css:build', './gulp_tasks/css', {
	src: path.src.style,
	dst: path.build.css,
	sprite_dst: path.build.images
});

// Сборка js:
lazyRequireTask('js:build', './gulp_tasks/js', {
	src: path.src.js,
	dst: path.build.js,
	file1: "bower_components/respond/dest/respond.min.js",
	file2: "src/js/vendors/modernizr-2.6.2.min.js"
});

// Перенос картинок:
lazyRequireTask('images:build', './gulp_tasks/images', {
	src: path.src.images,
	dst: path.build.images
});

// Перенос фото:
lazyRequireTask('photos:copy', './gulp_tasks/copy', {
	src: path.src.photos,
	dst: path.build.photos
});

// Сборка спрайта svg. Сборка jpg и png выполняется в css:
lazyRequireTask('svg_sprite:build', './gulp_tasks/svg_sprite', {
	src: path.src.svg_sprite,
	dst: path.build.images,
	tmp: path.tmp.style
});

// Перенос шрифтов:
lazyRequireTask('fonts:copy', './gulp_tasks/copy', {
	src: path.src.fonts,
	dst: path.build.fonts
});

// Такс, объединяющий все вышеприведенные:
gulp.task('build', gulp.series(
	'clean',
	'svg_sprite:build', // обязательно перед css:build
	gulp.parallel(
		'htaccess:copy',
		'favicon:copy',
		'fonts:copy',
		'photos:copy',
		'images:build',
		'js:build',
		'css:build'
	),
	'html:build' // зависит от хеш-сумм js и css файлов при продакшене
));

	// Таск-watcher:
		gulp.task('watch', function(){
			gulp.watch(path.watch.html, gulp.series('html:build'));
			gulp.watch(path.watch.style, gulp.series('css:build'));
			gulp.watch(path.watch.js, gulp.series('js:build'));
			gulp.watch(path.watch.images, gulp.series('images:build'));
			gulp.watch(path.watch.svg_images, gulp.series('svg_sprite:build'));
			gulp.watch(path.watch.fonts, gulp.series('fonts:copy'));
		});

	// Итоговый таск - Development
		gulp.task('default', gulp.series('build', gulp.parallel('server', 'watch')));

/*
	// отслеживание работы gulp через плагин gulp-debug

	const debug = require('gulp-debug');
	gulp.task('html:build', function () {
		return gulp.src(path.src.html) //Выберем файлы по нужному пути
			.pipe(debug({title: 'src'})) // дебажим src
			.pipe(rigger())
			.pipe(debug({title: 'rigger'})) // дебажим rigger
			.pipe(gulp.dest(path.build.html)); //Выплюнем их в папку build
	});
*/

/*
// вывод на консоль содержимого потока в виде файлов

	gulp.task('html:build', function () {
		return gulp.src(path.src.html)
			.on('data', function(file){
				console.log({
					// main components
					contents: file.contents,
					path:     file.path,
					cwd:      file.cwd,
					base:     file.base,
					// component helpers
					relatime: file.relative,
					dirname:  file.dirname,
					stem:     file.stem,
					extname:  file.extname
				});
			})
			.pipe(gulp.dest(path.build.html)); //Выплюнем их в папку build
	});
*/
