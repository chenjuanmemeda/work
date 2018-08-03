var moment = require('moment');

var urlSize = 0;
var count = $('#urls', parent.document).val();
var currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
var uploadData = {};
var downArray = new Array();//下载速度

$(function () {
	// $("#begin-btn").click(function () {
	// 	count = $('#urls', parent.document).val();
	// 	startPage();
	// });
	startPage();
	// $("#iframe", parent.document).attr("src", base + "/pageTs/website_flash.jsp");
});

function startPage() {
	// $("#progress-img").attr("src", base + "/libs/pageImages/pagetesting.gif");
	// $(".progressinfo .title").html("正在进行网站测速，请稍候...");
	// $(".progressinfo .bdesc").html("&nbsp;&nbsp;正在进行网站测速");
	// $("#begin-btn").hide();
	// $("#back-btn").hide();
	// $(".webpageresultper").hide();
	// $(".webpageresult").show();
	var urls = ['www.taobao.com', 'www.baidu.com', 'www.qq.com'];
	// $(".default-webpages li").each(function (i) {
	// 	//var url=$(this).find("a").html();
	// 	var url = $(this).find("a").attr("title");
	// 	urls.push(url);
	// });
	urlSize = urls.length;
	runWebTest(urls);
}


/**
 *
 * @param webUrls // 需要测速的网站
 */
function runWebTest(webUrls) {

	// var webline = $(".webline");
	// for (var i = 0; i < webUrls.length; i++) {
	// 	var start = new Date().getTime();
	// 	var html = '';
	// 	var disUrl = webUrls[i];
	// 	if (webUrls[i].length > 15) {
	// 		disUrl = webUrls[i].substr(0, 15) + "...";
	// 	}
	// 	html += '<li class="webitem">' +
	// 		'<img id="imgId' + i + '" src="' + base + '/libs/images/webpages/tswt.png" />' +
	// 		'<span style="margin-left:7px;" class="testpage"><a title=' + webUrls[i] + '>' + disUrl + '</a></span>' +
	// 		'<span class="fpagerespond-time">' +
	// 		'<div id="resultDiv' + i + '" class="time-linec">' +
	// 		'正在测速中......<img src="http://' + webUrls[i] + '?id=' + Math.random() + '" width="1" height="1" onerror="autoResult(\'' + webUrls[i] + '\',' + start + ',' + i + ')"/>' +
	// 		'</div>' +
	// 		//'<span id="resultSpan'+i+'"></span>'+
	// 		'</span>' +
	// 		'<span id="spanID' + i + '" class="fpagedownload-speed text-gray"><b id="resultB' + i + '">等待结果</b></span>' +
	// 		'</li>';
	// 	webline.append(html);
	//
	// }

	var start = new Date().getTime();
	var testUrl = 'http://www.google.com';
	function carryOn(url) {
		var img = new Image();
		img.src = url + '?id=' + ~~(Math.random() * 99);
		img.width = 1;
		img.height = 1;
		img.onerror = function (e) {
			var end = new Date().getTime();
			var time = end - start;
			console.log(e);
			console.log('访问 ' + url + ' 延迟：', time + 'ms。');
		};
	}

	if (typeof testUrl === 'string') {
		carryOn(testUrl);
	} else {
		testUrl.forEach(function (item, i) {
			carryOn(item);
		});
	}
	// img = $(img);

	// $('body').append(img);

	// webUrls.forEach(function (item, i) {
	// 	var start = new Date().getTime();
	//
	// 	var img = new Image();
	// 	img.src = 'http://' + webUrls[i] + '?id=' + ~~(Math.random() * 999);
	// 	img.width = 1;
	// 	img.height = 1;
	// 	img.onerror = function (e) {
	// 		var end = new Date().getTime();
	// 		var time = end - start;
	// 		console.log('访问' + item + ' 延迟：', time + 'ms。');
	// 	};
	// 	img = $(img);
	//
	// 	$('body').append(img);
	// });

	// onerror="autoResult(\'' + webUrls[i] + '\',' + start + ',' + i + ')"/>'

}

var countNums = new Array();

