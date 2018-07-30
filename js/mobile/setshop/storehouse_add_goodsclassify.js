/*
 *APP门店样品库添加商品页面处理逻辑
 */
mui.plusReady(function(){
	mui.init({
		subpages: [{
			url: 'storehouse_add_goodsclassify_subpage.html',
			id: 'storehouse_add_goodsclassify_subpage',
			styles: {
				top: '108px',
				bottom: '0px',
				width: '75%',
				left:'25%'
			},
			extras:{
				shopId:plus.webview.currentWebview().shopId
			}
		}]
	});
	mui('.mui-scroll-wrapper').scroll({
		indicators: false //是否显示滚动条
	});
	var vm = new Vue({
		el: 'body',
		data: {
			commodityTypeCode:'01',
			contentId:1 //暂未使用到
		},
	  	created:function(){
	  		var that = this;
	  	},
	  	mounted:function(){},
	  	methods:{
	  		showCommodity:function(commodityTypeCode,contentId,pageNo){
	  			plus.webview.getWebviewById('storehouse_add_goodsclassify_subpage').evalJS("showCommodityByCode('"+commodityTypeCode+"','1',1)");
	  		},
	  		searchCommodity:function(){
	  			var commodityNameOrBarCode = $("#commodityNameOrBarCode").val().trim();
	  			plus.webview.getWebviewById('storehouse_add_goodsclassify_subpage').evalJS("searchCommodityBy('"+commodityNameOrBarCode+"','1',1)");
	  		}
	  	}
	});
});
