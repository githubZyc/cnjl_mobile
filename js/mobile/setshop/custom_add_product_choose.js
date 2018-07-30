/*
 *APP门店自定义添加商品--编辑商品信息到商户个人门店商品库页面处理逻辑
 */
mui.plusReady(function(){
	var vm = new Vue({
		el: 'body',
		data: {
			commodityTypes:[],
			webViewId:plus.webview.currentWebview().webViewId
		},
	  	created:function(){
	  		var that = this;
  			muiHelper.muiHelperAjax(null, true, "/CnCommodityTypeController/app/commodity/type/all", {}, function(result) {
				if(result.success) {
					that.commodityTypes = result.data;
				} else {
					mui.toast(result.msg);
					return;
				}
			});
	  	},
	  	mounted:function(){
	  		
	  	},
	  	methods:{
	  		checkThis:function(commodityType){
	  			plus.webview.getWebviewById(this.webViewId).evalJS("setCode('"+JSON.stringify(commodityType)+"')");
	  			plus.webview.hide("custom_add_product_choose", "slide-out-bottom", 300);
	  		}
	  	}
	});
});

