require('./candyNews.styl');
var $httpAnon = require('../common/ajax').$httpAnon;
var $http = require('../common/ajax').$http;
var api_type = require('../common/ajax').api_type;
var api = require('../common/ajax').api;
var util = require('../common/util.js');
var httpAnon = new $httpAnon();
var httpUser = new $http();
var notice = require('../common/notice/notice.js');
var check = require('../common/check');

$(function () {
	var query = {
		pageIndex: 1,
		pageSize: 20
	};

	if (util.getTK()) {
		$('.IHaveGoodProject .btn').addClass('more');
	} else {
		var url =
			$('.IHaveGoodProject .btn').attr('href', '../log/sign.html?redirect_url=' + encodeURIComponent(window.location.href));
	}

	function search() {
		httpAnon.get(api_type.candyInfo('getList'), query, function (data) {
			if (data.code === 200) {
				var rows = data.data.resultList;

				$('.news-wrap').empty();

				if (rows.length > 0) {
					var desc = '';
					rows.forEach(function (item, i) {
						var index = item.logoImageUrl.indexOf('#');
						var bgc = item.logoImageUrl.substring(index, item.logoImageUrl.length);


						desc = item.description.length > 165 ? item.description.substring(0, 165) + '...' : item.description;

						$('.news-wrap').append('<div class="news-item">' +
							'<div class="img-wrap" style="background-color:' + bgc + '"><img src="' + item.logoImageUrl + '" alt=""></div>' +
							'<div class="info-wrap"><p class="wp-tit fix">' + item.candyName + '<a href="' + item.registUrl + '" class="gotocoin" target="_blank">前往领取</a></p>' +
							'<p class="summary">' + item.summary + '</p>' +
							'<p class="desc" title="' + item.description + '">' + desc + '</p>' +
							'</div>' +
							'</div>');
					});
				} else {
					$('.news-wrap').append('<p class="no-info">暂无内容</p>');
				}
			}
		});
	}

	search();

	$('.radio-control').click(function () {
		query = {
			pageIndex: 1,
			pageSize: 20
		};

		$('.radio-control .radio').removeClass('active');
		$(this).find('.radio').addClass('active');
		var type = $(this).data().queryType;
		switch (type) {
			case 'online':
				query.isOnline = '0';
				break;
			case 'news':
				query.isNew = 1;
				break;
			case 'hot':
				query.isHot = 1;
				break;
		}

		search();
	});

	$('.IHaveGoodProject .more').click(function () {
		$('#mask,#mask #sellproject').show();
		$('body').addClass('modal-open');
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

	var checkForms = ['#description', '#registUrl'];

	$('#sumbitproject').click(function () {
		var isValid = check(checkForms, ['请输入项目介绍或推荐理由', '请输入链接地址']);
		if (!isValid) return;

		var submitQuery = {
			description: $('#description').val(),
			registUrl: $('#registUrl').val()
		};
		httpUser.post(api_type.candyInfo('addByRecommend'), submitQuery, function (data) {
			if (data.code === 200) {
				if (data.data) {
					$('#mask,#mask #sellproject').hide();
					$('#mask,#mask #successModal').show();
				}
			} else {
				notice(data.msg);
			}
		});
	});
});