require('./idea.styl');
var $httpAnon = require('../common/ajax').$httpAnon;
var api_type = require('../common/ajax').api_type;
var httpAnon = new $httpAnon();
var check = require('../common/check.js');
var notice = require('../common/notice/notice');
var api = require('../common/ajax').api;
var util = require('../common/util');
$(function () {
	var query = {};
	var checkForms = ['#content'];

	function _alert(msg) {
		$('body').append('<div class="notice-alert">' +
			'<div class="alert-msg fix">' +
			'<p style="padding: 60px 0"><i class="success"></i>' + msg + '</p>' +
			'</div>' +
			'</div');
	}

	function postIdea() {
		var isValid = check(checkForms, ['请输入反馈意见', '请输入联系方式']);
		if (!isValid) return;

		$('#ideaSubmit').text('提交中...');
		$('#ideaSubmit').attr('disabled', 'disabled');

		query = {
			content: $('#content').val(),
			contactWay: $('#contactWay').val(),
			imgs: imgArr.join(', ')
		};
		query.content = query.content;

		httpAnon.post(api_type.advise('add'), query, function (data) {
			if (data.code === 200) {
				_alert('提交成功，感谢您的反馈！');
				$('#content, #contactWay').val('');
				imgArr = [];
				if (util.getUrlParam('redirect_url')) {
					setTimeout(function () {
						window.location.href = decodeURIComponent(util.getUrlParam('redirect_url'));
					}, 1800);
				} else {
					setTimeout(function () {
						$('.notice-alert').remove();
					}, 1800);
				}
				$('.img-list').empty();
			} else {
				notice(data.msg);
			}
			$('#ideaSubmit').text('提交');
			$('#ideaSubmit').removeAttr('disabled');
		});
	}

	$('#ideaSubmit').click(function () {
		postIdea();
	});

	// $(checkForms.join(', ')).keyup(function (e) {
	// 	if (e.keyCode === 13) {
	// 		postIdea();
	// 	}
	// });

	var imgArr = [];
	var imgIndex = -1;
	$('#add_img').fileupload({
		url: api.img,
		maxFileSize: 2000000,
		dataType: 'json',
		done: function (e, data) {
			if (imgArr.length >= 3) return notice('最多上传3张图片');

			var res = data.result;
			imgIndex++;
			imgArr.push(res.data[0]);
			$('.img-list').append('<li class="img-item">' +
				'<img src="' + res.data[0] + '" alt="">' +
				'<p class="removeImg" data-index="' + imgIndex + '"><span class="remove-icon"></span></p>' +
				'</li>');

		},
		progressall: function (e, data) {
			if (data.total > 2000000) {
				return notice('请上传小于2MB的图片！');
			}
		}
	}).prop('disabled', !$.support.fileInput)
	.parent().addClass($.support.fileInput ? undefined : 'disabled');
	var removeIndex = 0;
	$('.img-list').on('click', '.img-item .removeImg', function (e) {
		removeIndex = $(this).data().index;
		imgArr.splice(removeIndex, 1);
		$('.img-list .img-item .removeImg[data-index="' + removeIndex + '"]').parent().remove();
	});


});