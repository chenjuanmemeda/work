1;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

function generateTpl(obj = {}) {
	obj.filename = obj.filename + '.html';
	obj.template = obj.template + '.html';
	obj.minify = {
		// collapseWhitespace: true, //是否去掉空格
		removeComments: true
	};
	return new HtmlWebpackPlugin(obj);
}

let log = [
	generateTpl({
		filename: 'log/sign',
		title: '快币-登录',
		template: './src/log/sign',
		chunks: ['vendor', 'sign']
	}),
	generateTpl({
		filename: 'log/register',
		title: '快币-注册',
		template: './src/log/register',
		chunks: ['vendor', 'register']
	}),
	generateTpl({
		filename: 'log/forget_password',
		title: '快币-忘记密码',
		template: './src/log/forget_password',
		chunks: ['vendor', 'forgetPassword']
	})
];

let setting = [
	generateTpl({
		filename: 'user/setting/forgetPassword',
		title: '忘记密码',
		template: './src/user/setting/forgetPassword',
		chunks: ['vendor', 'forgetPassword']
	}),
	generateTpl({
		filename: 'user/setting/bindMobile',
		title: '绑定手机号',
		template: './src/user/setting/bindMobile',
		chunks: ['vendor', 'bindMobile']
	}),
	generateTpl({
		filename: 'user/setting/changePassword',
		title: '修改密码',
		template: './src/user/setting/changePassword',
		chunks: ['vendor', 'changePassword']
	}),
	generateTpl({
		filename: 'user/setting/payPassword',
		title: '设置支付密码',
		template: './src/user/setting/payPassword',
		chunks: ['vendor', 'payPassword']
	}),
];


let tplConfig = {
	plugins: [
		generateTpl({
			filename: 'index',
			title: '快币浏览器',
			template: './src/index',
			chunks: ['vendor', 'index']
		}),
		generateTpl({
			filename: 'overdue',
			title: '快币浏览器',
			template: './src/overdue',
			chunks: ['vendor', 'overdue']
		}),
		generateTpl({
			filename: 'telegram',
			title: '快币浏览器',
			template: './src/telegram',
			chunks: ['vendor', 'telegram']
		}),
		generateTpl({
			filename: 'float_sign',
			title: '关于快币浏览器',
			template: './src/float_sign',
			chunks: ['vendor', 'floatSign']
		}),
		generateTpl({
			filename: 'user/default',
			title: '快币-邀请糖果赢现金',
			template: './src/user/default',
			chunks: ['vendor', 'user']
		}),
		generateTpl({
			filename: 'user/candyShop',
			title: '快币-糖果商城',
			template: './src/user/candyShop',
			chunks: ['vendor', 'candyShop']
		}),
		generateTpl({
			filename: 'user/vip',
			title: '快币-VIP',
			template: './src/user/vip',
			chunks: ['vendor', 'vip']
		}),
		generateTpl({
			filename: 'user/myWallet',
			title: '快币-我的钱包',
			template: './src/user/myWallet',
			chunks: ['vendor', 'myWallet']
		}),
		generateTpl({
			filename: 'user/setting',
			title: '快币-个人设置',
			template: './src/user/setting',
			chunks: ['vendor', 'setting']
		}),
		generateTpl({
			filename: 'candy_news',
			title: '快币-领糖果',
			template: './src/candy_news',
			chunks: ['vendor', 'candyNews']
		}),
		generateTpl({
			filename: 'static/skin',
			title: '皮肤中心',
			template: './src/static/skin',
			chunks: ['']
		}),
		generateTpl({
			filename: 'static/question',
			title: '默认浏览器',
			template: './src/static/question',
			chunks: ['']
		}),
		generateTpl({
			filename: 'idea',
			title: '默认浏览器',
			template: './src/idea',
			chunks: ['vendor', 'idea']
		})
	].concat(setting, log)
};

module.exports = tplConfig;