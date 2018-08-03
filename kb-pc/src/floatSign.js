require('./floatSign.styl');
var util = require('./common/util');
var $httpAnon = require('./common/ajax').$httpAnon;
var httpAnon = new $httpAnon();
var api_type = require('./common/ajax').api_type;
var JSEncrypt = require('./common/jsencrypt.js').JSEncrypt;
var sign = document.getElementById('sign');
sign.onclick = function () {

};
$(function () {

	// window.location.href = window.location.href;
	var encrypt = new JSEncrypt;
	var RSAKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJDo2w9G390N+LXTIcFvASarq+dKX8NtpBxP01pKwcgQN3KYVy3xAF0bAERfB/uBoB6pllWx1OT5o1T4p7jN1GcCAwEAAQ==';


	function login() {
		var pwd = $('#float_password').val();

		var query = {
			loginName: $('#float_mobile').val(),
		};

		$('#sign').text('登录中...');
		$('#sign').attr('disabled', 'disabled');

		encrypt.setPublicKey(RSAKey);
		var encrypted = encrypt.encrypt(pwd);
		query.pwd = encrypted;
		httpAnon.post(api_type.user('login'), query, function (data) {
			if (data.code === 200) {
				var res = data.data;
				util.ck.set({_EBTK: res.token});

				util.ck.set({_EBMB: res.mobile});

				var num = ~~(Math.random() * 99999).toString();

				localStorage.setItem('floatsign', num);

				$('#login-wrap').hide();
				$('.bg').hide();
				$('.welcome').css({display: 'block'});

				window.opener = null;
				window.open('', '_self');
				window.close();

			} else {
				alert(data.msg);
			}
			$('#sign').text('登陆');
			$('#sign').removeAttr('disabled');
		});
	}


	$('#sign').click(function () {
		login();
	});

	$('#float_password, #float_mobile').keyup(function (e) {
		if (e.keyCode === 13) {
			login();
		}
	});


});
