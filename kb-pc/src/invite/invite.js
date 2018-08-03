require('./invite.styl');
	
var $httpAnon = require('../common/ajax').$httpAnon;
var $http = require('../common/ajax').$http;
var api_type = require('../common/ajax').api_type;
var api = require('../common/ajax').api;
var util = require('../common/util.js');
var httpAnon = new $httpAnon();
var httpUser = new $http();
var notice = require('../common/notice/notice');
var self = null;
var _invite = function () {
	self = this;
	this.click_flag= true;//是否可以旋转抽奖
	this.prizeIndex = null; //中奖奖品的下标
	this.drawCount = 0; //抽奖次数
};
var maxItems = 40;
_invite.prototype = {

	// 获取滚动中奖纪录
	getTicketRecord: function() {
		// http://www.cjdltest.com/services/anon/luckyDraw/
		httpAnon.get(api_type.luckyDrawRewardRecord('getList4Hall'), '', function (data) {
			if (data.code === 200) {
				data.data.resultList.forEach(function (item, i) {
					$('.draw-menu-list').append('<li style="height: 31px">恭喜<span style="color:#ff1200;">'+ item.userName +'</sapn><span style="color:#fff;">获得</span><span style="color:#f9fe0e;">' + item.rewardGoodsName + '</span></li>');
				});
			}
		});

		setInterval(function () {
			$('.draw-menu-list').animate({marginTop: '-28px'}, 500, function () {
				$(this).css({marginTop: '0px'}).find('li:first').appendTo(this);
			});
		}, 1500);
	},
	// 获取邀请的人数和排名
	getRecommendSum: function () {
		httpUser.get(api_type.user('getRecommendSum'), '', function (data) {
			if (data.code === 200) {
				$('.num-people').text(data.data.totalCount);
				$('.num-position').text(data.data.rank);
			} else {
				notice(data.msg);
			}
		});
	},
	// 获取剩余抽奖次数
	getCount: function () {
		httpUser.get(api_type.luckyDraw('getCount'), '', function (data) {
			if (data.code === 200) {
				self.drawCount = data.data;
				$('.draw-count').text(self.drawCount);
			} else {
				notice(data.msg);
			}
		});
	},

	// 获取邀请排行榜
	getRotaryRecord: function() {
		httpAnon.get(api_type.user('getRecommendRank'), '', function (data) {
			if (data.code === 200) {
				var bigger = '';
				var rank = '';
				data.data.forEach(function (item, i) {
					bigger =  i < 3 ? 'bigger' : '';
					rank = item.rank < 4 ? '' : item.rank;
					$('.rotary-list').append('<li class="item ' + bigger + '">'+
					'<span class="content left ' + 'num'+ i + '">' + rank + '</span>'+
					'<span class="content middle">'+ item.userName+'</span>'+
					'<span class="content right">'+ item.totalCount +'</span>'+
					'</li>');
				});
			}
		});
	},
	
	// 获取抽奖的结果
	draw: function () {
		if(self.drawCount < 1){
			return notice('您已经没有抽奖次数啦！');
		}else{
			httpUser.post(api_type.luckyDraw('draw'), '', function (data) {
				if (data.code === 200) {
					if(data.data.rewardGoodsId == '1024242687873646780' || data.data.rewardGoodsId == '1024242687873646792' || 
						data.data.rewardGoodsId == '1024242687873646798' || data.data.rewardGoodsId == '1024242687877840927' ||data.data.rewardGoodsId == '1024242687877840960'){
						self.prizeIndex = 5; //谢谢参与
					}else if(data.data.rewardGoodsId == '1024242687873646749' ){
						self.prizeIndex = 1; //vip 3
						self.ratating(self.prizeIndex);
					}else if(data.data.rewardGoodsId == '1024242687873646712' ){
						self.prizeIndex = 2; //eos1
						self.ratating(self.prizeIndex);
					}else if(data.data.rewardGoodsId == '1024242687873646768' ){
						self.prizeIndex = 3; //vip 1
						self.ratating(self.prizeIndex);
	
					}else if(data.data.rewardGoodsId == '1024242687873646700' ){
						self.prizeIndex = 4; //eos2
						self.ratating(self.prizeIndex);
					}else if(data.data.rewardGoodsId == '1024242687873646726' ){
						self.prizeIndex = 6; //ada1
						self.ratating(self.prizeIndex);
					}
				}
			});
		}
		
	},
	// 抽奖转动
	ratating: function (index) {
		console.log(self.click_flag,'start')
		var start_rotating_degree= 0; //初始旋转角度
		var rotate_angle= 0; //将要旋转的角度
		if (!self.click_flag) return;
		var type = 0; // 默认为 0  转盘转动 1 箭头和转盘都转动(暂且遗留)
		var during_time = 5; // 默认为1s
		var random = Math.floor(Math.random() * 10);
		var result_index = index; // 最终要旋转到哪一块，对应prize_list的下标
		var result_angle = [327.5, 292.5, 260.5, 230.5, 190.5, 150.5, 110.5, 70.5, 30.5, 2.5]; //最终会旋转到下标的位置所需要的度数
		var rand_circle = 6; // 附加多转几圈，2-3
		self.click_flag = false; // 旋转结束前，不允许再次触发
        var oPointer = $(".wheel-pointer");
		if (type == 0) {
			var rotate_angle = start_rotating_degree + rand_circle * 360 + result_angle[result_index] - start_rotating_degree % 360;
			start_rotating_degree = rotate_angle;
			console.log(start_rotating_degree,'tart_rotating_degree')
			rotate_angle = "rotate(" + rotate_angle + "deg)";
			// //转动指针
			oPointer.css({
				transition: "all 5s",
				transform: rotate_angle
			});
			// 旋转结束后，允许再次触发
			setTimeout(function () {
				self.click_flag = true;
				self.game_over();
			}, during_time * 1000 + 1500); // 延时，保证转盘转完
		} 
	},
	// 分享抽奖增加抽奖次数
	addDrawCount: function () {
		httpUser.post(api_type.luckyDraw('add'), '', function (data) {
			if (data.code === 200) {
				self.getCount();
			}else{
				notice(data.msg);
			}
		});
	},

	game_over() {
		self.toast_control = true;
		$('.cjdl-modal[data-name="prizeModal"]').show();
	},
	qqShare: function (id, title, avatar, description) {
		var p = {
			url: 'http://www.hql178.com/act/draw_act.html', /*获取URL，可加上来自分享到QQ标识，方便统计*/
			desc: '',
			title: '【超级代练】', /*分享标题(可选)*/
			summary: 'Fun暑假，放肆嗨，游戏豪礼任你选，凡在【超级代练】发单、接单即可参与抽奖活动，大量现金红包、酷炫皮肤、定制豪礼等你来！', /*分享摘要(可选)*/
			pics: 'http://pic.chaojidailian.com/pics/913702014733651968.png', /*分享图片(可选)*/
			flash: '', /*视频地址(可选)*/
			site: 'http://www.chaojidailian.com', /*分享来源(可选) 如：QQ分享*/
			style: '201',
			width: 32,
			height: 32
		};
		var s = [];
		for (var i in p) {
			s.push(i + '=' + encodeURIComponent(p[i] || ''));
		}
		var url = 'http://connect.qq.com/widget/shareqq/index.html?' + s.join('&');
		return url;
	},
	sina: function (id, title, avatar, description) {
		var _url = 'http://www.hql178.com/act/draw_act.html';
		var _showcount = 0;
		var _desc = 'Fun暑假，放肆嗨，游戏豪礼任你选，凡在【超级代练】发单、接单即可参与抽奖活动，大量现金红包、酷炫皮肤、定制豪礼等你来！';
		// var _summary = '';
		var _title = 'Fun暑假，放肆嗨，游戏豪礼任你选，凡在【超级代练】发单、接单即可参与抽奖活动，大量现金红包、酷炫皮肤、定制豪礼等你来！';
		var _site = '';
		var _width = '600px';
		var _height = '800px';
		var _summary = 'Fun暑假，放肆嗨，游戏豪礼任你选，凡在【超级代练】发单、接单即可参与抽奖活动，大量现金红包、酷炫皮肤、定制豪礼等你来！';
		var _pic = avatar || 'http://pic.chaojidailian.com/pics/913702014733651968.png';
		var _shareUrl = 'http://service.weibo.com/share/share.php?';
		_shareUrl += 'url=' + encodeURIComponent(_url || document.location);   //参数url设置分享的内容链接|默认当前页location
		_shareUrl += '&showcount=' + _showcount || 0;      //参数showcount是否显示分享总数,显示：'1'，不显示：'0'，默认不显示
		_shareUrl += '&desc=' + encodeURIComponent(_desc || '分享的描述');    //参数desc设置分享的描述，可选参数
		_shareUrl += '&summary=' + encodeURIComponent(_summary || '分享摘要');    //参数summary设置分享摘要，可选参数
		_shareUrl += '&title=' + encodeURIComponent(_title || document.title);    //参数title设置分享标题，可选参数
		//_shareUrl += '&site=' + encodeURIComponent(_site||'');   //参数site设置分享来源，可选参数
		_shareUrl += '&pics=' + encodeURIComponent(_pic || '');   //参数pics设置分享图片的路径，多张图片以＂|＂隔开，可选参数
		window.open(_shareUrl, 'width=' + _width + ',height=' + _height + ',top=' + (screen.height - _height) / 2 + ',left=' + (screen.width - _width) / 2 + ',toolbar=no,menubar=no,scrollbars=no,resizable=1,location=no,status=0');
	},
	eventBind: function () {
		$('.qqshare, .bds_weixin, .bds_tsina').click(function () {
			self.addDrawCount();
			// if (self.tk) {
			// 	httpUser.post(api_type.luckyDraw('add'), {luckyDrawType: 7}, function (data) {
			// 		if (data.code === 200) {
			// 			self.getCount();
			// 		}
			// 	});
			// }
			// var traceObj = {
			// 	name: '抽奖活动',
			// 	url: self.url.replace('&', '^'),
			// 	urlRef: document.referrer,
			// 	traceType: 0
			// };
			// traceObj.name = '分享按钮点击';
			// httpAnon.add(api_type.trace('add'), JSON.stringify(traceObj), function (data, state) {
			// });
		});

		$('.qqshare').attr('href', self.qqShare());
		$('.bds_tsina').click(function () {
			self.sina();
		});
		$('.share-close,.close-prize').click(function () {
			$('.cjdl-modal').hide();
		});
		
		// 开始抽奖
		$('.wheel-pointer').click(function () {
				self.draw();
		})
	},
	init: function () {
		$.when(this.getTicketRecord())
		.then(this.getRotaryRecord())
		.then(this.eventBind())
		.then(this.getRecommendSum())
		.then(this.getCount())
	}
};

$(function () {
	var invite = new _invite();


	invite.init();
});