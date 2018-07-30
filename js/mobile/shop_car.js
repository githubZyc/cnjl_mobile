/*
 *APP首页 管理购物车列表父级页面处理逻辑
 */
mui.plusReady(function(){
	///////////////////////初始化构造器/////////////////////////
	mui.init({
		subpages: [{
			url: 'shop_car_subpage.html',
			id: 'shop_car_subpage',
			styles: {
				top: '65px',
				bottom: '0px'
			}
		}]
	});
	$("header .mui-btn").on("tap", function() {
				$(this).toggleClass("btn-type");
				if($(this).hasClass("btn-type")) {
					$("header .mui-btn").text("完成");
				} else {
					$("header .mui-btn").text("编辑");
				}
				plus.webview.getWebviewById('shop_car_subpage').evalJS("changeStyle()");
			});
});
