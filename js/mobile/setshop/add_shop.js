/*
 *APP开店子页面处理逻辑
 */
mui.plusReady(function(){
	var vm = new Vue({
		  el: 'body',
		  data: {
		  	customber: member.getMember(),
		  	localPosition:{},
		  	myPosition:''
		  },
		  
		  mounted:function(){
		  },
		  created:function(){
		  	var that = this;
		  	plus.geolocation.getCurrentPosition(function(p){
	  			console.info("当前定位对象:"+JSON.stringify(p));
	  			that.localPosition = p.coords;
	  			that.myPosition = p.addresses;
			}, function(e){
				mui.toast('当前位置获取失败' + e.message);
			});
		  },
		  methods:{
		  	saveShop:function(){
		  		
		  		if(!$("#shop-name").val().trim()){
		  			mui.toast('请输入门店名称!');
		  			return false;
		  		}
		  		
		  		if(!this.customber.phone){
		  			mui.toast('请先绑定您的手机号!');
		  			return false;
		  		}
		  		
		  		var data ={
		  			"customberId":this.customber.id,
		  			"phone":this.customber.phone,
			  		"shopName":$("#shop-name").val().trim(),
			  		"lat":this.localPosition.latitude,
			  		"lng":this.localPosition.longitude,
			  		"shopAddress":this.myPosition
		  		};
		  		
		  		muiHelper.muiHelperAjax(null, true, "/CnShopController/app/shop/add",data, function (result) {
					if (result.success) {
						$("#shop-name").val('');
						//获取存在的门店列表
						var myShops = mui.parseJSON(localStorageUtils.getParam("my_shop_list"))||[];
						myShops.unshift({"shopName":result.data.shopName,"shopId": result.data.id});
						localStorageUtils.removeParam("my_shop_list");
						localStorageUtils.setParam("my_shop_list",JSON.stringify(myShops));
						plus.webview.getWebviewById('set_shop_subpage').reload();
						mui.confirm('是否马上进行设置？', '门店已增加成功！', ['以后再说', '马上设置'], function(e) {
							if(e.index == 1) {
								mui.openWindow({
									url: "shop_index.html",
									id: "shop_index",
									extras: {
										shopName:result.data.shopName,
								        shopId: result.data.id
								    }
								});
							} else {
								plus.webview.hide("add_shop", "slide-out-bottom", 300);
							}
						},'div');
					} else {
						plus.nativeUI.closeWaiting();
						mui.toast(result.msg);
						return;
					}
				});
		  	}
		  }
	});
});

