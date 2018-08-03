const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

function resolve(dir) {
	return path.join(__dirname, '..', dir);
}

var env = process.env.NODE_ENV;
var styleLoader = (env === 'production') ? ExtractTextPlugin.extract({
	fallback: 'style-loader',
	use: [
		{
			loader: 'css-loader',
			options: {
				minimize: true,
			}
		},
		{
			loader: 'postcss-loader'
		},
		{
			loader: 'stylus-loader'
		}
	]
}) : [
	{
		loader: 'style-loader'
	},
	{
		loader: 'css-loader',
	},
	{
		loader: 'postcss-loader'
	},
	{
		loader: 'stylus-loader'
	}
];

var loaderConfig = {
	rules: [
		{
			test: /\.js$/,
			loader: 'eslint-loader',
			enforce: 'pre',
			include: [resolve('src'), resolve('test')],
			options: {
				formatter: require('eslint-friendly-formatter')
			}
		},
		{
			test: /\.js$/,
			exclude: /node_modules/,
			loaders: ['babel-loader']
		},
		{
			test: /\.(png|jpg|jpeg|gif|svg)(\?.*)?$/,
			use: [
				{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'static/img',
						publicPath: '/static/img'
					}
				},
			]
		},

		{
			test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
			loader: 'url-loader',
			options: {
				name: './static/font/[name].[hash:5].[ext]',
				outputPath: 'static/font',
				publicPath: '/static/font',
				limit: 10000
			}
		},
		{
			test: /\.css$/,
			use: styleLoader
		},
		{
			test: /\.styl$/,
			use: styleLoader
		}
	]
};

module.exports = loaderConfig;