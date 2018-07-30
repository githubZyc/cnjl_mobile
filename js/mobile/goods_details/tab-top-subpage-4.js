/*
 *APP商品商品营养成分处理逻辑
 */
mui.plusReady(function(){
	var vm = new Vue({
		  el: 'body',
		  data: {
		  	customber: member.getMember(),
		  	commodity:plus.webview.currentWebview().commodity,
		  	commodityNutrition:{}
		  },
		  
		  mounted:function(){
		  	
		  },
		  created:function(){
		  	this.commodityNutritionDetail(this.commodity.commodityId);
		  },
		  methods:{
		  	commodityNutritionDetail:function(commodityId){
		  		var that = this;
		  		muiHelper.muiHelperAjax(null, true, "/CnCommodityNutritionController/app/commodity/nutrition/detail", { "commodityId": commodityId }, function (result) {
					if (result.success) {
						that.commodityNutrition = result.data;
					} 
				});
		  	}
		  },
		  computed:{}
	});
})
