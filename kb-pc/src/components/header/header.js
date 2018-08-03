require('./header.styl');
var util = require('../../common/util');
var $http = require('../../common/ajax').$http;
var $httpAnon = require('../../common/ajax').$httpAnon;
var httpAnon = new $httpAnon();
var api_type = require('../../common/ajax').api_type;
var httpUser = new $http();
var defaultAvatar_man = require('../../img/man-1.png');
var defaultAvatar = require('../../img/avatar-login.png');
var candyCount = 0;
var modal = require('../../components/modal/modal');
var notice = require('../../common/notice/notice');


$(function () {
	var avatar = $('#avatar');

	function getLastTime() {
		httpUser.get(api_type.user('getLastTime'), '', function (data) {
			console.log(data);
		});
	}

	function getDetail() {
		util.ck.remove('isOVERDUE')
		httpUser.get(api_type.user('getDetail'), '', function (data) {
			if (data.code === 200) {
				var res = data.data;
				var rechargeTime = data.data.rechargeTime;
				var now = new Date().getTime();
				var endTime = new Date(rechargeTime.replace(/^-/g, '/')).getTime();

				if (now > endTime) {
					util.ck.set('isOVERDUE',1)
					// $('.time-deadline').show();
					$('.vipTime .time').text('您的VIP已过期');
					$('.data-wrap .vipTime').text('您的VIP已过期');
					$('a.add_vip').css({backgroundColor: 'red'});
					$('.userName-wrap #header-vip-time').text('您的VIP已过期');
					$('.userName-wrap .xufei').css({backgroundColor: 'red'});

					$('.navigate .item').addClass('overdue-open');


					$('.navigate .item .img').removeAttr('href');

					// $('.navigate').on('click', '.item.overdue-open', function () {
					//
					// 	modal.show('overdue');
					// 	return false;
					// });

					$('.candyInfo-list').on('click', '.item .back-face .give-me-coin', function () {
						modal.show('overdue');
						return false;
					});

					if (!util.ck.get('overdue')) modal.show('overdue');

					util.ck.set({'overdue': '11'});
				} else {
					// $('.time-deadline').hide();
					var index = rechargeTime.indexOf(' ');
					var userCenterrechargeTime = rechargeTime.substring(0, index);
					var lotDay = parseInt((endTime - now) / (1000 * 60 * 60 * 24));
					$('#avatar .vipTime .time').text('VIP将于 ' + lotDay + ' 天后到期');
					$('.userName-wrap #header-vip-time').text('VIP将于 ' + lotDay + ' 天后到期');
					util.ck.remove(['overdue']);

				}

				$('.userName-wrap .xufei').click(function () {
					window.location.href = '../../user/vip.html';
				});

				var userName = data.data.userName;
				if (!userName || userName === 'undefined') userName = '获取用户名失败， 请退出重新登录';

				$('.userName-wrap #header-userName').text('你好，' + userName);

				$('.user-info-header .head .left .userName').text(userName);

				if (!rechargeTime || rechargeTime == 'undefined') rechargeTime = '获取到期时长失败！';

				if ($('#nickname').length > 0) $('#nickname').val(res.userName);

				if (res.isExist4PayPwd === 0) {
					$('#payPasswordText').text('支付密码设置成功');
				}

				if (res.userImageUrl) {
					$('.avatar-block .avatar').attr('src', res.userImageUrl);
					$('.user-info-wrap #userAvatar img').attr('src', res.userImageUrl);
					$('#avatar').css({'background-image': 'url(' + res.userImageUrl + ')'});
				} else {
					$('.avatar-block .avatar').attr('src', defaultAvatar_man);
					$('.user-info-wrap #userAvatar img').attr('src', defaultAvatar_man);
					$('#avatar').css({'background-image': 'url(' + defaultAvatar + ')'});
				}


				if (res.sex === 0) {
					$('.radio-lab').show();
				} else {
					$('#sexText').text(res.sexText);
				}
			}
		});
	}

	function overDueModal() {
		$('body').append('<div class="cjdl-modal" data-name="overdue" style="display: none">\n' +
			'    <div class="modal-wrap">\n' +
			'        <div class="modal-body overdue-body">\n' +
			'            <i class="close-modal">x</i>\n' +
			'            <div class="due"></div>\n' +
			'            <p class="tit-1">您的VIP已到期</p>\n' +
			'            <p class="tit-2">充值/邀请好友即可重新获得VIP特权</p>\n' +
			'            <div class="btn-wp">\n' +
			'                <a class="btn" href="../../user/vip.html" style="background-color: #fff;color: #8cc152;">立即充值</a>\n' +
			'                <a class="btn" href="../../user/default.html">邀请好友</a>\n' +
			'            </div>\n' +
			'        </div>\n' +
			'    </div>\n' +
			'</div>');
	}


	if (!util.getTK()) {
		$('#avatar').addClass('logout');
		$('#logout').hide();
		$('#avatar').removeClass('login');
		$('.time-deadline').hide();
		$('.userName-wrap').hide();
		$('.methods-wrap').show();
	} else {
		$('.login-graph-wrap, .methods-wrap').hide();
		$('#avatar').addClass('login');
		$('#avatar').removeClass('logout');
		$('#logout').show();
		$('.userName-wrap').show();
		avatar.className = 'login';
		getDetail();
		// getLastTime();
		overDueModal();

		/*
	切换线路
 */


		/*
		点击切换线路
		 */


		$(document).on('click', '.node-btn', function (e) {
			var SWTICHCOUNT = util.ck.get('SWTICHCOUNT') || 0;
			var msParentElement = $(this).parent();

			if ($(this).attr('disabled')) return;
			// cookies({SWTICHCOUNT: (SWTICHCOUNT + 1)}, {expires: 8});
			// util.ck.set({SWTICHCOUNT: (SWTICHCOUNT + 1)});

			var nodeId = $(this).data().nodeId;
			var selfNode = $(this);

			$('.node-btn').text('更换');
			$('.node-btn').attr('disabled', 'disabled');
			$('.node-btn').removeClass('disabled');

			selfNode.addClass('disabled');

			selfNode.text('正在切换...');

			httpUser.post(api_type.userNode('changeNode4Web'), {clientType: 1, nodeId: nodeId}, function (data) {
				if (data.code === 200) {
					setTimeout(function () {

						msParentElement.parent().find('span.ms').remove();

						selfNode.text('已连接');

						runTestNetwork(msParentElement);
						httpUser.get(api_type.cookie('remove'), '', function (data) {
							if (data.code = 200) {

								setTimeout(function () {
									httpUser.get(api_type.cookie('get'));
									// console.log(cookies('SWTICHCOUNT'));
								}, 2000);
								$('.node-btn').removeAttr('disabled');
							}
						});

						$('#node-error-text').hide();

						notice(data.msg);
					}, 1200);
				} else {

					setTimeout(function () {
						$('.node-btn').removeClass('disabled');
						$('.node-btn').removeAttr('disabled');
						$('.node-btn').text('连接节点');
						notice(data.msg);
					}, 1200);
				}
			});
		});

	}


	window.addEventListener('storage', function (e) {
		var tk = util.getTK();
		if (tk) {
			$('.login-graph-wrap, .methods-wrap').hide();
			$('#avatar').addClass('login');
			$('#avatar').removeClass('logout');
			$('#logout').show();
			$('.userName-wrap').show();
			avatar.className = 'login';
			getDetail();
		}
		localStorage.removeItem('floatsign');
	}, true);


	//移动到头像 查找节点信息
	var getNode_timeOut = null;
	var hasGetNode = true;

	$('#avatar').hover(function (e) {
		setTimeout(function () {
			hasGetNode = true;
		}, 1000);
		if (hasGetNode) {
			httpUser.get(api_type.userNode('getSimple'), {clientType: 1}, function (data) {
				if (data.code === 200) {
					var activeNode = data.data;

					if (!data.data.nodeId) {
						$('#node-error-text').show();
					}

					httpAnon.get(api_type.node('getSimpleList'), '', function (data) {
						if (data.code === 200) {

							$('.node-list').empty();

							var rows = data.data.resultList;
							rows.forEach(function (item, i) {
								$('.node-list').append('<li class="node fix">' +
									'<p class="left-content">' +
									'<i class="no">' + (i + 1) + '</i>' +
									'<span class="name">' + item.nodeName + '</span>' +
									'</p>' +
									'<a class="node-btn" data-node-id="' + item.nodeId + '">更换</a>' +
									'</li>');
							});

							$('.node-btn[data-node-id="' + activeNode.nodeId + '"]').text('已连接')
							.attr('disabled', 'disabled')
							.addClass('disabled');
							runTestNetwork($('.node-btn[data-node-id="' + activeNode.nodeId + '"]').parent());

						}
					});
				}
			});

			hasGetNode = false;
		}
		e.stopPropagation();
	}, function () {
		return;
	});


	function runTestNetwork(el) {
		var start = new Date().getTime();
		var testUrl = 'https://www.google.com/favicon.ico';
		var time = 0;

		function carryOn(url) {
			var img = new Image();
			img.src = url + '?id=' + ~~(Math.random() * 99);
			img.width = 1;
			img.height = 1;

			function light() {
				var end = new Date().getTime();

				time = (end - start) < 100 ? (end - start) : ~~((end - start) / 10);

				var state = time <= 99 ? 'green' : time >= 100 && time <= 199 ? 'yellow' : time >= 200 ? 'red' : '';

				if (el) el.append('<span class="ms ' + state + '">' + time + 'ms</span>');
			};

			img.onload = function (e) {
				light();
			};

			img.onerror = function (e) {
				light();
			};
		}

		if (typeof testUrl === 'string') {
			carryOn(testUrl);
		} else {
			testUrl.forEach(function (item, i) {
				carryOn(item);
			});
		}

	}

	$('#avatar .head').on('click', '#logout', function (e) {
		e.stopPropagation();
		httpUser.post(api_type.user('logout'), '', function (data) {
			if (data.code === 200) {
				util.ck.remove(['_EBTK', '_EBMB']);
				window.location.href = '../../index.html';
			} else {
				util.ck.remove(['_EBTK', '_EBMB']);
				window.location.href = '../../index.html';
			}
		});
	});

	var pathname = window.location.pathname;

	$('.nav-list .item a').removeClass('active');
	if (pathname.length < 3 || pathname.indexOf('index') > 0) {
		$('.nav-list .item').eq(0).find('a').addClass('active');
	}

	if (pathname.indexOf('candy_news') > 0) {
		$('.nav-list .item').eq(1).find('a').addClass('active');
	}

	if (pathname.indexOf('telegram') >= 0) {
		$('.nav-list .item').eq(2).find('a').addClass('active');
	}

	if (pathname.indexOf('invite') > 0) {
		$('.nav-list .item').eq(3).find('a').addClass('active');
	}


	if (pathname.indexOf('idea') > 0) {
		$('.nav-list .item').eq(4).find('a').addClass('active');
	}

	var pathname = window.location.pathname;
	var redirect_url = window.location.origin + encodeURIComponent(pathname);
	redirect_url = '../../idea.html?redirect_url=' + redirect_url;
	$('.nav-list .item').eq(4).find('a').attr('href', redirect_url);


	$('body a[title="51YES网站统计系统"]').hide();


	// test network


});