require('../css/sign.styl');
var $httpAnon = require('../../common/ajax').$httpAnon;
var api_type = require('../../common/ajax').api_type;
var util = require('../../common/util.js');
var httpAnon = new $httpAnon();
var notice = require('../../common/notice/notice');
var check = require('../../common/check.js');
var JSEncrypt = require('../../common/jsencrypt.js').JSEncrypt;

$(function () {
	var encrypt = new JSEncrypt;
	var RSAKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJDo2w9G390N+LXTIcFvASarq+dKX8NtpBxP01pKwcgQN3KYVy3xAF0bAERfB/uBoB6pllWx1OT5o1T4p7jN1GcCAwEAAQ==';

	var traceQuery = {
		name: document.title,
		url: window.location.href,
		urlRef: document.referrer,
		traceType: 1
	};

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

	function trace(val) {
		traceQuery.traceType = val;
		httpAnon.post(api_type.trace('add'), traceQuery);
	}

	trace(0);

	function login() {
		var mobile = $('#mobile').val();
		var pwd = $('#pwd').val();

		var isVliad = check(['#mobile', '#pwd'],
			['请输入手机号/登录名', '请输入密码']);

		if (!isVliad) return;

		traceQuery.name = 'kuaibi_登录';
		trace(1);

		var loginQuery = {
			loginName: mobile,
		};

		encrypt.setPublicKey(RSAKey);
		var encrypted = encrypt.encrypt(pwd);
		loginQuery.pwd = encrypted;
		submitLoading('#loginSubmit', true);
		httpAnon.post(api_type.user('login'), loginQuery, function (data) {
			if (data.code === 200) {
				var res = data.data;
				util.ck.set({_EBTK: res.token});

				util.ck.set({_EBMB: res.mobile});

				$('#mask,#mask .form-wrap').hide();

				var redirect_url = '';
				if (util.getUrlParam('redirect_url')) {
					redirect_url = util.getUrlParam('redirect_url');
					redirect_url = decodeURIComponent(redirect_url);
				} else {
					redirect_url = '../../index.html';
				}
				window.location.href = redirect_url;
			} else {
				notice(data.msg);
			}
			submitLoading('#loginSubmit', false);
		});
	}

	$('#loginSubmit').click(function () {
		login();
	});
	$('#mobile,#pwd').keyup(function (e) {
		if (e.keyCode === 13) {
			login();
		}
	});


});