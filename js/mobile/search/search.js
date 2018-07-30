/*
 *APP首页 管理通用搜索商品页面处理逻辑
 */
mui.plusReady(function(){
	var vm=new Vue({
		el:"body",
		data:{
			commodityNameOrBarCode:plus.webview.currentWebview().searchParam||'',
			resultCommoditys:[],
			localPosition:{}
		},
		created:function(){
			var that = this;
			plus.geolocation.getCurrentPosition(function(p){
	  			console.info("当前定位对象:"+JSON.stringify(p));
	  			that.localPosition = p.coords;
	  			that.search(that.commodityNameOrBarCode);
			}, function(e){
				mui.toast('当前位置获取失败' + e.message);
			});
		},
		methods:{
			thisSearch:function(){
				this.search($("#thisSearch").val().trim());
			},
			search:function(commodityNameOrBarCode){
				var that = this;
				muiHelper.muiHelperAjax(null, true, "/CnShopCommodityController/app/shop/commodity/search/list", {
				"lat": mui.parseJSON(localStorageUtils.getParam("myPosition")).latitude,
				"lng": mui.parseJSON(localStorageUtils.getParam("myPosition")).longitude,
				"commodityTypeCode":'',
				"pageNo":1,
				"pageCount":50,
				"orderBy":"createTime,desc",
				"commodityNameOrBarCode":commodityNameOrBarCode,
				"lat": that.localPosition.latitude,
				"lng": that.localPosition.longitude
				}, function(result) {
					that.resultCommoditys = result.content;
				});
			},
			goCommodityDetal:function(commodity){
//				mui.openWindow({
//					url:"../setshop/goods_details.html",
//					id:"goods_details",
//					extras:{
//						commodity:commodity
//					}
//				});
				mui.openWindow({
					url:"../goods_details/goods_details_main.html",
					id:"goods_details_main",
					extras:{
						commodity:commodity
					}
				});
			},
		}
	});
});

