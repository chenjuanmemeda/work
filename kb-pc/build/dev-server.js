const express = require('express');
const webpack = require('webpack');
const opn = require('opn');

const app = express();
const port = 3000;

const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('./webpack.dev.conf');
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
	publicPath: config.output.publicPath,
	quiet: true,
	hotOnly: true,
	stats: 'minimal'
}));

app.use(webpackHotMiddleware(compiler, {
	log: false,
	heartbeat: 2000,
}));

app.listen(port, function () {
	console.log('success listen to ' + port);
});