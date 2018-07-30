mui.plusReady(function() {
	mui.init();
	//进度条
	var progressbar = mui('#progress-bar'),
		progressbarNum = 10;

	mui(progressbar).progressbar().setProgress(progressbarNum);

	//图片预览
	var images = [].slice.call(document.querySelectorAll('.evaluate-img img'));
	var urls = [];
	images.forEach(function(item) {
		urls.push(item.src);
	});
	mui('.evaluate-img').on('tap', 'img', function() {
		var index = images.indexOf(this);
		console.log(index);
		plus.nativeUI.previewImage(urls, {
			current: index,
			indicator: 'number'
		});
	});
	//评论图片显示
	$(".evaluate-img-showbtn").click(function() {
		$(this).toggleClass("clickNow");
		if($(this).hasClass("clickNow")) {
			$(".evaluate-img").addClass("show").removeClass("hide");
			$(this).html('展开<span class="mui-icon mui-icon-arrowdown"></span>');
		} else {
			$(this).html('收起<span class="mui-icon mui-icon-arrowup"></span>');
			$(".evaluate-img").removeClass("show").addClass("hide");
		}
	})

});