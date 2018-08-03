var $ = require('jquery');
var $http = require('../common/ajax').$http;
var api_type = require('../common/ajax').api_type;
var util = require('../common/util.js');
var httpUser = new $http();

$(function () {
	var payType = util.getUrlParam('payType');
	var amount = util.getUrlParam('amount');

	$('#payType').text('支付方式：' + (~~payType === 1) ? '支付宝' : '微信' + '元');
	$('#amount').text(amount);

});