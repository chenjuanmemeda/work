'use strict';
const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const loaderConfig = require('./loader.config');
const baseConfig = require('./webpack.base.conf');

module.exports = merge(baseConfig, {

	devServer: {
		historyApiFallback: true,
		compress: true,
		noInfo: true,
		quiet: true,
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	]
});
