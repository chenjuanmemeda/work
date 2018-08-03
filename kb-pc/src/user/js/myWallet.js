require('../css/myWallet.styl');
var $httpAnon = require('../../common/ajax.js').$httpAnon;
var $http = require('../../common/ajax.js').$http;
var api_type = require('../../common/ajax.js').api_type;
var httpAnon = new $httpAnon();
var httpUser = new $http();
var util = require('../../common/util.js');
var notice = require('../../common/notice/notice.js');
var JSEncrypt = require('../../common/jsencrypt.js').JSEncrypt;
var pagination = require('../../common/pagination.js');
var page = new pagination();


$(function () {
	var param = util.getUrlParam('type');
	var encrypt = new JSEncrypt;
	var RSAKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKbwQOJguMK/YjHUofKomXCBrPrLr28GFPTZBXU0FR9ixVzGtZ2l1x+TbP+K3RS6Wcodg5QtKhNwurork4y6W1kCAwEAAQ==';
	var bankCardLength = 0;
	if (param && param === 'withdraw') {
		$('.myWallet-wrap').hide();
		$('.bankCardList-wrap').hide();
		$('.withdraw-wrap').show();
	} else if (param && param === 'bankCardList') {
		$('.myWallet-wrap').hide();
		$('.withdraw-wrap').hide();
		$('.bankCardList-wrap').show();
	}

	/**
	 * withdraw
	 */


	function withdrawSubmit() {
		var withdrawObj = {
			bankCardId: $('#withdrawList').val(),
			amount: parseInt(util.mul($('#withdrawAmount').val()))
		};

		if (bankCardLength <= 0) {
			$('#mask, #mask #noBankCard').show();
			$('body').addClass('modal-open');
			return;
		}

		if (!util.regExp.isPrice(withdrawObj.amount)) return notice('金额不合法！');


		encrypt.setPublicKey(RSAKey);
		var encrypted = encrypt.encrypt($('#payPassword').val());
		withdrawObj.payPassword = encrypted;

		httpUser.post(api_type.withdraw('add'), withdrawObj, function (data) {
			if (data.msg === '您还没有设置支付密码') {
				$('#mask, #mask #settingPassword').show();
				$('body').addClass('modal-open');
				return;
			}
			if (data.code === 200) {
				$('#mask, #mask #successModal').show();
				$('body').addClass('modal-open');
			} else {
				notice(data.msg);
			}
		});
	}

	$('#withdrawSubmit').click(function () {
		withdrawSubmit();
	});

	$('#withdrawAmount, #payPassword').keyup(function (e) {
		if (e.keyCode === 13) {
			withdrawSubmit();
		}
	});

	/**
	 * bankCardList
	 */
	var bankListQuery = {
		pageIndex: 1,
		pageSize: 15
	};

	function getBankCardList() {
		httpUser.get(api_type.bankCard('getList'), bankListQuery, function (data) {
			var wrap = $('.bankcard-list tbody');
			if (data.code === 200) {
				wrap.empty();
				var rows = data.data.resultList;
				bankCardLength = rows.length;
				rows.forEach(function (item, i) {
					$('.bankcard-list tbody').append(
						'<tr>' +
						'<td>' + item.payTypeText + '</td>' +
						'<td>' + item.bankCardNumber + '</td>' +
						'<td>' + item.bankCardName + '</td>' +
						'<td>' + '<a class="remove-bankcard" data-id="' + item.bankCardId + '">删除</a>' + '</td>' +
						'</tr>'
					);
					$('#withdrawList').append('<option value="' + item.bankCardId + '">' +
						item.payTypeText + ' - ' +
						item.bankCardNumber + ' - ' +
						item.bankCardName +
						'</option>');
				});
			} else {
				notice(data.msg);
			}
		});
	}


	$('#payType').change(function () {
		if ($(this).val() == 1 || !$(this).val()) {
			$('#bankName-wrap').hide();
		} else {
			$('#bankName-wrap').show();
		}
	});

	$('#saveBank').click(function () {
		var type = $('#payType').val();
		var typeName = parseInt(type) === 1 ? '支付宝' : '银行卡';
		var withdrawObj = {
			payType: type,
			bankCardName: $('#bankCardName').val(),
			bankCardNumber: $('#bankCardNumber').val(),
			bankName: $('#bankName').val()
		};

		if (parseInt(type) === 1) withdrawObj.bankName = '支付宝';

		if (!withdrawObj.payType) return notice('请选择提现类型');
		if (!withdrawObj.bankCardName) return notice('请输入真实姓名');
		if (!withdrawObj.bankCardNumber) return notice('请输入银行卡账号！');
		if (!withdrawObj.bankName) return notice('请输入开户行名称！');

		httpUser.post(api_type.bankCard('add'), withdrawObj, function (data) {
			if (data.code === 200) {
				getBankCardList();
				$('#mask, #mask #saveRechargeModal').show();
				$('body').addClass('modal-open');
			} else {
				notice(data.msg);
			}
		});
	});


	$('.bankcard-list tbody').on('click', '.remove-bankcard', function () {
		var removeTarget = {
			bankCardId: $(this).data().id
		};
		httpUser.post(api_type.bankCard('delete'), removeTarget, function (data) {
			if (data.code === 200) {
				notice(data.msg);
				getBankCardList();
			} else {
				notice(data.msg);
			}
		});
	});

	getBankCardList();


	/**
	 * default
	 */
	$('#withdrawShow').click(function () {
		window.location.assign(window.location.href + '?type=withdraw');
	});

	$('#bankCardListShow').click(function () {
		window.location.assign(window.location.href + '?type=bankCardList');
	});

	var query = {
		pageIndex: 1,
		pageSize: 9
	};

	/**
	 * 获取交易明细
	 */
	function getList(pageIndex) {
		query.pageIndex = pageIndex || query.pageIndex;
		httpUser.get(api_type.userStatement('getList'), query, function (data) {
			if (data.code === 200) {
				var rows = data.data.resultList;

				page.page.pageIndex = data.data.pageIndex;
				page.page.totalPage = data.data.totalPage;
				page.page.totalCount = data.data.totalCount;

				if (rows.length > 0) {
					$('#pagination').show();
					$('.myWallet-log .no-info').hide();
					$('.bunsiness-table tbody').empty();
					rows.forEach(function (item, i) {
						$('.bunsiness-table tbody').append(
							'<tr>' +
							'<td>' + item.note + '</td>' +
							'<td>' + item.timeCreate + '</td>' +
							'<td>' + item.statementTypeText + '</td>' +
							'<td>' + util.div(item.changeAmount) + '</td>' +
							'</tr>'
						);
					});
					page.render();
				} else {
					$('.myWallet-log .no-info').show();
					$('#pagination').hide();
				}
			} else {
				notice(data.msg);
			}
		});
	}

	function getBankCardCount() {
		httpUser.get(api_type.bankCard('getCount'), '', function (data) {
			if (data.code === 200) {
				$('.bankcard-count').text(data.data);
			} else {
				notice(data.msg);
			}
		});
	}

	$('#pagination').on('click', '.page', function (e) {
		e.preventDefault();
		var target = $(e.target).parent();
		var cls = target.attr('class');
		cls = cls.replace(/page/g, '').trim();
		switch (cls) {
			case 'firstPage':
				page.page.pageIndex = 1;
				break;
			case 'PreviousPage':
				if (page.page.pageIndex > 1) {
					page.page.pageIndex--;
				}
				break;
			case 'nextPage':
				if (page.page.pageIndex < page.page.totalPage) {
					page.page.pageIndex++;
				}
				break;
			case 'lastPage':
				page.page.pageIndex = page.page.totalPage;
				break;
		}
		getList(page.page.pageIndex);
	});

	getBankCardCount();
	getList();

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

});