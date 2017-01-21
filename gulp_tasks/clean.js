'use strict';

// удаление файлов и папок
var del = require('del');

// Очистка папки 'options.src
module.exports = function (options) {
	return function () {
		return del([options.src, options.tmp, options.css_hash, options.js_hash]);
	};
};
