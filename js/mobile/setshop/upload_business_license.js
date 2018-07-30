/*
 *APP门店自定义添加商品--上传营业执照
 */
var vm = {};
mui.plusReady(function(){
	vm = new Vue({
		el: 'body',
		data: {
			shop:plus.webview.currentWebview().shop,
			customber:member.getMember(),
			businessLicenseBase64:'',
		},
	  	created:function(){
	  		this.businessLicenseBase64 = this.shop.businessLicense||'';
	  	},
	  	mounted:function(){
	  		
	  	},
	  	methods:{
		  	idBusiness:function(){
		  		var that = this; 
		  		//自定义选择图片
				muiHelper.uploadImg(function(index) {
					switch(index) {
						case 1:
							muiHelper.byCamera(function(path){
								console.info(path);
								muiHelper.zipImg(path,function(zipPath){
									muiHelper.getBase64(zipPath,function(base64){
										console.info("营业执照压缩获取成功");
										that.businessLicenseBase64 = base64;
									});
								});
							});
							break;
						case 2:
							muiHelper.byGallery(function(path){
								console.info(path);
								muiHelper.zipImg(path,function(zipPath){
									muiHelper.getBase64(zipPath,function(base64){
										that.businessLicenseBase64 = base64;
										console.info("营业执照压缩获取成功");
									});
								});
							},{ filter: "image", multiple: false });
							break;
						default:
							break;
						}
				});
		  	},
		  	uploadBLicense:function(){
		  		
		  		var that = this; 
		  		if(!that.businessLicenseBase64){
		  			mui.toast('请选择您的营业执照');
		  			return false;
		  		}
		  		
				//上传到服务器
				muiHelper.muiHelperAjax(null, true, "/CnShopController/app/shop/update", {
					"customberId":that.customber.id,
					"businessLicenseBase64":that.businessLicenseBase64,
					"shopId":that.shop.id
				}, function(result) {
					if(result.success) {
						plus.webview.getWebviewById('shop_setting').evalJS("updateBLUploadStatus('"+JSON.stringify(result.data)+"')");
						plus.webview.close(plus.webview.currentWebview());
						mui.toast(result.msg);
					} else {
						mui.toast(result.msg);
						return;
					}
				});
		  	},
	  	}
	});
});
