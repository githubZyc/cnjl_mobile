/*
 *APP门店自定义添加商品--编辑商品信息到商户个人门店商品库页面处理逻辑
 */
var vm = {};
mui.plusReady(function(){
	vm = new Vue({
		el: 'body',
		data: {
			shopId:plus.webview.currentWebview().shopId,
			commodity:plus.webview.currentWebview().commodity,
			commoditySample:{},
			customber:member.getMember(),
			isActive:true,
			commodityImg:{
				commodityMainPicId:"",
				commodityMainPic:"",
				commoditySampleMainPicId:""
				
			},
			commodityType:{
				code:"",
				content:""
			}
		},
	  	created:function(){
	  		console.info('编辑页存储的选择的门店id:'+this.shopId);
	  		console.info('编辑页存储的选择的门店商品:'+JSON.stringify(this.commodity));
			if(this.commodity.sampleImgUrl){
				this.commodityImg.commodityMainPic = this.commodity.sampleImgUrl;
			}else if(this.commodity.customCommodityUrl){
				this.commodityImg.commodityMainPic = this.commodity.customCommodityUrl;
			}
			this.commodityImg.commodityMainPicId = this.commodity.customCommodityMainPicId;
			this.commodityImg.commoditySampleMainPicId = this.commodity.sampleId;
			this.commodityType.code = this.commodity.code;
			this.commodityType.content = this.commodity.typeCodeContent;
			this.isActive = this.commodity.isOnlie==='0006001';
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
	  			if(this.commodityImg.commodityMainPicId==""&&this.commodityImg.commoditySampleMainPicId==""){
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
	  			mui.confirm("确认修改操作?","是否修改?",['是','否'],function(e){
	  				if(e.index==0){
						var data = {
							"commodityDescribe":$("#commodityDescribe").val().trim(),
							"commodityTypeCode":that.commodityType.code,
							"commodityName":$("#commodityName").val().trim(),
							"isUpOrDown": that.isActive ? "0006001" : "0006002",
							"unit":$("#unit").val().trim(),
							"unitPrice":$("#unitPrice").val().trim(),
							"barCode":$("#barCode").val().trim()||'',
							"customberId":that.customber.id,
							"commoditySampleId":that.commodityImg.commoditySampleMainPicId,
							"commodityMainPicId":that.commodityImg.commodityMainPicId,
							"commodityId":that.commodity.commodityId
						};
						console.info("修改商品参数:"+JSON.stringify(data));
						muiHelper.muiHelperAjax(null, true, "/CnMyShopCommodityController/app/my/shop/commodity/upd", data, function(result) {
							if(result.success) {
								plus.webview.getWebviewById('goods_management_subpage.html').reload();
								mui.toast(result.msg);
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
		  		if(this.commodity.addCommodityTypeCode=="0007002"){
		  			//模板方式添加的商品 不可修改主图
		  			mui.toast("模板商品主图不可修改!");
		  			return false;
		  		}
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
				//上传到服务器
				muiHelper.muiHelperAjax(null, true, "/CnCustomCommodityMainPicController/app/custom/commodity/main/pic", {
					"customberId":that.customber.id,
					"imageBase64":base64,
					
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
		  		if(this.commodity.addCommodityTypeCode=="0007002"){
		  			//模板方式添加的商品 不可修改主图
		  			mui.toast("模板商品类别不可修改!");
		  			return false;
		  		}
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
