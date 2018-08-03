var rules = {
	mobile: {
		regExp: /^[0-9A-Za-z-_\u4e00-\u9fa5]{2,15}$/,
		msg: '请输入正确格式的手机号/登录名！'
	},
	password: {
		regExp: /^\s*\S((.){4,14}\S)?\s*$/,
		msg: '请输入6-15位的密码'
	},
	repeatPassword: {
		regExp: '',
		msg: '两次密码不一致！'
	}
};

/**
 * 发起表单验证
 * @param arr // 需要验证的表单
 * @param requireArr // 表单错误信息
 */
var check = function (arr, requireArr) {
	var el;
	var result = [];
	for (var i = 0; i < arr.length; i++) {
		el = $(arr[i]);

		var valid = el.attr('data-valid') ? el.attr('data-valid').split(', ') : 'err';
		var value = el.val();

		var maps = {};

		for (var v = 0; v < valid.length; v++) {
			var validInfo = {index: i, el: el};
			if (valid[v] === 'password' && el.val()) rules.repeatPassword.regExp = value;

			/**
			 * 判断是否为空值
			 */
			if (valid[v] === 'require' && /^$/g.test(value)) {
				maps[i] = i; // 记录当前检查对象有没通过，如果没有通过则继续判断
				validInfo.msg = (requireArr && requireArr.length > 0) ? requireArr[i] : '请输入相关信息';
				result.push(validInfo);
			}

			/**
			 * 判断是否输入正确
			 */
			if (valid[v] !== 'require' &&
				valid[v] !== 'repeatPassword' &&
				!rules[valid[v]].regExp.test(value) && maps[i] !== i) {

				validInfo.msg = rules[valid[v]].msg;
				result.push(validInfo);
			}

			//判断第二次输入密码
			if (valid[v] === 'repeatPassword' && rules[valid[v]].regExp !== value) {
				validInfo.msg = rules[valid[v]].msg;
				result.push(validInfo);
			}
		}
	}

	if (result.length > 0) {
		result[0].el.focus();
		$('.form-control input,.form-control textarea').removeClass('err');
		$('.form-control .icon-err').hide();
		if ($('.form-control .hint-err')) {
			$('.form-control .hint-err').text('');
		}

		$.each(result, function (i, item) {
			item.el.addClass('err');
			item.el.siblings('.icon-err').show();

			if ($('.form-control .hint-err')) {
				item.el.siblings('.hint-err').text(item.msg);
			}
		});

		$(document).on('focus', '.form-control input,.form-control textarea', function (e) {
			$(this).removeClass('err');
			$(this).siblings('.icon-err').hide();
			$(this).siblings('.hint-err').text('');
		});

	} else {
		$('.form-control input,.form-control textarea').removeClass('err');
		$('.form-control .icon-err').hide();
		if ($('.form-control .hint-err')) {
			$('.form-control .hint-err').text('');
		}
	}


	return result.length > 0 ? false : true; //返回length 是为了 return顶层函数的作用域
};


module.exports = check;

