var decimal = require('decimal');
var $httpAnon = require('./ajax').$httpAnon;
var $http = require('./ajax').$http;
var api_type = require('./ajax').api_type;
var api = require('./ajax').api;
var httpAnon = new $httpAnon();
var httpUser = new $http();
var cookies = require('js-cookies');
var notice = require('./notice/notice.js');

(function () {

	var img = require('../img/idea.png');
	var pathname = window.location.pathname;
	var redirect_url = window.location.origin + encodeURIComponent(pathname);
	// if (pathname.indexOf('idea') <= 0) {
	// 	$('body').prepend('<a href="../../idea.html?redirect_url=' + redirect_url + '" id="idea"></a>');
	// 	$('body #idea').css({backgroundImage: 'url("' + img + '")'});
	// }

})();

var util = {
	getTK: function () {
		return this.ck.get('_EBTK');
	},
	mul: function (value) {
		var val = new decimal(value);
		var result = val.mul(new decimal(100));
		return result.internal;
	},
	div: function (value) {
		var val = new decimal(value);
		var result = val.div(new decimal(100)).internal;
		result = Number(result).toFixed(2);
		return result;
	},
	otherDiv: function (value) {
		var val = new decimal(value);
		var result = val.div(new decimal(100)).internal;
		result = Number(result);
		return result;
	},
	DateDivide: function (value) {
		var val = new decimal(value);
		var result = val.div(new decimal(1440));
		return parseInt(result);
	},
	getUrlParam: function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return encodeURIComponent(unescape(r[2]));
		}
		return null;
	},
	getvCode: function (obj, el, type) {

		obj = obj || {};
		var element = (el) ? $(el) : arguments[1];
		var elInitText = element.text();
		var interval = null;
		var timeout = 60;

		httpAnon.get(api_type.sms('getVerifyCode'), obj, function (data) {
			if (data.code === 200) {
				element.attr('disabled', 'disabled');
				element.text(timeout + 's');

				interval = setInterval(function () {
					timeout--;
					element.text(timeout + 's');
					if (timeout <= 0) {
						clearInterval(interval);

						interval = 60;
						element.text(elInitText);
						element.removeAttr('disabled');
					}
				}, 1000);
				// notice(data.msg);
			} else {
				notice(data.msg);
			}
		});
	},
	removeCookies: function () {
		this.ck.remove('_EBMB');
		this.ck.remove('_EBTK');
	},
	regExp: {
		/**
		 * 判断是否为手机号
		 * @param value
		 * @returns {boolean}
		 */
		isMobile: function (value) {
			return (/^1[0-9]{10}$/.test(value));
		},
		/**
		 * 判断是否为QQ
		 * @param value
		 * @returns {boolean}
		 */
		isQQ: function (value) {
			return (/^[1-9][0-9]{4,10}$/.test(value));
		},
		isPrice: function (value) {
			return /^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/.test(value);
		},
		/**
		 * 判断是否为钱包地址
		 * @param value
		 * @returns {boolean}
		 */ 
		isWallet: function (value) {
			return /^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/.test(value);
		},
	},
	ck: {
		/**
		 * 获取cookie
		 * @param item
		 * @returns {*}
		 */
		get: function (item) {
			return cookies.get(item);
		},
		/**
		 * 设置cookie
		 * @param obj
		 * @returns {*}
		 */
		set: function (name, value, time) {
			return time ? cookies.set(name, value, {expires:time}) : cookies.set(name,value);
		},
		/**
		 * 移除cookie
		 * @param arr
		 */
		remove: function (arr) {
			var i;
			if (typeof arr === 'string') {
				var key = arr;
				cookies.remove(key);
				return;
			}

			for (i = 0; i < arr.length; i++) {
				cookies.remove(arr[i]);
			}

		}
	},
	getCaptchCodeImg: function (element) {
		var url = api.captchCode;
		var capImg = new Image();
		capImg.src = url;
		$(element).click(function () {
			url = api.captchCode + '&r=' + ~~(Math.random() * 9999);
			$(element).find('img').attr('src', url);
		});
	}
};

module.exports = util;