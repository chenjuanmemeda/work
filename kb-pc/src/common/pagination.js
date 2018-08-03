var $ = require('jquery');
var pagination = function () {

};

pagination.prototype = {
	query: {},
	page: {
		pageIndex: 1,
		totalPage: 1,
		totalCount: 8,
	},
	maxPage: 3,
	mainEl: $('#pagination'),
	el: function (index) {
		return '<li class="page"><a>' + index + '</a></li>';
	},
	render: function () {
		var self = this;
		self.mainEl.find('.page, .totalCount').remove();
		if (self.page.pageIndex > 1) {
			self.mainEl.prepend('<li class="page firstPage"><a>第一页</a></li><li class="page PreviousPage"><a>上一页</a></li>');
		}

		if (self.page.pageIndex !== self.page.totalPage) {
			self.mainEl.append('<li class="page nextPage"><a>下一页</a></li>' +
				'                    <li class="page lastPage"><a>最后一页</a></li>');
		}

		self.mainEl.append('<li class="totalCount"><span class="text"></span></li>');
		self.mainEl.find('.totalCount .text').text(
			'当前第' +
			self.page.pageIndex + '/' +
			self.page.totalPage + '页 - ' +
			self.page.totalCount + '条信息');

	},
	init: function () {
		this.render();
	},

};

module.exports = pagination;