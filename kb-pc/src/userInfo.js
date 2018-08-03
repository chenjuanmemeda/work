var $http = require('../src/common/ajax').$http;
var api_type = require('../src/common/ajax').api_type;
var util = require('./common/util.js');
var cookies = require('js-cookies');
var pagination = require('./common/pagination.js');
var page = new pagination();
var defaultAvatar = require('./img/avatar-login.png');

function userDetail() {
	var self = this;
	var httpUser = new $http();
	self.query = {};
	self.rechargeTemplateId = '';
	self.payTypeId = '';

	userDetail.prototype.getDetail = function () {
		httpUser.get(api_type.user('getDetail'), '', function (data) {
			if (data.code === 200) {
				var res = data.data;
				// var rechargeTime = data.data.rechargeTime;
				//
				// // var rechargeTime = "2018-03-23 10:44:39";
				//
				// var now = new Date().getTime();
				// var endTime = new Date(rechargeTime.replace(/^-/g, '/')).getTime();
				//
				// // console.log(now, endTime, rechargeTime.replace(/-/g, '/'));
				// if (now > endTime) {
				// 	// console.log('1');
				// 	$('.vipTime .time').text('您的VIP已过期');
				// 	$('.data-wrap .vipTime').text('您的VIP已过期');
				// 	$('.time-deadline').show();
				// } else {
				// 	// console.log(2);
				// 	// $('.time-deadline').hide();
				// 	$('#avatar .vipTime .time').text('VIP将于 ' + rechargeTime + ' 到期');
				// 	var index = rechargeTime.indexOf(' ');
				// 	var userCenterrechargeTime = rechargeTime.substring(0, index);
				// 	$('.data-wrap .vipTime').text('VIP将于 ' + userCenterrechargeTime + ' 到期');
				// }

				var userName = data.data.userName;
				if (!userName || userName === 'undefined') userName = '获取用户名失败， 请退出重新登录';

				$('.left-container .user-name').text(userName);
				$('.user-info-header .head .left .userName').text(userName);

				// if (!rechargeTime || rechargeTime == 'undefined') rechargeTime = '获取到期时长失败！';

				if (res.userImageUrl) {
					$('#avatar.login').css({'background-image': 'url(' + res.userImageUrl + ')'});
				} else {
					$('#avatar.login').css({'background-image': 'url(' + defaultAvatar + ')'});
				}

			}
		});
	};

	/**
	 * 获取会员充值模板
	 */
	userDetail.prototype.rechargeTemplate = function () {
		httpUser.get(api_type.rechargeTemplate('list'), '', function (data) {
			if (data.code === 200) {
				var element = $('#recharge-wrap .form-wrap-body .recharge-item-list');
				var resultList = data.data;
				element.empty();
				self.rechargeTemplateId = resultList[0].rechargeTemplateId;
				for (var i = 0; i < resultList.length; i++) {
					element.append(
						'<li data-recharge="' + resultList[i].rechargeTemplateId + '">' +
						'<p class="head">￥' + util.mul(resultList[i].amount) + '</p>' +
						'<p class="body">' + resultList[i].timeCount + '天</p>' +
						'</li>'
					);
				}
				element.find('li').eq(0).addClass('active');
			}
		});
	};

	/**
	 * 获取可用充值方式
	 */
	userDetail.prototype.getPayType = function () {
		httpUser.get(api_type.payType('list'), {clientType: 1}, function (data) {
			if (data.code === 200) {
				if ($('#recharge-wrap .pay-type .pay').length > 0) $('#recharge-wrap .pay-type .pay').remove();

				var res = data.data;

				self.payTypeId = res[0].payTypeId; // 第一个payTypeId;

				for (var i = 0; i < res.length; i++) {
					var typeId = res[i].typeId;
					var name = res[i].payTypeName;
					var cls = (~~typeId == 1) ? 'alipay' : 'wechat';
					$('#recharge-wrap .pay-type').append(
						'<label data-payType="' + res[i].payTypeId + '" class="pay ' +
						cls + '"><i class="' + cls + '"></i>' + name + '</label>'
					);
				}
				$('#recharge-wrap .pay-type').find('.pay').eq(0).addClass('active');

			}
		});
	};

	/**
	 * 获取SN
	 */
	userDetail.prototype.getRecommendSn = function () {
		httpUser.get(api_type.user('getRecommendSn'), '', function (data) {
				if (data.code === 200) {
					$('#sn').text(data.data);
					$('#clipSn').attr('data-clipboard-text', data.data);
				}

				if (data.code === 206 || data.code === 203) {
					util.ck.remove(['_EBTK', '_EBMB']);
					window.location.reload(true);
				}
			}
		);
	};

	/**
	 * 推荐链接
	 */
	userDetail.prototype.getRecommendUrl = function () {
		httpUser.get(api_type.user('getRecommendUrl'), '', function (data) {
			if (data.code === 200) {
				$('#invitation_code').text(data.data);
				$('#clipSn_invitation_code').attr('data-clipboard-text', data.data);
			}
		});
	};

	/**
	 * 获取邀请记录
	 * @param index
	 */
	userDetail.prototype.getList4Recommend = function (index) {
		self.query = {
			pageIndex: index || 1,
			pageSize: 5
		};
		httpUser.get(api_type.userRewardRecord('getList4Recommend'), self.query, function (data) {
			if (data.code === 206 || data.code === 203) {
				window.location.reload(true);
			} else {
				$('#invitation-wrap .invitation-info tbody').empty();

				var resultList = data.data.resultList;

				page.page.pageIndex = data.data.pageIndex;
				page.page.totalPage = data.data.totalPage;
				page.page.totalCount = data.data.totalCount;

				if (resultList.length > 0) {
					$('#invitation-wrap .no-info').hide();
					for (var i = 0; i < resultList.length; i++) {
						$('#invitation-wrap .invitation-info tbody').append(
							'<tr>' +
							'<td>' + resultList[i].beRecommendUserName + '</td>' +
							'<td>' + resultList[i].timeCreate + '</td>' +
							'<td>' + resultList[i].times + '</td>' +
							'</tr>'
						);
					}
					page.render();
				} else {
					$('#invitation-wrap .no-info').show();
					$('#pagination').hide();
				}
			}
		});
	};

	/**
	 * 分页事件绑定
	 */
	userDetail.prototype.pageEventBind = function () {
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
			self.getList4Recommend(page.page.pageIndex);
			page.render();
		});
	};

	/**
	 * 获取用户成功邀请人数、奖励总时长、可领取时长
	 */
	userDetail.prototype.getSum = function () {
		httpUser.get(api_type.userRewardRecord('getSum'), '', function (data) {
			$('#userCount').text(data.data.userCount + '人');
			$('#totalTimes').text(data.data.totalTimes + '天');
			$('#unReceiveTimes').text(data.data.unReceiveTimes + '天');
		});
	};

	/**
	 * 初始化用户信息
	 */
	userDetail.prototype.init = function () {
		self.getDetail();
		self.getRecommendSn();
		self.getPayType();
		self.getRecommendUrl();
		self.getSum();

		self.pageEventBind();
	};
}

module.exports = userDetail;
