require('../css/def.styl');
var $httpAnon = require('../../common/ajax').$httpAnon;
var $http = require('../../common/ajax').$http;
var api_type = require('../../common/ajax').api_type;
var api = require('../../common/ajax').api;
var cookies = require('js-cookies');
var util = require('../../common/util.js');
var httpAnon = new $httpAnon();
var httpUser = new $http();
var clipboard = require('clipboard');
var userDetail = require('../../userInfo.js');
var notice = require('../../common/notice/notice.js');
var pagination = require('../../common/pagination.js');
var page = new pagination();

$(function () {
	var UserDetail = new userDetail();
	var query = {
		pageIndex: 1,
		pageSize: 8
	};
	var traceQuery = {
		name: $('title').text() || '快币浏览器',
		url: window.location.href,
		urlRef: document.referrer,
		traceType: 1
	};

	function trace(val) {
		traceQuery.traceType = val;
		httpAnon.post(api_type.trace('add'), traceQuery);
	}

	function isGreen(value) {
		return value < 0 ? 'green' : '';
	}

	function search(pageIndex) {
		query.pageIndex = pageIndex || 1;
		httpUser.get(api_type.userCandyStatement('getList'), query, function (data) {
			if (data.code === 200) {
				var rows = data.data.resultList;
				$('#candyLog .modal-body .candy-log-list').empty();
				if (rows.length <= 0) {
					$('#candyLog .modal-body').append('<div class="no-info">暂无信息</div>');
				} else {

					page.page.pageIndex = data.data.pageIndex;
					page.page.totalPage = data.data.totalPage;
					page.page.totalCount = data.data.totalCount;


					rows.forEach(function (item, i) {
						$('#candyLog .modal-body .candy-log-list').append(
							'<li class="log">' +
							'<p class="left-content">' +
							'<span class="info">' + item.note + '</span>' +
							'<span class="date">' + item.timeCreate + '</span>' +
							'</p>' +
							'<p class="right-content"><span class="candy-count ' + isGreen(item.changeCount) + '">' + item.changeCount + '</span></p>' +
							'</li>'
						);
					});
					page.render();
				}

			} else {
				notice(data.msg);
			}
		});
	}


	function init() {
		if (cookies.getItem('_EBTK')) {
			search();
		} else {
			// window.location.assign('../../index.html');
		}
	}

	init();

	/**
	 * 上传cookie
	 */
	function cookieGetApi() {
		// httpUser.get(api_type.cookie('get'));
		$.ajax({
			method: 'get',
			url: api.private + api_type.cookie('get'),
			data: {r: ~~(Math.random() * 999)},
			headers: {
				'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'X-Requested-With': 'XMLHttpRequest',
				'token': cookies.getItem('_EBTK') || ''
			},
		});
	}

	/**
	 * 推荐链接
	 */
	function sn_recommendUrl() {
		httpUser.get(api_type.user('getRecommendSn'), '', function (data) {
				if (data.code === 200) {
					$('#sn').text(data.data);
					$('#clipSn').attr('data-clipboard-text', data.data);
				}
			}
		);

		httpUser.get(api_type.user('getRecommendUrl'), '', function (data) {
			if (data.code === 200) {
				$('#invitation_code').text(data.data);
				$('#clipSn_invitation_code').attr('data-clipboard-text', data.data);
			}
		});
	}

	sn_recommendUrl();
	/**
	 * sn 点击复制
	 */
	var clipSn = new clipboard('#clipSn');
	clipSn.on('success', function (e) {

		notice('复制成功！');

		traceQuery.name = 'kuaibi_复制邀请码点击';
		trace(1);
		e.clearSelection();
	});

	/**
	 * 邀请链接复制
	 * @type {select}
	 */
	var clipSn_invitation_code = new clipboard('#clipSn_invitation_code');
	clipSn_invitation_code.on('success', function (e) {
		notice('复制成功！');
		traceQuery.name = 'kuaibi_复制邀请链接点击';
		trace(1);
		e.clearSelection();
	});

	$('.form-wrap-body .inp-wrap').on('focus', 'input', function () {
		$(this).parent().removeClass('err');
	});


	//领取赠送时长
	$('#ReceiveTimes').click(function () {
		traceQuery.name = 'kuaibi_领取赠送时长点击';
		trace(1);
		cookieGetApi();
		httpUser.post(api_type.userRewardRecord('receive'), '', function (data) {
			if (data.code === 200) {
				alert('领取成功');
				init();
			} else {
				alert(data.msg);
			}
		});
	});

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
		search(page.page.pageIndex);
	});

	/**
	 * 打开糖果明细
	 */
	$('.candyLog-btn').click(function () {
		$('#mask, #mask #candyLog').show();
	});

	$('#maskWrap, #mask .close-mask').click(function () {
		$('#mask, #mask .modal-wrap').hide();
	});

	$('#rc').click(function () {
		util.removeCookies();
	});


});
