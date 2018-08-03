require('./telegram.styl');
var $httpAnon = require('../common/ajax').$httpAnon;
var $http = require('../common/ajax').$http;
var api_type = require('../common/ajax').api_type;
var api = require('../common/ajax').api;
var util = require('../common/util.js');
var httpAnon = new $httpAnon();
var httpUser = new $http();
var notice = require('../common/notice/notice');
var self = null;
var _telegram = function () {
	self = this;
	this.query = {
		pageIndex: 1,
		pageSize: 120
	};
};
var maxItems = 40;
_telegram.prototype = {
	getList: function () {

		$('.telegram-list-wrap .more').remove();
		$('.telegram-list-wrap .list').remove();

		$('.telegram-list-wrap').append('<p class="loading">加载中...</p>');

		httpAnon.get(api_type.telegramInfo('getList'), self.query, function (data) {
			if (data.code === 200) {

				$('.telegram-list-wrap .loading, .telegram-list-wrap .not-info').remove();

				var rows = data.data.resultList;

				if (rows.length <= 0) return $('.telegram-list-wrap').append('<p class="not-info">暂无信息！</p>');

				var listWrap = $('.telegram-list-wrap');
				var list = '<ul class="list fix"></ul>';
				list = $(list);

				rows.forEach(function (item, i) {
					if (i < maxItems) {
						list.append('<li class="item" data-link="' + item.telegramUrl + '">' +
							'<p class="left-content">' +
							'<span class="name text-break" title="' + item.telegramName + '">' + item.telegramName + '</span>' +
							'<a class="link text-break">' + item.telegramUrl + '</a>' +
							'</p><p class="icon"></p>' +
							'</li>');
					}
				});

				if (rows.length >= maxItems) {
					listWrap.append('<a href="javascript:;" class="more" data-type="getList">浏览更多 >></a>');
					$('.telegram-list-wrap .more').click(function () {
						var rowCopy = rows.slice(maxItems);
						rowCopy.forEach(function (item, i) {
							listWrap.find('.list').append('<li class="item" data-link="' + item.telegramUrl + '">' +
								'<p class="left-content">' +
								'<span class="name text-break" title="' + item.telegramName + '">' + item.telegramName + '</span>' +
								'<a class="link text-break">' + item.telegramUrl + '</a>' +
								'</p><p class="icon"></p>' +
								'</li>');
						});
						$(this).remove();
					});
				}

				listWrap.prepend(list);
			} else {
				notice(data.msg);
			}
		});
	},
	search: function (key) {
		self.query.keyword = key;
		$('.telegram-list-wrap .more').remove();
		$('.telegram-list-wrap .list').remove();

		$('.telegram-list-wrap').append('<p class="loading">加载中...</p>');

		httpAnon.get(api_type.telegramInfo('getSearchList'), self.query, function (data) {
			if (data.code === 200) {

				$('.telegram-list-wrap .loading, .telegram-list-wrap .not-info').remove();

				var rows = data.data.resultList;

				if (rows.length <= 0) return $('.telegram-list-wrap').append('<p class="not-info">暂无信息！</p>');

				var listWrap = $('.telegram-list-wrap');
				var list = '<ul class="list fix"></ul>';
				list = $(list);

				rows.forEach(function (item, i) {
					if (i < maxItems) {
						list.append('<li class="item" data-link="' + item.telegramUrl + '">' +
							'<p class="left-content">' +
							'<span class="name text-break" title="' + item.telegramName + '">' + item.telegramName + '</span>' +
							'<a class="link">' + item.telegramUrl + '</a>' +
							'</p><p class="icon"></p>' +
							'</li>');
					}
				});

				if (rows.length >= self.query.pageSize) {
					listWrap.append('<a href="javascript:;" class="more" data-type="search">浏览更多 >></a>');
					$('.telegram-list-wrap .more').click(function () {
						var rowCopy = rows.slice(maxItems);
						rowCopy.forEach(function (item, i) {
							listWrap.find('.list').append('<li class="item" data-link="' + item.telegramUrl + '">' +
								'<p class="left-content">' +
								'<span class="name text-break" title="' + item.telegramName + '">' + item.telegramName + '</span>' +
								'<a class="link text-break">' + item.telegramUrl + '</a>' +
								'</p><p class="icon"></p>' +
								'</li>');
						});
						$(this).remove();
					});
				}

				listWrap.prepend(list);
			} else {
				notice(data.msg);
			}
		});
	},
	eventBind: function () {

		$('.telegram-list-wrap').on('click', '.list .item', function () {
			window.open($(this).data().link);
		});

		$('.type-list .type').click(function () {
			$(this).siblings().removeClass('active');
			$(this).addClass('active');
			if ($(this).data().value) {
				self.query.telegramType = $(this).data().value;
			} else {
				delete self.query.telegramType;
			}
			self.getList();
		});
		$('#search').click(function () {
			if (!$('#searchKey').val()) return self.getList();

			$('.type-list .type').removeClass('active');
			$('.type-list .type').eq(0).addClass('active');
			delete self.query.telegramType;

			self.search($('#searchKey').val());
		});

		$('#telegramModalOpen').click(function () {
			if (!util.getTK()) {
				return window.location.href = '../log/sign.html?redirect_url=' + window.location.href;
			}
			$('#mask,#mask #telegramModal').show();
			// $('body').addClass('modal-open');
		});
		$('#mask .close-mask').click(function () {
			$('#mask, #mask .modal-wrap').hide();
			// $('body').removeClass('modal-open');
		});


		$('#mask').click(function (e) {
			if (e.target.id === 'mask') $('#mask, #mask .modal-wrap').hide();
		});

		$('#sumbitproject').click(function () {
			var query = {
				telegramUrl: $('#telegramUrl').val(),
				reason: $('#reason').val()
			};
			httpUser.post(api_type.telegramInfo('recommend'), query, function (data) {
				if (data.code === 200) {
					notice('已成功推荐，感谢您的推荐！');
					$('#mask, #mask .modal-wrap').hide();
				} else {
					return notice(data.msg);
				}
			});
		});

	},
	init: function () {
		$.when(this.getList())
		.then(this.eventBind());

	}
};

$(function () {
	var telegram = new _telegram();


	telegram.init();
});