function autoResult(url, start, i) {
	console.log(1);
	countNums.push(i);
	var end = new Date().getTime();
	var time = end - start;
	var diff = (time / 1000).toFixed(2);
	//console.info("url:"+url+",i:"+i,"开始："+start+",结束："+end+",相距："+diff+"s");
	var result = 0;
	var html = '';
	var resultDivStr = '';
	var clas = '';
	// if (diff > 0 && diff <= 0.4) {
	// 	html = '很快';
	// 	result = 40;
	// 	resultDivStr = '<span  class="time_line bg-green" style="width: ' + result + 'px;"></span>';
	// 	clas = 'fpagedownload-speed text-green';
	// } else if (diff > 0.4 && diff < 1.0) {
	// 	html = '一般';
	// 	result = 60;
	// 	resultDivStr = '<span  class="time_line bg-blue" style="width: ' + result + 'px;"></span>';
	// 	clas = 'fpagedownload-speed text-blue';
	// } else {
	// 	html = '很慢';
	// 	result = 90;
	// }

	console.log(diff);

	$("#resultDiv" + i).html(resultDivStr);
//	$("#resultSpan"+i).html(diff+"s");
//	$("#resultB"+i).html(html);


	$("#resultB" + i).html((diff * 1000).toFixed(2) + "ms");

	$("#spanID" + i).attr('class', clas);

	//$("#imgId"+i).attr('src',base+'/libs/images/webpages/tesOk.jpg');

	// if ((diff * 1000) > 0) {
	// 	$("#imgId" + i).attr('src', base + '/libs/images/webpages/tesOk.jpg');
	// } else {
	// 	$("#imgId" + i).attr('src', base + '/libs/images/webpages/testWarn.png');
	// }
	var testData = {};
	testData.httpAdr = url;
	testData.firstPageTime = (diff * 1000).toFixed(2);//首页响应时间

	console.log(testData);
	downArray.push(testData);
	if (countNums.length == urlSize) {
		//测速完成
		// $("#progress-img").attr("src", base + "/libs/images/webpages/ceall.png");
		// $(".progressinfo .title").html("网站测速完成");
		// $(".progressinfo .bdesc").html("");
		// $("#begin-btn").hide();
		// $("#back-btn").show();
		countNums == [];
		urlSize = 0;


	}
}

function initData() {
	// var ip = $('#ipId', parent.document).val();
	// var orgName = $('#orgName', parent.document).val();
	// var signWidth = $('#signWidth', parent.document).val();
	// $('#account').html($('#account', parent.document).val());
	// $("#bottonIpId").html(ip);
	// $("#bottonOrgNameId").html(orgName);
	// $("#signWidthId").html(signWidth);

	// var html = $('#div_flash', parent.document).html();
	// $(".default-webpages").append(html);

}

function addPageTestUrl() {
	var url = $.trim($("#pageTsInputId").val());
	if (url != "") {
		var isWeb = checkHTTPUrl(url);
		if (!isWeb) {
			alert("错误的网址格式");
			return;
		} else {
			//添加网址
			if (count == 4) {
				alert("网页测速网址最多可添加4个");
				return;
			} else {
				count++;
				$("#urls", parent.document).val(count);
				var html = '';
				var disUrl = url;
				if (url.length > 15) {
					disUrl = url.substr(0, 15) + "...";
				}
				html += '<li id="id' + count + '"><a title=' + url + ' href="http://' + url + '" target="_blank">' + disUrl + '</a>' +
					'<a href="javascript:DeleteURL(' + count + ');">&nbsp; 删除</a>' +
					'<i class="fa fa-close"></i></li>';
				$(".default-webpages").append(html);
				$("#div_flash", parent.document).append(html);
				$("#pageTsInputId").val("");
			}
		}
	} else {
		alert("请输入网址");
	}
}


function DeleteURL(num) {
	count--;
	$("#urls", parent.document).val(count);
	$("#id" + num + "").remove();
	$("#id" + num + "", parent.document).remove();
}


function checkHTTPUrl(url) {
	var str = url;
	str = str.match(/^([\w-]+(\.[\w-]+)+(\/[\w-.\/\?%&=\u4e00-\u9fa5]*)?)?$/);
	if (str == null) {
		return false;
	} else {
		return true;
	}
}