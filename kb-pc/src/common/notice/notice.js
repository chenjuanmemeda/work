require('./notice.styl');

var notice = function (msg) {
	if ($('.notice').length > 2) return;

	$('body').append('<div class="notice">' + msg + '</div');
	setTimeout(function () {
		$('body .notice').remove();
	}, 2500);

};


module.exports = notice;
