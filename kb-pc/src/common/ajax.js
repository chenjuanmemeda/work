/**
 * create by cressle.
 * 2018-3-1.
 */
require('./_alert.styl');

var cookies = require('./cookies.js');
var notice = require('./notice/notice.js');


var api = process.env.NODE_ENV === 'production' ? {
	img: 'http://192.168.1.10:7187/api/anon/common/upload.do',
	public: 'http://192.168.1.10:7187/api/anon/',
	private: 'http://192.168.1.10:7187/api/',
	url: 'http://192.168.1.10:7187/',
	captchCode: 'http://192.168.1.10:7187/api/anon/graphCaptcha/get.do?specs=2'
	// img: 'http://www.kuaibi888.com/api/anon/common/upload.do',
	// public: 'http://www.kuaibi888.com/api/anon/',
	// private: 'http://www.kuaibi888.com/api/',
	// url: 'http://www.kuaibi888.com/',
	// captchCode: 'http://www.kuaibi888.com/api/anon/graphCaptcha/get.do?specs=2'
} : {
	img: 'http://192.168.1.10:7187/api/anon/common/upload.do',
	public: 'http://192.168.1.10:7187/api/anon/',
	private: 'http://192.168.1.10:7187/api/',
	url: 'http://192.168.1.10:7187/',
	captchCode: 'http://192.168.1.10:7187/api/anon/graphCaptcha/get.do?specs=2'
};

// var api = {
// 	img: 'http://192.168.1.10:7187/api/anon/common/upload.do',
// 	public: 'http://192.168.1.10:7187/api/anon/',
// 	private: 'http://192.168.1.10:7187/api/',
// 	url: 'http://192.168.1.10:7187/',
// 	captchCode: 'http://192.168.1.10:7187/api/anon/graphCaptcha/get.do?specs=2'
// };

// var api = {
// 	img: 'http://60.191.193.98:7871/api/anon/common/upload.do',
// 	public: 'http://60.191.193.98:7871/api/anon/',
// 	private: 'http://60.191.193.98:7871/api/',
// 	url: 'http://60.191.193.98:7871/',
// 	captchCode: 'http://60.191.193.98:7871/api/anon/graphCaptcha/get.do?specs=2'
// };

function isString(data) {
	if (!data || data === '' || data === undefined) {
		return data = {r: ~~(Math.random() * 9999)};
	} else if (data && typeof data == 'string') {
		return data + '&r=' + ~~(Math.random() * 9999);
	} else if (data && (data instanceof Object || typeof data == 'object')) {
		data.r = ~~(Math.random() * 9999);
		return data;
	}
}

var _alert = function (msg) {
	if ($('.notice').length === 1) return;

	$('body').append('<div class="notice fix">' + msg + '<i class="close-alert">x</i></div');

	$('.notice').on('click', '.close-alert', function () {
		$('.notice').remove();
	});
	setTimeout(function () {
		$('.notice').remove();
	}, 5000);
};

function getTK() {
	return cookies('_EBTK');
}

//对象转换为请求字符串
function queryString(data) {
	var value = '';
	for (var i in data) {
		value += '&' + i + '=' + data[i];
	}
	return value.replace(/&/, '');
}


