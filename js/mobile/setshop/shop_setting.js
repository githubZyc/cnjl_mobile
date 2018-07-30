/*
 *APP店铺设置页面处理逻辑
 */
var vm ={};
mui.plusReady(function(){
	vm = new Vue({
		  el: 'body',
		  data: {
		  	customber: member.getMember(),
		  	shopId:plus.webview.currentWebview().shopId,
		  	shopName:plus.webview.currentWebview().shopName,
		  	shop:{},
		  	payPicker:{}, //是否支持在平台支付付款
		  	isRead:true,
		  	isUploadIdCard:false,
		  	isUploadBusinessLicense:false,
		  	isUploadFootCard:false
		  },
		  created:function(){
			  	var that = this;
			  	muiHelper.muiHelperAjax(null, true, "/CnShopController/app/shop/detail", {"customberId":this.customber.id,"shopId":this.shopId}, function(result) {
					if(result.success) {
						that.shop = result.data;
					} else {
						mui.toast(result.msg);
						return;
					}
				});
				that.payPicker = new mui.PopPicker();
				that.payPicker.setData([{
					value: 1,
					text: '是'
				}, {
					value: 0,
					text: '否'
				}]);
				//是否阅读协议
				mui('.mui-checkbox').on('change', 'input', function() {
					that.isRead = this.checked;
				});
		  },
		  computed:{
		  	isUploadIdCard:function(){
		  		if(this.shop.cIdOppositeUrl&&this.shop.cIdPositiveUrl){
		  			return true;
		  		}else{
		  			return false;
		  		}
		  	},
		  	isUploadBusinessLicense:function(){
		  		if(this.shop.businessLicense){
		  			return true;
		  		}else{
		  			return false;
		  		}
		  	},
		  	isUploadFootCard:function(){
		  		if(this.shop.foodCard){
		  			return true;
		  		}else{
		  			return false;
		  		}
		  	},
		  	isAddCorporationPhone:function(){
		  		if(this.shop.corporationPhone){
		  			return true;
		  		}else{
		  			return false;
		  		}
		  	},
		  	isAddFinancePhone:function(){
		  		if(this.shop.financePhone){
		  			return true;
		  		}else{
		  			return false;
		  		}
		  	}
		  },
		  mounted:function(){
		  	
		  },
		  methods:{
		  	goServiceterm:function(){
				//進入服务条款页面
				mui.openWindow({
					url: "/mobile/mycenter/service_term.html",
					id: "service_term"
				});
			},
		  	goManageShopAdmin:function(){
		  		mui.openWindow({
					url: "manage_person_list.html",
					id: "manage_person_list",
					extras:{
						shop:this.shop
					}
				});
		  	},
		  	goPosition:function(){
		  		mui.openWindow({
					url: "business_position.html",
					id: "business_position",
					extras:{
						shop:this.shop
					}
				});
		  	},
		  	goFoodCard:function(){
		  		mui.openWindow({
					url: "upload_foodcard.html",
					id: "upload_foodcard",
					extras:{
						shop:this.shop
					}
				});
		  	},
		  	goBusinessLicense:function(){
		  		mui.openWindow({
					url: "upload_business_license.html",
					id: "upload_business_license",
					extras:{
						shop:this.shop
					}
				});
		  	},
		  	goUpLoadIdCard:function(){
		  		mui.openWindow({
					url: "upload_idcard.html",
					id: "upload_idcard",
					extras:{
						shop:this.shop
					}
				});
		  	},
		  	goValidCorporationPhone:function(corporationPhone){
		  		if(!corporationPhone){
		  			mui.openWindow({
						url: "../mycenter/tel_edit.html",
						id: "tel_edit",
						extras:{
							shopId:this.shopId,
							validCorporationPhone:true
						}
					});
		  		}else{
		  			mui.toast('您已设置法人手机号!');
		  		}
		  	},
		  	goValidFinancePhone:function(financePhone){
		  		if(!financePhone){
		  			mui.openWindow({
						url: "../mycenter/tel_edit.html",
						id: "tel_edit",
						extras:{
							shopId:this.shopId,
							validFinancePhone:true
						}
					});
		  		}else{
		  			mui.toast('您已设置财务手机号!');
		  		}
		  	},
		  	showPayChoose:function(){
		  		var that = this;
		  		that.payPicker.show(function(items) {
					$("#isOnlinePay").val(items[0].text);
					that.shop.isOnlinePay = items[0].value;
					return true;
				});
		  	},
		  	saveShopSetting:function(){
		  		var that = this;
		  		if(!that.isRead){
		  			mui.toast('请确认已阅读用户服务条款');
		  			return false;
		  		}
		  		var data={
		  			"shopName":$("#shopName").val().trim(),
		  			"corporateName":$("#corporateName").val().trim(),
		  			"corporationName":$("#corporationName").val().trim(),
		  			"shopArea":$("#shopArea").val().trim(),
		  			"scopeOfOperation":$("#scopeOfOperation").val().trim(),
		  			"distributionScope":$("#distributionScope").val().trim(),
		  			"distributionPrice":$("#distributionPrice").val().trim(),
		  			"isOnlinePay":that.shop.isOnlinePay,
		  			"financeName":$("#financeName").val().trim(),
		  			"financeAliPayNumber":$("#financeAliPayNumber").val().trim(),
		  			"customberId":that.customber.id,
		  			"shopId":that.shopId,
		  			"shopAddress":that.shop.shopAddress,
		  			"lat":that.shop.lat,
		  			"lng":that.shop.lng
		  		};
		  		console.info("添加商品参数:"+JSON.stringify(data));
				muiHelper.muiHelperAjax(null, true, "/CnShopController/app/shop/update", data, function(result) {
					if(result.success) {
						that.shop = result.data;
						mui.toast(result.msg);
						plus.webview.close("shop_setting","",300);
					} else {
						mui.toast(result.msg);
						return;
					}
				});
		  	}
		  },
		  watch:{
		  	
		  }
	});
});
//更新身份证上传状态
function updateUploadStatus(shop){
	var tempShop = mui.parseJSON(shop);
	vm.$data.shop.cIdOppositeUrl = tempShop.cIdOppositeUrl;
	vm.$data.shop.cIdPositiveUrl = tempShop.cIdPositiveUrl;
}
//更新营业执照上传状态
function updateBLUploadStatus(shop){
	var tempShop = mui.parseJSON(shop);
	vm.$data.shop.businessLicense = tempShop.businessLicense;
}
//更新食物流通许可证上传状态
function updateFCUploadStatus(shop){
	var tempShop = mui.parseJSON(shop);
	vm.$data.shop.foodCard = tempShop.foodCard;
}
//更新门店位置区域
function updateShopPostion(postion){
	var tempShop = mui.parseJSON(postion);
	vm.$data.shop.shopAddress = tempShop.address+tempShop.name;
	vm.$data.shop.lat = tempShop.point.latitude;
	vm.$data.shop.lng = tempShop.point.longitude;
}
//更新门店法人绑定信息
function updateShopCorporationPhone(shop){
	var tempShop = mui.parseJSON(shop);
	vm.$data.shop.corporationPhone = tempShop.corporationPhone
}
//更新门店财务绑定信息
function updateShopFinancePhone(shop){
	var tempShop = mui.parseJSON(shop);
	vm.$data.shop.financePhone = tempShop.financePhone
}

