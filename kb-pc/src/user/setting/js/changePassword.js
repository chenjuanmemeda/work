require('../../css/user.styl');
require('../css/changePassword.styl');
var $httpAnon = require('../../../common/ajax').$httpAnon;
var $http = require('../../../common/ajax').$http;
var api_type = require('../../../common/ajax').api_type;
var api = require('../../../common/ajax').api;
var util = require('../../../common/util.js');
var httpAnon = new $httpAnon();
var httpUser = new $http();
var cookeis = require('js-cookies');
var notice = require('../../../common/notice/notice.js');
var JSEncrypt = require('../../../common/jsencrypt.js').JSEncrypt;

$(function () {
	var mobile = cookeis.getItem('_EBMB') || '您尚未绑定手机号';
	var operate = '4';
	var encrypt = new JSEncrypt;
	var RSAKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKbwQOJguMK/YjHUofKomXCBrPrLr28GFPTZBXU0FR9ixVzGtZ2l1x+TbP+K3RS6Wcodg5QtKhNwurork4y6W1kCAwEAAQ==';

	var forgetPasswordQuery = {
		operate: operate,
	};

	$('#mobile').text(mobile.replace(/"/g, ''));

	function init() {
		var param = util.getUrlParam('type');
		if (param && param === 'set') {
			$('.guide .item-2').addClass('active');
			$('#step-2').show();
			$('#step-1').hide();
		}
	}

	init();

	/**
	 * step 2
	 */
	var key = util.getUrlParam('key');
	if (util.getUrlParam('type') === 'set' && key) {
		$('#step-1').hide();
		$('#step-2').show();

		$('#changePassword').click(function () {
			var pwd1 = $('#setNewPassword-1').val();
			var pwd2 = $('#setNewPassword-2').val();
			if (pwd1 !== pwd2) return notice('两次密码不一致！请重新输入');
			var query = {
				pwd: $('#oldPassword').val(),
				newPwd: pwd1,
				key: key
			};
			encrypt.setPublicKey(RSAKey);
			var ordPwdEncrypted = encrypt.encrypt(query.pwd);
			query.pwd = ordPwdEncrypted;
			var encrypted = encrypt.encrypt(query.newPwd);
			query.newPwd = encrypted;
			httpUser.post(api_type.user('editPwd4Logined'), query, function (data) {
				if (data.code === 200) {
					$('#mask, #mask #successModal').show();
				} else {
					notice(data.msg);
				}
			});
		});

	} else {
		/**
		 * step 1
		 */
		$('#getStep1Vcode').click(function () {
			util.getvCode({
				operate: operate,
				captchaCode: $('#captchaCode-1').val()
			}, this);
		});

		var url = api.captchCode;
		var capImg = new Image();
		capImg.src = url;

		//图形验证码切换
		$('#captchCodeImg').click(function () {
			url = api.captchCode + '&r=' + ~~(Math.random() * 9999);
			$('#captchCodeImg img').attr('src', url);
		});

	}

	$('#vCode-1').keyup(function (e) {
		if (e.keyCode === 13) {
			nextStep();
		}
	});

	function nextStep() {
		var keyQuery = {
			operate: operate,
			verifyCode: $('#vCode-1').val()
		};

		if (!keyQuery.verifyCode) return notice('请输入手机验证码');

		httpAnon.post(api_type.sms('generateKey'), keyQuery, function (data) {
			if (data.code === 200) {
				var key = data.data.key;
				window.location.href = window.location.href += '?type=set&key=' + key;
			} else {
				notice(data.msg);
			}
		});
	}

	$('#nextStep').click(function () {
		nextStep();
	});
	//
	// $('#setPayPassword').click(function () {
	// 	var query = {
	// 		password: $('#setNewPassword-1').val()
	// 	};
	// 	$('#mask, #mask #successModal').show();
	// });
	//
	// $('#maskWrap, #mask .close-mask').click(function () {
	// 	$('#mask, #mask .modal-wrap').hide();
	// });


	var url = api.captchCode;
	var capImg = new Image();
	capImg.src = url;
	$('#captchCodeImg').append(capImg);

	//图形验证码切换
	$('#captchCodeImg').click(function () {
		url = api.captchCode + '&r=' + ~~(Math.random() * 9999);
		$('#captchCodeImg img').attr('src', url);
	});
});