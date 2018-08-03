require('../css/register.styl');
var $httpAnon = require('../../common/ajax').$httpAnon;
var api_type = require('../../common/ajax').api_type;
var api = require('../../common/ajax').api;
var util = require('../../common/util.js');
var httpAnon = new $httpAnon();
var notice = require('../../common/notice/notice');
var check = require('../../common/check.js');
var JSEncrypt = require('../../common/jsencrypt.js').JSEncrypt;

$(function () {
	var checkForms = [
		'#regMobile',
		'#CaptchaCode',
		'#getvCode',
		'#regPwd',
		'#regPwd2'
	];

	if (util.getUrlParam('sn')) $('#invitation_man').val(util.getUrlParam('sn'));

	var encrypt = new JSEncrypt;
	var RSAKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJDo2w9G390N+LXTIcFvASarq+dKX8NtpBxP01pKwcgQN3KYVy3xAF0bAERfB/uBoB6pllWx1OT5o1T4p7jN1GcCAwEAAQ==';


	var traceQuery = {
		name: document.title,
		url: window.location.href,
		urlRef: document.referrer,
		traceType: 1
	};

	function trace(val) {
		traceQuery.traceType = val;
		httpAnon.post(api_type.trace('add'), traceQuery);
	}

	trace(0);

	function submitLoading(el, bool) {
		if (bool) {
			$(el).attr('disabled', 'disabled');
			$(el).addClass('disabled');
			$('#loginSubmit').text('加载中...');
		} else {
			$(el).removeAttr('disabled');
			$(el).removeClass('disabled');
			$('#loginSubmit').text('注册');
		}
	}

	function register() {
		var isValid = check(checkForms,
			['请输入手机号码', '请输入图形验证码', '请输入短信验证码', '请输入密码', '请再次输入密码']);

		if (!isValid) return;

		if ($('#regPwd').val() !== $('#regPwd2').val()){
			return notice('两次密码不一致，请重新输入！')
		}

		traceQuery.name = 'kuaibi_注册';
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
					util.ck.set({'_EBTK': res.token});
					util.ck.set({'_EBMB': res.mobile});
					util.ck.set({'USERNAME': res.userName});
					window.location.href = '../user/default.html';
				});
			} else {
				notice(data.msg);
			}
		});
		submitLoading('#regSubmit', false);
	}

	$(checkForms.join(', ')).keyup(function (e) {
		if (e.keyCode === 13) {
			register();
		}
	});

	$('#regSubmit').click(function () {
		register();
	});

	$('.getvCode-btn').click(function () {
		var isValid = check(['#regMobile', '#CaptchaCode',], ['请输入手机号码', '请输入图形验证码']);
		if (!isValid) return;
		util.getvCode({
			mobile: $('#regMobile').val(),
			operate: '1',
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