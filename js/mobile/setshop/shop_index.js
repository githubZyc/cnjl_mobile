/*
 *APP门店首页页面处理逻辑
 */
mui.plusReady(function(){
	var vm = new Vue({
		  el: 'body',
		  data: {
		  	shopId:plus.webview.currentWebview().shopId,
		  	shopName:plus.webview.currentWebview().shopName,
		  	shops:[],
		  	customber: member.getMember()
		  },
		  created:function(){
			mui('body').on('shown', '#topPopover', function(e) {
				var uip = document.getElementById("topPopover"); //topPopover是popover 的最外层div
				uip.style.transition = "left " + 0.3 + "s";
				mui('.mui-scroll-wrapper').scroll();
			});
		  },
		  methods:{
		  	changeShop:function(){
		  		this.shops = mui.parseJSON(localStorageUtils.getParam("my_shop_list").toString()) ;
		  		mui("#topPopover").popover('show', document.getElementById("header"));
		  	},
		  	goShopIndex:function(selectShopName,selectShopId){
		  		this.shopName = selectShopName;
		  		this.shopId = selectShopId;
		  		mui('#topPopover').popover('hide');
		  	},
		  	goStoreHouse:function(){
		  		mui('#add-shop').popover('hide');
		  		mui.openWindow({
					url: "storehouse_add_goodsclassify.html",
					id: "storehouse_add_goodsclassify",
					extras:{
						shopId:this.shopId
					}
				});
		  	},
		  	goCustomHouse:function(){
		  		mui('#add-shop').popover('hide');
		  		mui.openWindow({
					url: "custom_add_product.html",
					id: "custom_add_product",
					extras:{
						shopId:this.shopId
					}
				});
		  	},
		  	goShopSetting:function(){
		  		mui.openWindow({
					url: "shop_setting.html",
					id: "shop_setting",
					extras:{
						shopId:this.shopId,
						shopName:this.shopName
					}
				});
		  	},
		  	goGoodsManagement:function(){
		  		mui.openWindow({
					url: "goods_management.html",
					id: "goods_management",
					extras:{
						shopId:this.shopId
					}
				});
		  	},
		  	goOrderManagement:function(){
		  		mui.openWindow({
					url: "order_manage/order_manage.html",
					id: "order_manage",
					extras:{
					}
				});
		  	}
		  }
	});
});

