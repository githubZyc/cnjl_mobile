/*
 *APP门店样品库添加商品--编辑商品信息到商户个人门店商品库页面处理逻辑
 */
mui.plusReady(function(){
	var vm = new Vue({
		el: 'body',
		data: {
			shopId:plus.webview.currentWebview().shopId,
			commoditySample:plus.webview.currentWebview().commoditySample,
			customber:member.getMember(),
			isActive:true
		},
	  	created:function(){
	  		console.info('编辑页存储的选择的门店id:'+this.shopId);
	  		console.info('编辑页存储的选择的商品模板对象:'+JSON.stringify(this.commoditySample));
	  		mui('.mui-content .mui-switch').each(function() { 
				this.addEventListener('toggle', function(event) {
					console.info(JSON.stringify(event.detail.isActive));
					vm.$data.isActive = event.detail.isActive;
				});
			});
	  	},
	  	mounted:function(){
	  		
	  	},
	  	methods:{
	  		addMyShop:function(){
	  			if(!$("#unitPrice").val().trim()){
	  			 	mui.toast("请输入您的商品价格");
	  			 	return false;
	  			}
	  			if($("#unitPrice").val().trim()<=0){
	  				mui.toast("请输入您的商品价格");
	  			 	return false;
	  			}
	  			var that = this;
				var data = {
					"commodityDescribe":$("#commodityDescribe").val().trim(),
					"commodityTypeCode":that.commoditySample.commodityTypeCode,
					"commodityName":$("#commodityName").val().trim(),
					"isOnline": that.isActive ? "0006001" : "0006002",
					"shopId":that.shopId,
					"unit":$("#unit").val().trim(),
					"unitPrice":$("#unitPrice").val().trim(),
					"barCode":$("#barCode").val().trim()||'',
					"customberId":that.customber.id,
					"commoditySampleId":that.commoditySample.id
				};
				console.info("添加商品参数:"+JSON.stringify(data));
				muiHelper.muiHelperAjax(null, true, "/CnShopCommodityController/app/shop/commodity/add", data, function(result) {
					if(result.success) {
						mui.toast(result.msg);
						$("#unitPrice").val(0);
						$("#commodityDescribe").val("") ;
						mui.back();
					} else {
						mui.toast(result.msg);
						return;
					}
				});
	  		}
	  	}
	});
});




