require('../css/forgetPassword.styl');
var $httpAnon = require('../../common/ajax').$httpAnon;
var api_type = require('../../common/ajax').api_type;
var api = require('../../common/ajax').api;
var util = require('../../common/util.js');
var httpAnon = new $httpAnon();
var notice = require('../../common/notice/notice');
var check = require('../../common/check.js');
var JSEncrypt = require('../../common/jsencrypt.js').JSEncrypt;
require('../../common/_alert.styl');

var _alert = function (msg) {
	if ($('.notice').length === 1) return;

	$('body').append('<div class="notice fix">' + msg + '<i class="close-alert">x</i></div');

	$('.notice').on('click', '.close-alert', function () {
		$('.notice').remove();
	});
};

$(function () {
	var checkForms = [
		'#newPwd',
		'#newPwd2'
	];

	var checkFormesGetkey = [
		'#fpMobile',
		'#CaptchaCode',
		'#getvCode',
	];

	var encrypt = new JSEncrypt;

	if (util.getUrlParam('key')) {
		$('#step-1').hide();
		$('#step-2').show();
	}

	function forgetPassword() {
		var isValid = check(checkForms, ['请输入密码', '请再次输入密码']);
		if (!isValid) return;


		var forgetQuery = {
			key: util.getUrlParam('key')
		};
		var newPwd = $('#newPwd').val();

		encrypt.setPublicKey('MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKbwQOJguMK/YjHUofKomXCBrPrLr28GFPTZBXU0FR9ixVzGtZ2l1x+TbP+K3RS6Wcodg5QtKhNwurork4y6W1kCAwEAAQ==');
		var encryptForgetPassword = encrypt.encrypt(newPwd);
		forgetQuery.newPwd = encryptForgetPassword;
		httpAnon.post(api_type.user('forgetPwd'), forgetQuery, function (data) {
			if (data.code === 200) {
				if (data.data) {
					_alert('密码重置成功，请重新登录');
					setTimeout(function () {
						window.location.href = '../log/sign.html';
					}, 3000);
				} else {
					notice(data.msg);
				}
			} else {
				notice(data.msg);
			}
		});
	}

	function getKey() {
		var isValid = check(checkFormesGetkey, ['请输入手机号码', '请输入图形验证码', '请输入短信验证码']);
		if (!isValid) return;

		if (!util.regExp.isMobile($('#fpMobile').val())) return notice('请输入11位正确的手机号码');

		var keyQuery = {
			mobile: $('#fpMobile').val(),
			operate: 3,
			verifyCode: $('#getvCode').val()
		};

		httpAnon.post(api_type.sms('generateKey'), keyQuery, function (data) {
			if (data.code === 200) {
				window.location.href += '?key=' + data.data.key;
			} else {
				notice(data.msg);
			}
		});
	}

	$('#getKeyCode').click(function () {
		getKey();
	});

	$(checkForms.join(', ')).keyup(function (e) {
		if (e.keyCode === 13) {
			forgetPassword();
		}
	});

	$(checkFormesGetkey.join(', ')).keyup(function (e) {
		if (e.keyCode === 13) {
			getKey();
		}
	});

	$('#forgetPasswordSubmit').click(function () {
		forgetPassword();
	});


	$('#forgetPasswordGetvCode').click(function () {
		var isValid = check(['#fpMobile', '#CaptchaCode',], ['请输入手机号码', '请输入图形验证码']);
		if (!isValid) return;
		util.getvCode({
			mobile: $('#fpMobile').val(),
			operate: '3',
			captchaCode: $('#CaptchaCode').val()
		}, this);
	});


	var url = api.captchCode;

	var capImg = new Image();
	capImg.src = url;

	$('#captchCodeImg').append(capImg);

	$('#captchCodeImg').click(function () {
		url = api.captchCode + '&r=' + ~~(Math.random() * 9999);
		$('#captchCodeImg img').attr('src', url);
	});
});
