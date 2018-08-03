var $http = require('../../common/ajax').$http;
var $httpAnon = require('../../common/ajax').$httpAnon;
var httpAnon = new $httpAnon();
var api_type = require('../../common/ajax').api_type;
var util = require('../../common/util.js');
var httpUser = new $http();
var userDetail = {};
var defaultAvatar_man = require('../../img/man-1.png');
var defaultAvatar = require('../../img/avatar-login.png');
var candyCount = 0;

function getSum() {
	httpUser.get(api_type.userRewardRecord('getSum'), '', function (data) {
		if (data.code === 206 || data.code === 203) {
			// var redirect_url = window.location.href;

			// window.location.href = '../../log/sign.html?redirect_url=' + encodeURIComponent(redirect_url);
			window.location.href = '../../index.html';
		}
		if (data.code === 200) {
			var res = data.data;
			$('.candy-count,#head-candyCount').text(res.candyCount);
			$('.candy-count,#head-candyCount').attr('data-candycount', res.candyCount);
			candyCount = data.data.candyCount;
			if ($('#M1-count').length > 0) {
				$('#M1-count').text(res.level01UserCount);
				$('#M2-count').text(res.level02UserCount);
				$('#M3-count').text(res.level03UserCount);
				$('#M4-count').text(res.level04UserCount);
				$('#M5-count').text(res.level05UserCount);
				$('#M6-count').text(res.level06UserCount);
				// $('#M1-Percent').text('获得' + res.level01ConsumeRewardPercent + '% 收益');
				// $('#M2-Percent').text('获得' + res.level01ConsumeRewardPercent + '% 收益');
			}
		}
	});
}

function getDetail() {
	httpUser.get(api_type.user('getDetail'), '', function (data) {
		if (data.code === 200) {
			var res = data.data;
			userDetail = res;
			var rechargeTime = data.data.rechargeTime;
			var now = new Date().getTime();
			var endTime = new Date(rechargeTime.replace(/^-/g, '/')).getTime();

			if (now > endTime) {
				$('.time-deadline').show();
				$('.vipTime .time').text('您的VIP已过期');
				$('.data-wrap .vipTime').text('您的VIP已过期');
				$('a.add_vip').css({backgroundColor: 'red'});
			} else {
				$('.time-deadline').hide();
				var index = rechargeTime.indexOf(' ');
				var userCenterrechargeTime = rechargeTime.substring(0, index);
				var lotDay = parseInt((endTime - now) / (1000 * 60 * 60 * 24));
				// userCenterrechargeTime
				$('#avatar .vipTime .time').text('VIP将于 ' + lotDay + ' 天后到期');
				$('.data-wrap .vipTime').text('VIP将于 ' + lotDay + ' 天后到期');
			}

			var userName = data.data.userName;
			if (!userName || userName === 'undefined') userName = '获取用户名失败， 请退出重新登录';


			$('.left-container .user-name').text(userName);
			$('.left-container .user-name').attr('title', userName);
			$('.user-info-header .head .left .userName').text(userName);

			if (!rechargeTime || rechargeTime == 'undefined') rechargeTime = '获取到期时长失败！';

			if ($('#nickname').length > 0) $('#nickname').val(res.userName);

			if (res.isExist4PayPwd === 0) {
				$('#payPasswordText').text('支付密码设置成功');
			}

			if (res.userImageUrl) {
				$('.avatar-block .avatar').attr('src', res.userImageUrl);
				$('.user-info-wrap #userAvatar img').attr('src', res.userImageUrl);
				$('#avatar.loginModal-show').css({'background-image': 'url(' + res.userImageUrl + ')'});
			} else {
				$('.avatar-block .avatar').attr('src', defaultAvatar_man);
				$('.user-info-wrap #userAvatar img').attr('src', defaultAvatar_man);
				$('#avatar.loginModal-show').css({'background-image': 'url(' + defaultAvatar + ')'});
			}


			if (res.sex === 0) {
				$('.radio-lab').show();
			} else {
				$('#sexText').text(res.sexText);
			}
		}
	});
}

function getAmount() {
	httpUser.get(api_type.user('getAmount'), '', function (data) {
		if (data.code === 200) {
			$('.user-amount').text('￥' + util.div(data.data));
		}
	});
}

function userInfoInit() {
	getSum();
	getDetail();
	getAmount();
}

(function () {

	var menus = [
		{icon: 'invitation-icon', href: '../../user/default.html', text: '邀请糖果赢现金', name: 'default'},
		{icon: 'shop-icon', href: '../../user/candyShop.html', text: '糖果商城', name: 'candyShop'},
		{icon: 'vip-icon', href: '../../user/vip.html', text: 'VIP会员', name: 'vip'},
		{icon: 'cash-icon', href: '../../user/myWallet.html', text: '我的钱包', name: 'myWallet'},
		{icon: 'setting-icon', href: '../../user/setting.html', text: '个人设置', name: 'setting'},
		{icon: 'prize-icon', href: '../../user/myPrize.html', text: '我的奖品', name: 'myPrize'},

	];

	var pathName = window.location.pathname;

	function isActive(name) {
		if (name !== 'vip') util.ck.remove('SETRECHARGE');
		return (pathName.indexOf(name) > 0) ? 'active' : '';
	}

	function renderMenu() {
		menus.forEach(function (item, i) {
			$('.menu-wrap .menu-list').append(
				'<li class="item ' + isActive(item.name) + '">' +
				'<a href="' + item.href + '">' +
				'<i class="icon ' + item.icon + '"></i>' +
				'<span>' + item.text + '</span>' +
				'</a>' +
				'</li>'
			);
		});
	}

	// $('#avatar .user-info-header').on('click', '#logout', function (e) {
	// 	httpUser.post(api_type.user('logout'), '', function (data) {
	// 		cookies.setItem('NO_SnReload', '1', 300);
	// 		cookies.removeItem('_EBTK');
	// 		cookies.removeItem('_EBMB');
	// 		window.location.href = '../../index.html';
	// 	});
	// 	cookies.removeItem('_EBTK');
	// 	cookies.removeItem('_EBMB');
	// 	window.location.href = '../../index.html';
	// });

	userInfoInit();
	renderMenu();

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

	trace(0);

})();

exports.userInfoInit = userInfoInit;
exports.userDetail = userDetail;