const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpack = require('clean-webpack-plugin');
const path = require('path');
const baseConfig = require('./webpack.base.conf');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var UglifyjsPlugin = require('uglifyjs-webpack-plugin');

function resolve(dir) {
	return path.join(__dirname, '..', dir);
}


module.exports = merge(baseConfig, {
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new UglifyjsPlugin({
			uglifyOptions: {
				ie8: true,
				drop_console: true
			}
		}),
		new ExtractTextPlugin({
			filename: 'static/css/[name].css?v=[hash:5]',
		}),
	]
});
