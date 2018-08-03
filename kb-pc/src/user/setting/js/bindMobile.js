require('../../css/user.styl');
require('../css/bindMobile.styl');
var util = require('../../../common/util.js');
var api_type = require('../../../common/ajax.js').api_type;
var api = require('../../../common/ajax.js').api;
var $httpAnon = require('../../../common/ajax.js').$httpAnon;
var $http = require('../../../common/ajax.js').$http;
var httpAnon = new $httpAnon();
var httpUser = new $http();
var cookies = require('js-cookies');
var notice = require('../../../common/notice/notice.js');
$(function () {
	var operate = '2';
	// 安全验证 -> 获取密钥进行下一步操作： -> 正式修改/绑定手机号码
	var bindMobileQuery = {};

	function init() {
		if (cookies.getItem('_EBMB')) {
			$('#mobileText').text(cookies.getItem('_EBMB').replace(/"/g, ''));
			$('#mobileText').show();
		} else {
			$('#mobile').show();
		}
	}

	init();

	$('#getStep1Vcode').click(function () {
		bindMobileQuery = {
			operate: operate,
			captchaCode: $('#captchCode').val().toLowerCase()
		};
		bindMobileQuery.captchaCode.trim();
		if (!bindMobileQuery.captchaCode) return notice('请输入图形验证码');

		util.getvCode(bindMobileQuery, this, 'anon');
	});

	//获取图形验证码


	$('#nextStep').click(function () {

		var keyQuery = {
			operate: operate,
			verifyCode: $('#vCode').val()
		};
		if (!keyQuery.verifyCode) return notice('请输入手机验证码');

		httpAnon.post(api_type.sms('generateKey'), keyQuery, function (data) {
			if (data.code === 200) {
				var key = data.data.key;
				// cookies.setItem('_EBMB', data.data.mobile, 99999);
				window.location.href = window.location.href += '?type=set&key=' + key;
			} else {
				notice(data.msg);
			}
		});
	});

	/**
	 * step 2
	 */
	var key = util.getUrlParam('key');
	if (util.getUrlParam('type') === 'set' && key) {
		$('.guide .guide-item.item-2').addClass('active');
		$('#step-1').hide();
		$('#step-2').show();

		$('#getStep2Vcode').click(function () {
			bindMobileQuery = {
				mobile: $('#newMobile').val(),
				operate: 6,
				captchaCode: $('#captchCode-2').val().toLowerCase()
			};
			bindMobileQuery.captchaCode.trim();
			util.getvCode(bindMobileQuery, this, 'anon');
			// if (!bindMobileQuery.captchaCode) return notice('请输入图形验证码');
		});

		var url2 = api.captchCode;

		var capImg2 = new Image();
		capImg2.src = url2;

		$('#captchCodeImg-2').append(capImg2);

		//图形验证码切换
		$('#captchCodeImg-2').click(function () {
			url2 = api.captchCode + '&r=' + ~~(Math.random() * 9999);
			$('#captchCodeImg-2 img').attr('src', url2);
		});


		$('#changeMobile').click(function () {
			var changeMobileQuery = {
				key: key,
				newMobile: $('#newMobile').val(),
				verifyCode: $('#vCode-2').val()
			};
			httpUser.post(api_type.user('editMobile'), changeMobileQuery, function (data) {
				if (data.code === 200) {
					$('#mask, #mask #successModal').show();
					$('body').addClass('modal-open');
				} else {
					notice(data.msg);
				}
			});
		});
	} else {

		/**
		 * step 1
		 */
		var url = api.captchCode;
		var capImg = new Image();
		capImg.src = url;
		$('#captchCodeImg').append(capImg);

		//图形验证码切换
		$('#captchCodeImg').click(function () {
			url = api.captchCode + '&r=' + ~~(Math.random() * 9999);
			$('#captchCodeImg img').attr('src', url);
		});

	}

	$('#mask').on('click', function (e) {
		if ($(e.target).attr('id') === 'mask') {
			$('#mask,#mask .modal-wrap').hide();
			$('body').removeClass('modal-open');
		}
	});

});