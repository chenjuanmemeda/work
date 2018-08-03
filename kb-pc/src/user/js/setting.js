require('../css/setting.styl');
var cookies = require('js-cookies');
var $http = require('../../common/ajax.js').$http;
var api_type = require('../../common/ajax.js').api_type;
var api = require('../../common/ajax.js').api;
var httpUser = new $http();
var userInfoInit = require('./leftContainer').userInfoInit;
var notice = require('../../common/notice/notice.js');
var defaultAvatar_man = require('../../img/man-1.png');

$(function () {
	var mainUserDetail = {};
	var userDetail = {};


	function init() {
		var mobile = cookies.getItem('_EBMB');
		if (mobile) {
			$('.mobile-item .text-tips').text(mobile.replace(/"/g, ''));
			$('.mobile-item .methods-btn').text('修改绑定');

		}

		httpUser.get(api_type.user('getDetail'), '', function (data) {
			if (data.code === 200) {
				userDetail = data.data;

				if (userDetail.isExist4PayPwd === 0) {
					$('.payPassword-item .methods-btn').text('设置');
				} else {
					$('.payPassword-item .methods-btn').text('修改密码');
				}

				if (!userDetail.loginName) {
					$('#editWrap').show();
					$('#loginNameWrap').hide();
				} else {
					$('#loginNameWrap .loginName').text(userDetail.loginName);
					$('#editWrap').hide();
					$('#loginNameWrap').show();
				}

				if (userDetail.userImageUrl) {
					$('.avatar-block .avatar').attr('src', userDetail.userImageUrl);
				} else {
					$('.avatar-block .avatar').attr('src', defaultAvatar_man);
				}
			}
		});
	}

	$('#edit').click(function () {
		userDetail.userName = $('#nickname').val();
		userDetail.loginName = $('#loginName').val();
		userDetail.sex = $('input.sex[name="sex"]:checked').val();

		$('#edit').attr('disabled', 'disabled');
		$('#edit').addClass('disabled');
		$('#edit').text('保存中...');
		if (userDetail.sex <= 0) {
			if (!userDetail.sex) return notice('请选择性别！');
		}

		httpUser.post(api_type.user('editDetail'), userDetail, function (data) {
			if (data.code === 200) {
				notice(data.msg);
				window.location.reload(true);
			} else {
				window.location.reload(true);
			}
			$('#edit').removeAttr('disabled');
			$('#edit').removeClass('disabled');
			$('#edit').text('保存');
			init();
		});
	});

	init();

	$('.editUserName').click(function () {
		$('#loginName').show();
		$(this).hide();
		$('.userNameTips').hide();
	});

	$('.avatarForm').attr('action', api.img);

	$('#changeAvatar').fileupload({
		url: api.img,
		maxFileSize: 2000000,
		dataType: 'json',
		done: function (e, data) {
			var res = data.result;
			userDetail.userImageUrl = res.data[0];
			$('.avatar-block .avatar').attr('src', res.data[0]);

		},
		progressall: function (e, data) {
			if (data.total > 500000) {
				return notice('请上传小于500kb的图片！');
			}
		}
	}).prop('disabled', !$.support.fileInput)
	.parent().addClass($.support.fileInput ? undefined : 'disabled');

});