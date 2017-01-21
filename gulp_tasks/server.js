'use strict';

// создание сервера и обмен данными с браузером
var browserSync = require('browser-sync').create();

// переменная с настройками нашего сервера:
var config = {
	server: {
		baseDir: "./build"
	},
	tunnel: true,
	host: 'localhost',
	port: 9000,
	logPrefix: "Frontend_Devil"
};

// Веб сервер
module.exports = function (options) {
	return function () {
		browserSync.init(config);
		browserSync.watch(options.src).on('change', browserSync.reload);
	};
};
