require('../css/candyShop.styl');
var $http = require('../../common/ajax').$http;
var api_type = require('../../common/ajax').api_type;
var notice = require('../../common/notice/notice.js');
var userInfoInit = require('./leftContainer.js').userInfoInit;
var check = require('../../common/check.js');

$(function () {
	var httpUser = new $http;
	var candyList = [];
	var index = 0;

	function getGoods() {
		httpUser.get(api_type.product('getList4Exchange'), '', function (data) {
			if (data.code === 200) {
				var rows = data.data.resultList;
				candyList = rows;
				if (rows.length > 0) {
					rows.forEach(function (row, i) {
						$('.goods-list').append(
							'<li class="item" data-index="' + i + '">' +
							'<p class="candy-bg">' +
							'<b class="candy-detail">' +
							'<span class="count">' + row.days + '</span>' +
							'<span class="other">天VIP</span>' +
							'</b>' +
							'</p>' +
							'<p class="goods-name">' + row.productName + '</p>' +
							'<p class="need-candy">' + row.candyCount + '糖果</p>' +
							'</li>'
						);
					});
				} else {
					$('.goods-wrap .no-info').show();
				}
			}
		});
	}

	getGoods();

	$('.goods-list').on('click', 'li.item', function (e) {
		index = $(this).data().index;
		var body = $('#mask #goodsDetail');
		var needCandyCount = candyList[index].candyCount;
		var candyCount = $('.candy-count,#head-candyCount').text();
		body.find('.candy-detail .count').text(candyList[index].days);
		body.find('.goods-name').text(candyList[index].productName);
		body.find('.need-candy').text(needCandyCount + '糖果');
		body.find('.goods-statement .info').text(candyList[index].productDescription);
		body.find('#convert').attr('data-productid', candyList[index].productId);
		$('#mask, #mask #goodsDetail').show();
		$('body').addClass('modal-open');
		if (parseInt(candyCount) < needCandyCount) {
			body.find('.need-candy').after('<a class="nocandy" href="./default.html" style="color: red;text-decoration: underline;">糖果数量不足，邀请好友免费赠送 >></a>');
			body.find('#convert').attr('disabled', 'disabled');
			body.find('#convert').addClass('disabled');
		}
	});

	$('#mask').on('click', function (e) {
		var target = $(e.target);
		if (target.attr('id') === 'mask') {
			$('#mask,#mask .modal-wrap').hide();
			$('body').removeClass('modal-open');
			$('#mask #goodsDetail .nocandy').remove();
			$('#convert').removeAttr('disabled');
			$('#convert').removeClass('disabled');
		}
	});


	$('#convert').click(function () {
		var query = {
			productId: $(this).data().productid.toString()
		};
		$('#convert').attr('disabled', 'disabled');
		$('#convert').addClass('disabled');
		$('#convert').text('兑换中...');
		httpUser.post(api_type.product('exchange'), query, function (data) {
				if (data.code === 200) {
					userInfoInit();
					$('#mask #goodsDetail').hide();
					$('#mask #successModal').show();
					$('#mask #successModal .detail').html('获得' + '<span class="red">' + candyList[index].productName + '</span>');
				} else {
					notice(data.msg);
				}
				$('#convert').removeAttr('disabled');
				$('#convert').removeClass('disabled');
				$('#convert').text('立即兑换');
			}
		);
	});


	$('#mask .close-mask').click(function () {
		$('#mask, #mask .modal-wrap').hide();
		$('body').removeClass('modal-open');
	});


});