/*
 *APP门店自定义添加商品--编辑商品信息到商户个人门店商品库页面处理逻辑
 */
var vm = {};
mui.plusReady(function(){
	vm = new Vue({
		el: 'body',
		data: {
			shopId:plus.webview.currentWebview().shopId,
			customber:member.getMember(),
			isActive:true,
			commodityType:{
				code:'01',
				content:'蔬菜'
			},
			commodityImg:{
				commodityMainPicId:'',
				commodityMainPic:"../../images/commodity-sample/no.png"
			}
		},
	  	created:function(){
	  		console.info('编辑页存储的选择的门店id:'+this.shopId);
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
	  			if(this.commodityImg.commodityMainPicId===""){
	  				mui.toast("请上传您的商品图");
	  			 	return false;
	  			}
	  			if(!$("#commodityName").val().trim()){
	  				mui.toast("请输入您的商品名称");
	  			 	return false;
	  			}
	  			if(!$("#unit").val().trim()){
	  				mui.toast("请输入您的商品记重单位");
	  			 	return false;
	  			}
	  			if(!$("#unitPrice").val().trim()){
	  			 	mui.toast("请输入您的商品价格");
	  			 	return false;
	  			}
	  			if(parseInt($("#unitPrice").val().trim())<=0){
	  				mui.toast("请输入您的商品价格");
	  			 	return false;
	  			}
	  			var that = this;
				mui.confirm("确认添加商品?","是否添加",['是','否'],function(e){
					if(e.index==0){
						var data = {
							"commodityDescribe":$("#commodityDescribe").val().trim(),
							"commodityTypeCode":this.commodityType.code,
							"commodityName":$("#commodityName").val().trim(),
							"isOnline": that.isActive ? "0006001" : "0006002",
							"shopId":that.shopId,
							"unit":$("#unit").val().trim(),
							"unitPrice":$("#unitPrice").val().trim(),
							"barCode":$("#barCode").val().trim()||'',
							"customberId":that.customber.id,
							"commodityMainPicId":that.commodityImg.commodityMainPicId
						};
						console.info("添加商品参数:"+JSON.stringify(data));
						muiHelper.muiHelperAjax(null, true, "/CnShopCommodityController/app/shop/commodity/custom/add", data, function(result) {
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
				},'div');
	  		},
		  	addCommodityImage:function(){
		  		var that = this; 
		  		//自定义选择图片
				muiHelper.uploadImg(function(index) {
					switch(index) {
						case 1:
							muiHelper.byCamera(function(path){
								console.info(path);
								muiHelper.zipImg(path,function(zipPath){
									muiHelper.getBase64(zipPath,function(base64){
										that.uploadCommodityMainPic(base64);
									});
								});
							});
							break;
						case 2:
							muiHelper.byGallery(function(path){
								console.info(path);
								muiHelper.zipImg(path,function(zipPath){
									muiHelper.getBase64(zipPath,function(base64){
										that.uploadCommodityMainPic(base64);
									});
								});
							},{ filter: "image", multiple: false });
							break;
						default:
							break;
						}
				});
		  	},
		  	uploadCommodityMainPic:function(base64){
		  		var that = this; 
				console.info(base64);
				//上传到服务器
				muiHelper.muiHelperAjax(null, true, "/CnCustomCommodityMainPicController/app/custom/commodity/main/pic", {
					"customberId":that.customber.id,
					"imageBase64":base64
				}, function(result) {
					if(result.success) {
						that.commodityImg.commodityMainPic = result.data.imageBase64;
						that.commodityImg.commodityMainPicId = result.data.id;
						mui.toast(result.msg);
					} else {
						mui.toast(result.msg);
						return;
					}
				});
									
		  	},
		  	chooseCommodityType:function(){
		  		mui.openWindow({
					url: "custom_add_product_choose.html",
					id: "custom_add_product_choose",
					extras:{
						"webViewId":plus.webview.currentWebview().id
					}
				});
		  	}
	  	}
	});
});
/**
 * 更新自定义商品类别
 * @param {Object} commodityType
 */
function setCode(commodityType){
	vm.$data.commodityType = mui.parseJSON(commodityType);
}
