var util = require('./common/util');
var api = require('./common/ajax').api;

$(function () {
	$('#jump').click(function () {
		localStorage.setItem('overdue', '1');
		window.opener = null;
		window.open('', '_self');
		window.close();
	});
});