const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const merge = require('webpack-merge');
const tplConfig = require('./tpl.config');
const webpack = require('webpack');
const loaderConfig = require('./loader.config');

function resolve(dir) {
	return path.join(__dirname, '..', dir);
};

var baseConfig = merge(tplConfig, {
		entry: {
			vendor: ['jquery', 'js-cookies', 'decimal', './src/common/ajax.js', './src/common/util.js', './src/components/header/header.js'],
			index: './src/index.js',
			user: ['./src/user/js/leftContainer.js', './src/user/js/user.js'],
			candyShop: ['./src/user/js/leftContainer.js', './src/user/js/candyShop.js'],
			vip: ['./src/user/js/leftContainer.js', './src/user/js/vip.js'],
			myWallet: ['./src/user/js/leftContainer.js', './src/user/js/myWallet.js'],
			setting: ['./src/common/jquery.fileupload.js',
				'./src/common/jquery-ui-widget.js', './src/user/js/leftContainer.js', './src/user/js/setting.js'],
			forgetPassword: ['./src/user/js/leftContainer.js', './src/user/setting/js/forgetPassword.js'],
			bindMobile: ['./src/user/js/leftContainer.js', './src/user/setting/js/bindMobile.js'],
			changePassword: ['./src/user/js/leftContainer.js', './src/user/setting/js/changePassword.js'],
			payPassword: ['./src/user/js/leftContainer.js', './src/user/setting/js/payPassword.js'],

			sign: './src/log/js/sign.js',
			register: './src/log/js/register.js',
			forgetPassword: './src/log/js/forgetPassword.js',
			idea: [
				'./src/common/jquery.fileupload.js',
				'./src/common/jquery-ui-widget.js',
				'./src/idea/idea.js'],
			candyNews: './src/candyNews/candyNews.js',
			floatSign: './src/floatSign.js',
			overdue: './src/overdue.js',
			telegram:'./src/telegram/telegram.js'
		},
		module: loaderConfig,
		output: {
			path: resolve('dist'),
			// filename: 'static/js/[name].[hash:5].js'
			filename: 'static/js/[name].js?v=[hash:5]'
		},
		resolve: {
			extensions: ['.js', '.json'],
			alias: {
				'@util': resolve('src/common/util.js'),
			}
		},
		plugins: [
			new webpack.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery'
			}),
			new webpack.optimize.CommonsChunkPlugin({
				names: ['vendor'],
			})
		]
	}
);
module.exports = baseConfig;
