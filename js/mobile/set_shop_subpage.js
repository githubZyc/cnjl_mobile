/*
 *APP开店子页面处理逻辑
 */
mui.plusReady(function() {
	mui.init({
	  gestureConfig:{
	   longtap: true //默认为false
	  }
	});
	var vm = new Vue({
		el: 'body',
		data: {
			shops: [],
			pageNo:1,
			customber:member.getMember()
		},
		created: function() {
			var that = this;
			if(member.getMember()){this.getShopList();}
			mui(".mui-scroll ul").on('longtap',"li",function(){
				var shopId = this.getAttribute("data-shop-id");
				mui.confirm('是否要删除该门店?', '确定删除?', ['否', '是'], function (e) {
					if (e.index == 1) {
						muiHelper.muiHelperAjax(null, false, "/CnShopController/app/shop/del", 
						{
							"customberId":that.customber.id,
							"phone":that.customber.phone,
							"id":shopId
						}, function(result) {
							if(result.success) {
								//重新设置本地我的店铺列表
								var my_shop_list = mui.parseJSON(localStorageUtils.getParam("my_shop_list"))||[];
								console.info(my_shop_list.length);
								my_shop_list.filter(function(item,index){
									if(item.shopId == shopId){
										my_shop_list.splice(index,1);
									}
								});
								that.shops = my_shop_list;
								console.info(my_shop_list.length);
								localStorageUtils.removeParam("my_shop_list");
								localStorageUtils.setParam("my_shop_list", JSON.stringify(my_shop_list));
								mui.toast(result.msg);
							} else {
								mui.toast(result.msg);
								return;
							}
						});
					}
				},"div");
			});
		},
		methods: {
			getShopList:function(){
				var that = this;
				if(localStorageUtils.getParam("my_shop_list")){
					that.shops = mui.parseJSON(localStorageUtils.getParam("my_shop_list"))||[];
					return false;
				}
				muiHelper.muiHelperAjax(null,false, "/CnShopController/app/shop/list", {
					"customberId":that.customber.id,
					"phone":that.customber.phone
				}, function(result) {
					if(result.success) {
						that.shops = result.data;
						//重新设置本地我的店铺列表
						localStorageUtils.removeParam("my_shop_list");
						localStorageUtils.setParam("my_shop_list", JSON.stringify(result.data));
					} else {
						mui.toast(result.msg);
						return;
					}
				});
			},
			addShop: function() {
				if(!member.getMember().phone){
					mui.toast('请先绑定您的手机号!');
					return false;
				}
				mui.openWindow({
					url: "setshop/add_shop.html",
					id: 'add_shop'
				})
			},
			goShopIndex:function(shopName,shopId){
				mui.openWindow({
					url: "setshop/shop_index.html",
					id: 'shop_index',
					extras: {
						shopName:shopName,
				        shopId: shopId
				    }
				})
			}
		}
	});
});

