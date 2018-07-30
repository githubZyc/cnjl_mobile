/*
 *APP门店自定义添加商品--编辑商品信息到商户个人门店商品库页面处理逻辑
 */
mui.plusReady(function(){
	var vm = new Vue({
		el: 'body',
		data: {
			commodityTypeCode:plus.webview.currentWebview().commodityTypeCode,
			commodityImgs:[]
		},
	  	created:function(){
  			var that = this;
				muiHelper.muiHelperAjax(null, true, "/CnCommoditySampleImgController/app/commodity/sample/img", {
					"commodityTypeCode":that.commodityTypeCode
				}, function(result) {
					if(result.success) {
						that.commodityImgs = result.data;
					} else {
						mui.toast(result.msg);
						return;
					}
			});
	  	},
	  	mounted:function(){
	  		
	  	},
	  	methods:{
	  		addCommodityImg:function(commodityImg){
	  			console.info(JSON.stringify(commodityImg));
	  			plus.webview.getWebviewById('custom_add_product').evalJS("setImg('"+JSON.stringify(commodityImg)+"')");
	  			plus.webview.hide("custom_add_product_choose_img", "slide-out-bottom", 300);
	  		}
	  	}
	});
});

