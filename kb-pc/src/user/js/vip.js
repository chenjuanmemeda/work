require('../css/vip.styl');
var $http = require('../../common/ajax').$http;
var api_type = require('../../common/ajax').api_type;
var util = require('../../common/util.js');
var httpUser = new $http();
var JSEncrypt = require('../../common/jsencrypt.js').JSEncrypt;
var userInfoInit = require('./leftContainer.js').userInfoInit;
var notice = require('../../common/notice/notice.js');
var cookies = require('js-cookies');

$(function () {
	var payQuery = {
		rechargeType: '0'
	};
	var encrypt = new JSEncrypt;
	var RSAKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKbwQOJguMK/YjHUofKomXCBrPrLr28GFPTZBXU0FR9ixVzGtZ2l1x+TbP+K3RS6Wcodg5QtKhNwurork4y6W1kCAwEAAQ==';

	var isRecharge = util.getUrlParam('data');

	if (isRecharge && cookies.getItem('SETRECHARGE')) {
		cookies.removeItem('SETRECHARGE');
	}


	if (isRecharge && isRecharge.length > 8 && !cookies.getItem('SETRECHARGE')) {
		cookies.setItem('SETRECHARGE', isRecharge, 99999);
		$('#mask, #mask #successModal').show();
		$('body').addClass('modal-open');
		window.history.replaceState('', '', window.location.pathname);
	}

	function rechargeTemplate() {
		httpUser.get(api_type.rechargeTemplate('list'), '', function (data) {
			if (data.code === 200) {
				var element = $('.vip-wrap .recharge-wrap .recharge-item-list');
				var resultList = data.data;
				// element.empty();
				payQuery.rechargeTemplateId = resultList[0].rechargeTemplateId;
				for (var i = 0; i < resultList.length; i++) {
					element.append(
						'<li class="item" data-recharge="' + resultList[i].rechargeTemplateId + '">' +
						'<p class="head">￥' + util.div(resultList[i].amount) + '</p>' +
						'<p class="body">' + resultList[i].timeCount + '天</p>' +
						'</li>'
					);
				}
				element.find('li').eq(1).addClass('active');
			}
		});
	}

	function getPayType() {
		httpUser.get(api_type.payType('list'), {clientType: 1}, function (data) {
			if (data.code === 200) {
				if ($('.vip-wrap .pay-type .pay').length > 0) $('.vip-wrap .pay-type .pay').remove();

				var res = data.data;

				payQuery.payTypeId = res[0].payTypeId; // 第一个payTypeId;
				for (var i = 0; i < res.length; i++) {
					var typeId = res[i].typeId;
					var name = res[i].payTypeName;
					var cls = (~~typeId == 1) ? 'alipay' : 'wechat';
					$('.vip-wrap .pay-type').append(
						'<label data-paytypeid="' + res[i].payTypeId + '" class="pay ' +
						cls + '"><i class="' + cls + '"></i>' + name + '</label>'
					);
				}
				$('.vip-wrap .pay-type').append(
					'<label data-paytypeid="0" class="pay account"><i class="account"></i>余额</label>'
				);
				$('.vip-wrap .pay-type').find('.pay').eq(0).addClass('active');

			}
		});
	}

	$('.pay-type').on('click', '.pay', function () {
		payQuery.payTypeId = $(this).attr('data-paytypeid');
		$('.pay').removeClass('active');
		$(this).addClass('active');
	});

	$('.recharge-item-list').on('click', 'li', function () {
		$('.recharge-item-list li').removeClass('active');
		payQuery.rechargeTemplateId = $(this).attr('data-recharge');
		$(this).addClass('active');
	});

	/**
	 * pay
	 */
	$('#paySubmit').click(function () {

		if (payQuery.payTypeId == '0') {
			httpUser.get(api_type.user('getDetail'), '', function (data) {
				if (data.code === 200) {
					if (data.data.isExist4PayPwd === 0) {
						$('#mask, #mask .modal-wrap').hide();
						$('#mask, #mask #settingPassword').show();
						$('body').addClass('modal-open');
					} else {
						$('#mask, #mask .modal-wrap').hide();
						var amount = $('.recharge-item-list .item.active .head').text();
						$('#mask #payPasswordInp .modal-body .pay-amount').text(amount);
						$('#mask, #mask #payPasswordInp').show();
						$('body').addClass('modal-open');
					}
				} else {
					notice(data.msg);
				}
			});
		} else {
			payVip();
		}

	});

	function payVip() {
		if (payQuery.payTypeId == '0') {
			var amountQuery = {
				payTypeId: payQuery.payTypeId,
				rechargeType: '0',
				rechargeTemplateId: payQuery.rechargeTemplateId,
			};
			encrypt.setPublicKey(RSAKey);
			var encrypted = encrypt.encrypt($('#payPassword').val());
			amountQuery.payPassword = encrypted;
			httpUser.post(api_type.recharge('addByAmount'), amountQuery, function (data) {
				$('#payPassword').val('');
				if (data.msg === '余额不足') {
					$('.amount-fall').show();
				} else if (data.code === 200) {
					userInfoInit();
					$('#mask .modal-wrap').hide();
					$('#mask, #mask #successModal').show();
					$('body').addClass('modal-open');
				} else {
					notice(data.msg);
				}
			});
		} else {
			httpUser.post(api_type.recharge('add'), payQuery, function (data) {
				if (data.code === 200) {
					var res = data.data.signData;
					var form = $('#rechargeForm');
					form.attr('action', res.formAction);
					form.find('input[name="pid"]').val(res.pid);
					form.find('input[name="money"]').val(util.otherDiv(res.money));
					form.find('input[name="lb"]').val(res.lb);
					form.find('input[name="data"]').val(res.data);
					form.find('input[name="m"]').val(res.m);
					form.find('input[name="url"]').val(res.url);
					// form.find('input[name="bk"]').val(res.bk);
					form.submit();
				} else {
					notice(data.msg);
				}
			});
		}
	}

	$('#confirmPayPassword').click(function () {
		payVip();
	});
	$('#payPassword').keyup(function (e) {
		if (e.keyCode === 13) {
			payVip();
		}
	});


	$('#mask').on('click', function (e) {
		if ($(e.target).attr('id') === 'mask') {
			$('#mask,#mask .modal-wrap').hide();
			$('body').removeClass('modal-open');
		}
	});

	$('#mask .close-mask').click(function () {
		$('#mask, #mask .modal-wrap').hide();
		$('body').removeClass('modal-open');
	});

	rechargeTemplate();
	getPayType();
});