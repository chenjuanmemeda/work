require('../css/myPrize.styl');
var $httpAnon = require('../../common/ajax').$httpAnon;
var $http = require('../../common/ajax').$http;
var api_type = require('../../common/ajax').api_type;
var api = require('../../common/ajax').api;
var util = require('../../common/util.js');
var httpAnon = new $httpAnon();
var httpUser = new $http();
var notice = require('../../common/notice/notice');
var modal = require('../../components/modal/modal');

var self = null;
var _myPrize = function () {
	self = this;
	this.walletAddress = null;
};
var maxItems = 40;
_myPrize.prototype = {
	// 获取用户的中奖纪录
	getList: function () {
		httpUser.get(api_type.luckyDrawRewardRecord('getList'), '', function (data) {
			if (data.code === 200) {
				console.log(data);
				data.data.resultList.forEach(function (item, i) {
					$('.winRecord').append(
						'<tr>'+
							'<td>VIP一个月</td>'+
                        	'<td class="time">2018-12-12  14:23:12</td>'+
                   		'</tr>'+
						'<tr>'+
							'<td>VIP一个月</td>'+
							'<td class="time">2018-12-12  14:23:12</td>'+
						'</tr>'
					);
				});
			}
		});
	},
	// 获取用户的duih纪录
	getList: function () {
		httpUser.get(api_type.luckyDrawRewardRecord('getList'), '', function (data) {
			if (data.code === 200) {
				console.log(data);
				data.data.resultList.forEach(function (item, i) {
					$('.winRecord').append(
						'<tr>'+
							'<td>VIP一个月</td>'+
                        	'<td class="time">2018-12-12  14:23:12</td>'+
                   		'</tr>'+
						'<tr>'+
							'<td>VIP一个月</td>'+
							'<td class="time">2018-12-12  14:23:12</td>'+
						'</tr>'
					);
				});
			}
		});
	},
	eventBind: function () {
		// 奖品记录和领取记录选中状态切换
        $('#recordList').on('click','.item',function() {
            $('.search-form-list').hide();
			$('.search-form-list[data-form-index="' + $(this).data().switchIndex + '"]').show();

			$('#recordList .item').removeClass('active');
			$('.search-form-list .item a').removeClass('active');

			$(this).addClass('active');
		});
		
		// 验证钱包地址
		$('#walletCheck').on('click','',function() {
			self.walletAddress = $('#walletAddress').val();
			if (!util.regExp.isQQ($('#walletAddress').val())){
				$('.error').show();
			}else{
				$('.error').hide();
				modal.hide('walletAddress');
				$('.address').text(self.walletAddress);
			}
		});

		// 点击中奖纪录和领取纪录的active
		$('.ling').on('click','',function () {
			$('.ling').removeClass('active');
			$(this).addClass('active');
		});
		$('.close-record').on('click','',function () {
			$('.ling').removeClass('active');
		});
    },
	
	init: function () {
		$.when(this.eventBind())
		.then(this.getList())
	}
};

$(function () {
	var myPrize = new _myPrize();


	myPrize.init();
});