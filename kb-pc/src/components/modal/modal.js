require('./modal.styl');
var _modal = function () {
	this.init();

};

var modal = '';
var winHeight = $(window).height();
var documentHeight = $(document.body).height();

_modal.prototype = {
	modalOpen: {
		paddingRight: 17,
		overflow: 'hidden'
	},
	scrollWidth: 17 || window.innerWidth - document.documentElement.clientWidth,
	hide: function (name) {
		modal = $('.cjdl-modal[data-name="' + name + '"]');
		$('body').removeAttr('style');
		modal.hide();
	},
	show: function (name) {
		var self = this;

		modal = $('.cjdl-modal[data-name="' + name + '"]');


		documentHeight = $(document.body).height();

		if (documentHeight > winHeight) {
			$('body').css(self.modalOpen);
		}


		modal.show();
	},
	render: {},
	eventBind: function () {
		var self = this;
		var modalName = '';
		var toggle = '';

		// 打开 modal 事件绑定
		$('div').on('click', '.open-modal', function (e) {

			modalName = $(this).data().modal;
			modal = $('.cjdl-modal[data-name="' + modalName + '"]');
			if ($('.cjdl-modal[data-name="' + modalName + '"]').length <= 0) {
				throw new Error(modalName + ' Modal is not defined');
			}
			documentHeight = $(document.body).height();

			if (documentHeight > winHeight) {
				$('body').css(self.modalOpen);
			}

			modal.show();
		});


		// 关闭modal
		$('body').on('click', '.cjdl-modal', function (e) {
			toggle = $(this).data().toggle || '';
			if ($(e.target).hasClass('cjdl-modal') && toggle !== 'on') {
				modal.hide();
				$('body').removeAttr('style');
			}
		});

		$('body').on('click', '.close-modal', function () {
			modal.hide();
			$('body').removeAttr('style');
		});
	},
	init: function () {


		this.eventBind();
	}
};


module.exports = new _modal();