var api_type = {

	telegramInfo: function (path) {
		return 'telegramInfo/' + path + '.do';
	},
	cookie: function (path) {
		return 'cookie/' + path + '.do';
	},
	trace: function (path) {
		return 'trace/' + path + '.do';
	},
	order: function (path) {
		return 'order/' + path + '.do';
	},
	user: function (path) {
		return 'user/' + path + '.do';
	},
	sms: function (path) {
		return 'sms/' + path + '.do';
	},
	websiteIndex: function (path) {
		return 'websiteIndex/' + path + '.do';
	},
	websiteWhite: function (path) {
		return 'websiteWhite/' + path + '.do';
	},

	userMinutesStatement: function (path) {
		return 'userMinutesStatement/' + path + '.do';
	},
	rechargeTemplate: function (path) {
		return 'rechargeTemplate/' + path + '.do';
	},
	payType: function (path) {
		return 'payType/' + path + '.do';
	},
	userRewardRecord: function (path) {
		return 'userRewardRecord/' + path + '.do';
	},
	recharge: function (path) {
		return 'recharge/' + path + '.do';
	},
	userCandyStatement: function (path) {
		return 'userCandyStatement/' + path + '.do';
	},
	product: function (path) {
		return 'product/' + path + '.do';
	},
	userStatement: function (path) {
		return 'userStatement/' + path + '.do';
	},
	bankCard: function (path) {
		return 'bankCard/' + path + '.do';
	},
	withdraw: function (path) {
		return 'withdraw/' + path + '.do';
	},
	advise: function (path) {
		return 'advise/' + path + '.do';
	},
	candyInfo: function (path) {
		return 'candyInfo/' + path + '.do';
	},
	userNode: function (path) {
		return 'userNode/' + path + '.do';
	},
	node: function (path) {
		return 'node/' + path + '.do';
	},
	luckyDrawRewardRecord: function (path) {
		return 'luckyDrawRewardRecord/' + path + '.do';
	},
	luckyDraw: function (path) {
		return 'luckyDraw/' + path + '.do';
	},
};


var $httpAnon = function () {

};

$httpAnon.prototype.trace = function (obj) {
	obj = obj || {};
	this.post(api_type.trace('add'), obj);
};

$httpAnon.prototype.post = function (path, data, callback, async) {
	$.ajax({
		method: 'post',
		url: api.public + path + '?r=' + ~~(Math.random() * 9999),
		data: isString(data),
		headers: {
			'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'X-Requested-With': 'XMLHttpRequest'
		},
		// async: async,
		success: callback,
		timeout: 30000,
		error: function (err, textStatus) {
			if (err) {
				// _alert('网络出错，请检查您的网络！');
				var el = $('#loginSubmit');
				el.removeAttr('disabled');
				el.removeClass('disabled');
				el.text('登录');
				return false;
			}
		},
		statusCode: {
			400: function () {
				_alert('网络出错！');
			},
			403: function () {
				_alert('网络出错！');
			},
			404: function () {
				_alert('网络出错！');
			},
			405: function () {
				_alert('网络出错！');
			}
		}
	});
};

$httpAnon.prototype.get = function (path, data, callback, async) {
	$.ajax({
		method: 'get',
		url: api.public + path,
		data: isString(data),
		headers: {
			'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'X-Requested-With': 'XMLHttpRequest',
		},
		timeout: 30000,
		error: function (err, textStatus) {
			if (err) {
				// _alert('网络出错，请检查您的网络！');
				return false;
			}
		},
		success: callback
	});
};


function $http(path, data, callback) {

}

$http.prototype.post = function (path, data, callback, async) {
	$.ajax({
		method: 'post',
		url: api.private + path,
		data: isString(data),
		headers: {
			'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'X-Requested-With': 'XMLHttpRequest',
			'token': getTK()
		},
		// async: async,
		success: callback,
		timeout: 30000,
		error: function (err, textStatus) {
			if (err) {
				// _alert('网络出错，请检查您的网络！');
				$('#edit').removeAttr('disabled');
				$('#edit').removeClass('disabled');
				$('#edit').text('保存');
				return false;
			}
		},
	});
};

$http.prototype.get = function (path, data, callback, async) {
	$.ajax({
		method: 'get',
		url: api.private + path,
		data: isString(data),
		headers: {
			'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'X-Requested-With': 'XMLHttpRequest',
			'token': getTK()
		},
		// async: async,
		success: callback,
		timeout: 30000,
		error: function (err, textStatus) {
			if (err) {
				// _alert('网络出错，请检查您的网络！');
				return false;
			}
		},
		statusCode: {
			404: function (e) {
				_alert('网络出错，请检查您的网络！');
				return false;
			}
		}
	});
};

exports.$httpAnon = $httpAnon;
exports.$http = $http;

exports.api_type = api_type;
exports.api = api;


















