require('./index.styl');
// require('../src/common/testNetwork');
var $httpAnon = require('../src/common/ajax').$httpAnon;
var $http = require('../src/common/ajax').$http;
var api_type = require('../src/common/ajax').api_type;
var api = require('../src/common/ajax').api;
var cookies = require('js-cookies');
var util = require('./common/util.js');
var httpAnon = new $httpAnon();
var httpUser = new $http();
var JSEncrypt = require('./common/jsencrypt.js').JSEncrypt;
var clipboard = require('clipboard');
var userDetail = require('./userInfo.js');
var notice = require('./common/notice/notice');
var check = require('./common/check.js');
var modal = require('./components/modal/modal');

$(function () {
	modal.show('prize');
	var key = util.getUrlParam('key');
	var forgetPassword = util.getUrlParam('type');
	if (forgetPassword && forgetPassword === 'forget' && key) {
		$('#mask, #mask .form-wrap').hide();
		$('#mask, #mask #forgetPwd-step2').show();
	}

	var UserDetail = new userDetail();

	var encrypt = new JSEncrypt;
	var RSAKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJDo2w9G390N+LXTIcFvASarq+dKX8NtpBxP01pKwcgQN3KYVy3xAF0bAERfB/uBoB6pllWx1OT5o1T4p7jN1GcCAwEAAQ==';

	var traceQuery = {
		name: '快币浏览器首屏加载',
		url: window.location.href,
		urlRef: document.referrer,
		traceType: 1
	};

	function trace(val) {
		traceQuery.traceType = val;
		httpAnon.post(api_type.trace('add'), traceQuery);
	}

	trace(0);

	/**
	 * 获取首页导航
	 */

	var telegram = {'5': [], '6': [], '7': []};

	function websiteIndex() {
		httpAnon.get(api_type.websiteIndex('getList'), '', function (data) {
			$('.information a').remove();
			var res = data.data;
			if (data.code === 200) {
				for (var i = 0; i < res.length; i++) {
					switch (parseInt(res[i].showType)) {
						case 1:
							if (util.getTK()) {
								$('.navigate .item').eq(res[i].websiteIndexId - 1).find('a').attr('data-href', res[i].websiteUrl);
								$('.navigate .item').eq(res[i].websiteIndexId - 1).find('a').attr('href', res[i].websiteUrl);
							} else {
								// $('.navigate .item .img').attr('href', 'javascript:;');
								// $('.navigate .item .img').removeAttr('href');
								$('.navigate .item').eq(res[i].websiteIndexId - 1).find('a').attr('href', '../log/sign.html');
								$('.navigate .item').eq(res[i].websiteIndexId - 1).find('a').removeAttr('target');
							}
							break;
						case 2:
							$('.information .recommend').append('<a class="link" target="_blank" href="' + res[i].websiteUrl + '">' + res[i].websiteName + '</a>');
							break;
						case 3:
							$('.information .best').append('<a class="link" target="_blank" href="' + res[i].websiteUrl + '">' + res[i].websiteName + '</a>');
							break;
						case 4:
							$('.information .hot').append('<a class="link" target="_blank" href="' + res[i].websiteUrl + '">' + res[i].websiteName + '</a>');
							break;
						case 5:
							telegram['5'].push(res[i]);
							break;
						case 6:
							telegram['6'].push(res[i]);
							break;
						case 7:
							telegram['7'].push(res[i]);
							break;
					}
				}

				for (var t in telegram) {
					telegram[t] = telegram[t].slice(0, 6);
					telegram[t].forEach(function (item, i) {
						$('.telegram .info-items[data-index="' + t + '"]').append('<a class="link" target="_blank" href="' + item.websiteUrl + '">' + item.websiteName + '</a>');
					});
				}

				// $('.navigate .item .img').attr('target', '_blank');
			}
		});
	}

	/**
	 * 判断是否有sn
	 */
	function hasSn() {
		var sn = util.getUrlParam('sn');
		if (!sn) return;
		var wrap = $('#mask, #mask #reg-wrap');
		if (!util.ck.get('NO_SnReload')) {
			$('#mask .form-wrap').hide();
			wrap.show();
			wrap.find('#invitation_man').val(sn);
		}
	}

	/**
	 * 上传cookie
	 */
	function cookieGetApi() {
		// httpUser.get(api_type.cookie('get'));
		$.ajax({
			method: 'get',
			url: api.private + api_type.cookie('get'),
			// data: data,
			headers: {
				'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'X-Requested-With': 'XMLHttpRequest',
				'token': util.getTK() || ''
			},
			// async: async,
			// success: callback,
		});
	}

	/**
	 * 初始化
	 */
	function init() {
		websiteIndex();
		var avatar = $('#avatar');
		if (util.getTK()) {
			$('.login-graph-wrap, .methods-wrap').hide();
			$('#avatar').addClass('login');
			$('#avatar').removeClass('logout');
			$('#logout').show();
			$('.userName-wrap').show();
			avatar.className = 'login';
			UserDetail.init(); // 获取用户相关信息
			cookieGetApi();

			$('.float-ads').attr('href', '../user/default.html');

		} else {
			hasSn();
			$('#avatar').addClass('logout');
			$('#logout').hide();
			$('#avatar').removeClass('login');
			$('.time-deadline').hide();
			$('.userName-wrap').hide();
			$('.methods-wrap').show();
			avatar.removeAttr('href');
			//如果cookies 存在graphKeys 显示输入验证码
		}
	}


	/**
	 * 退出
	 * */
	$('#logout').click(function (e) {
		e.stopPropagation();
		$("#mask, #mask .form-wrap").hide();
		httpUser.post(api_type.user('logout'), '', function (data) {
			if (data.code === 200) {
				$.when(util.removeCookies())
				.then(function () {
					window.location.reload(true);
				});
			} else {
				$.when(util.removeCookies())
				.then(function () {
					window.location.reload(true);
				});
			}
		});
	});

	init();

	$('#mask').on('click', function (e) {
		var target = $(e.target);
		if (target.attr('id') === 'mask') {
			$('#mask,#mask .form-wrap').hide();
			$('body').removeClass('modal-open');
		}
		$('p.err').hide();
		$('p.err').text('');
		// $('#captchCodeImg-2 iframe').remove();
	});

	$('#maskWrap').click(function () {
		$('#mask,#mask .form-wrap').hide();
		$('p.err').hide();
		$('p.err').text('');
		$('#captchCodeImg-2 iframe').remove();
	});

	$('.form-wrap').on('click', '.close-mask', function () {
		$('#mask').hide();
		$('p.err').hide();
		$('p.err').text('');
		$('#captchCodeImg-2 iframe').remove();
	});

	/**
	 * + .loginModal-show
	 * 弹出登录窗口
	 */

	$(document).on('click', '.navigate .item', function () {
		if (cookies.getItem('isOVERDUE') && cookies.getItem('isOVERDUE') == 1) {
			return modal.show('overdue');
		}

		if (!cookies.getItem('_EBTK')) {
			return window.location.href = '../log/sign.html';
		}
		var href = $(this).find('a').data().href;

		window.open(href);
	});

	// $('.loginModal-show').click(function () {
	// 	if (!cookies.getItem('_EBTK')) {
	// 		window.location.href = '../log/sign.html';
	// 	}
	// 	return;
	// });


	$("#import").click(function () {
		$('#files').click();
	});

	var env = process.env.NODE_ENV;

	/**
	 * 登录
	 */
	function submitLoading(el, bool) {
		if (bool) {
			$(el).attr('disabled', 'disabled');
			$(el).addClass('disabled');
			$('#loginSubmit').text('登录中...');
		} else {
			$(el).removeAttr('disabled');
			$(el).removeClass('disabled');
			$('#loginSubmit').text('登录');
		}
	}


	$('#loginSubmit').click(function () {
		var loginName = $('#loginName').val();
		var pwd = $('#pwd').val();

		var isVliad = check(['#loginName', '#pwd'],
			['请输入手机号/登录名', '请输入密码']);

		if (!isVliad) return;

		traceQuery.name = 'kuaibi_登录';
		trace(1);

		var loginQuery = {
			loginName: loginName
		};

		encrypt.setPublicKey(RSAKey);
		var encrypted = encrypt.encrypt(pwd);
		loginQuery.pwd = encrypted;
		submitLoading('#loginSubmit', true);
		httpAnon.post(api_type.user('login'), loginQuery, function (data) {
			if (data.code === 200) {
				var res = data.data;
				cookies.setItem('_EBTK', res.token, 99999);
				if (cookies.getItem('graphKeys')) cookies.removeItem('graphKeys');
				if (res.mobile) cookies.setItem('_EBMB', res.mobile, 99999);
				$('#mask,#mask .form-wrap').hide();
				init();
			} else {
				notice(data.msg);
			}
			submitLoading('#loginSubmit', false);
		});

	});

	/**
	 * 注册
	 */
	$('.regModal-show').click(function () {
		$('#mask .form-wrap').hide();
		$('#mask, #mask #reg-wrap').show();
		$('#mask, #mask #reg-wrap #regUserName').focus();
		$('body').addClass('modal-open');
	});

	$('#regSubmit').click(function () {
		traceQuery.name = 'kuaibi_注册按钮点击';
		trace(1);

		var regMobile = $('#regMobile').val();
		var regPWD = $('#regPwd').val();

		var invitationMan = $('#invitation_man').val();

		submitLoading('#regSubmit', true);

		var regQuery = {
			mobile: regMobile,
			pwd: regPWD,
			mobileVerCode: $('#getvCode').val()
		};
		if (invitationMan) regQuery.sn = invitationMan;
		httpAnon.post(api_type.user('add'), regQuery, function (data) {
			if (data.code === 200) {
				notice('注册成功！');
				$('#mask,#mask .form-wrap').hide();
				encrypt.setPublicKey(RSAKey);
				var encrypted = encrypt.encrypt(regQuery.pwd);
				httpAnon.post(api_type.user('login'), {
					loginName: regQuery.mobile,
					pwd: encrypted
				}, function (loginData) {
					var res = loginData.data;
					cookies.setItem('_EBTK', res.token, 99999);
					if (res.mobile) cookies.setItem('_EBMB', res.mobile, 99999);
					cookies.setItem('USERNAME', res.userName, 99999);
					init();
				});
			} else {
				notice(data.msg);
			}
		});
		submitLoading('#regSubmit', false);
	});

	// $('#reg-wrap').on('keyup', '#regMobile', function (e) {
	// 	httpAnon.get(api_type.user('checkMobile4Reg'), 'mobile=' + $('#regMobile').val(), function (data) {
	// 		if (data.data === 1) {
	// 			$('#regMobile').parent().addClass('err');
	// 			$('#noMobile').hide();
	// 			$('#mobileIsTrue').show();
	// 		}
	// 	});
	// });


	$('#regGetvCode').click(function () {
		util.getvCode({
			mobile: $('#regMobile').val(),
			operate: '1',
			captchaCode: $('#CaptchaCode').val()
		}, this);
	});

	$('#forgetGetvCode').click(function () {
		util.getvCode({
			mobile: $('#forgetMobile').val(),
			operate: '3',
			captchaCode: $('#CaptchaCode-2').val()
		}, this);
	});


	$('#getKeyCode').click(function () {
		var query = {
			mobile: $('#forgetMobile').val(),
			operate: '3',
			verifyCode: $('#getvCode-2').val()
		};

		httpAnon.post(api_type.sms('generateKey'), query, function (data) {
			if (data.code === 200) {
				window.location.href = window.location.href += '?type=forget&key=' + data.data.key;
			} else {
				notice(data.msg);
			}
		});
	});

	$('#forgetPasswordSubmit').click(function () {
		var forgetQuery = {
			key: util.getUrlParam('key')
		};
		var newPwd = $('#newPwd').val();

		if (newPwd !== $('#newPwd2').val()) {
			return notice('两次密码不一致，请重新输入');
		}

		encrypt.setPublicKey('MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKbwQOJguMK/YjHUofKomXCBrPrLr28GFPTZBXU0FR9ixVzGtZ2l1x+TbP+K3RS6Wcodg5QtKhNwurork4y6W1kCAwEAAQ==');
		var encryptForgetPassword = encrypt.encrypt(newPwd);
		forgetQuery.newPwd = encryptForgetPassword;
		httpAnon.post(api_type.user('forgetPwd'), forgetQuery, function (data) {
			if (data.code === 200) {
				$('#mask, #mask .form-wrap').hide();
				$('#mask, #mask #login-wrap').show();
				notice(data.msg);
			} else {
				notice(data.msg);
			}
		});
	});

	$('#forgetPwd-step2').on('keyup', 'input', function (e) {
		if (e.keyCode === 13) {
			$('#forgetPasswordSubmit').click();
		}
	});

	var url = api.public + 'graphCaptcha/get.do?specs=2';
	$('#captchCodeImg iframe').attr('src', url);

	$('#captchCodeImg').click(function () {
		url = api.public + 'graphCaptcha/get.do?specs=2';
		$('#captchCodeImg iframe').attr('src', url);
	});

	function getStep2Captcha() {
		var url = api.public + 'graphCaptcha/get.do?specs=2';
		$('#captchCodeImg-2').append('<iframe class="captchCode-img" src="' + url + '" frameborder="0" width="110" height="45"></iframe>');

		$('#captchCodeImg-2').click(function () {
			url = api.public + 'graphCaptcha/get.do?specs=2';
			$('#captchCodeImg-2 iframe').attr('src', url);
		});
	}


	/**
	 * 修改密码
	 */
	$('#forgetPwd').click(function () {
		$('#mask #login-wrap').hide();
		$('#mask #reg-wrap').hide();
		$('#mask #forgetPwd-wrap').show();
		$('body').addClass('modal-open');
		getStep2Captcha();
	});

	$('#forgetPwdSubmit').click(function () {
		var forgetPwdQuery = {
			loginName: $('#forgetPwd_mobile').val(),
			pwd: $('#forgetPwd_pwd'),
			mobileVerCode: $('#forgetPwd_vCode').val()
		};
		httpAnon.post(api_type.user('editPwd'), forgetPwdQuery, function (data) {
			if (data.code === 200) {
				alert(data.msg);
			} else {
				// data.msg;
			}
		}, true);
	});


	/**
	 * 获取网站白名单url数据
	 */
	$('.recharge-item-list').on('click', 'li', function () {
		$('.recharge-item-list li').removeClass('active');
		UserDetail.rechargeTemplateId = $(this).attr('data-recharge');
		$(this).addClass('active');
	});

	$('#sell_man_reg').click(function () {
		$('#mask .form-wrap').hide();
		$('#mask, #mask #invitation-wrap').show();
	});


	$('.pay-type').on('click', '.pay', function () {
		UserDetail.payTypeId = $(this).attr('data-payType');
		$('.pay').removeClass('active');
		$(this).addClass('active');
	});

	var scrollTop = $(window).height();

	$(window).resize(function () {
		scrollTop = $(window).height();
		// if (scrollTop < 900) {
		// 	$('.footer').addClass('float');
		// 	$('body').addClass('pb-50');
		// } else {
		// 	$('.footer').removeClass('float');
		// 	$('body').removeClass('pb-50');
		// }
	});

	$('.navigate .item').hover(function () {

		$(this).addClass('topUp');
	}, function () {
		$(this).removeClass('topUp');
	});

	/**
	 * keyUp
	 */
	//登录
	$('.inp-wrap').on('keyup', '#loginName, #pwd, #loginSubmit', function (e) {
		if (e.keyCode === 13) $('#loginSubmit').click();
	});

	//注册
	$('.inp-wrap').on('keyup', '#regUserName, #regPwd, #regPwd2, #invitation_man, #regSubmit', function (e) {
		if (e.keyCode === 13) $('#regSubmit').click();
	});


	/**
	 * sn 点击复制
	 */
	var clipSn = new clipboard('#clipSn');
	clipSn.on('success', function (e) {
		traceQuery.name = 'kuaibi_复制邀请码点击';
		trace(1);
		e.clearSelection();
	});

	/**
	 * 邀请链接复制
	 * @type {select}
	 */
	var clipSn_invitation_code = new clipboard('#clipSn_invitation_code');
	clipSn_invitation_code.on('success', function (e) {
		traceQuery.name = 'kuaibi_复制邀请链接点击';
		trace(1);
		e.clearSelection();
	});

	$('.form-wrap-body .inp-wrap').on('focus', 'input', function () {
		$(this).parent().removeClass('err');
	});

	//领取赠送时长
	$('#ReceiveTimes').click(function () {
		traceQuery.name = 'kuaibi_领取赠送时长点击';
		trace(1);
		cookieGetApi();
		httpUser.post(api_type.userRewardRecord('receive'), '', function (data) {
			if (data.code === 200) {
				alert('领取成功');
				init();
			} else {
				alert(data.msg);
			}
		});
	});


	$('.vipModalShow').click(function () {
		window.location.href = '../user/vip.html';
	});

	$('.invitationModal').click(function () {
		window.location.href = '../user/default.html';
	});

	setTimeout(function () {
		$('#initWrap').remove();
	}, 500);


	//糖果信息
	httpAnon.get(api_type.candyInfo('getList'), {pageIndex: 1, pageSize: 6}, function (data) {
		if (data.code === 200) {
			var rows = data.data.resultList;

			var desc = '';
			rows.forEach(function (item, i) {
				var index = item.logoImageUrl.indexOf('#');
				var bgc = item.logoImageUrl.substring(index, item.logoImageUrl.length);

				// if (i < 5) return;
				desc = item.description.length > 45 ? item.description.substring(0, 45) + '...' : item.description;
				$('.candyInfo-wrap .candyInfo-list').append(
					'<li class="item">' +
					'<div class="img-wrap" style="background-color: ' + bgc + '"><img class="logo-img" src="' + item.logoImageUrl + '" alt=""></div>' +
					'<div class="info-detail">' +
					'<p class="name">' + item.candyName + '</p>' +
					'<p class="desc text-break">' + item.summary + '</p>' +
					'</div>' +
					'<div class="back-face">' +
					'<p class="candyname">' + item.candyName + '</p>' +
					'<p class="desc" title="' + item.description + '">' + desc + '</p>' +
					'<a class="give-me-coin" target="_blank" href="' + item.registUrl + '">立即领取</a>' +
					'</div>' +
					'</li>'
				);
			});

		}
	});

	var ua = window.navigator.userAgent.toLowerCase();

	if (ua.indexOf('kuaibrowser') > 0) {
		$('body').prepend('<div class="old-browser">尊敬的用户：您使用的快币浏览器版本过低，请下载最新的快币浏览器。<a href="http://www.kuaibi888.org">前往下载</a></div>');
	}


	// httpAnon.get(api_type.telegramInfo('getList'), {pageIndex: 1, pageSize: 30}, function (data) {
	// 	if (data.code === 200) {
	// 		var rows = data.data.resultList;
	// 		rows.forEach(function (item) {
	// 			$('.telegram .info-items').append('<a class="link" target="_blank" href="' + item.telegramUrl + '">' + item.telegramName + '</a>');
	// 		});
	// 	}
	// });


	// 关闭弹窗
	$('.close').click(function() {
		modal.hide('prize');
	});
});
