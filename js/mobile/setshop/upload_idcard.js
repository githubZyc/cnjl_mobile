/*
 *APP门店自定义添加商品--商户身份证正反面
 */
var vm = {};
mui.plusReady(function(){
	vm = new Vue({
		el: 'body',
		data: {
			shop:plus.webview.currentWebview().shop,
			customber:member.getMember(),
			idCardBackBase64:'',
			idCardFrontBase64:''
		},
	  	created:function(){
	  		this.idCardBackBase64 = this.shop.cIdOppositeUrl||'';
			this.idCardFrontBase64 = this.shop.cIdPositiveUrl||'';
	  	},
	  	mounted:function(){
	  		
	  	},
	  	methods:{
		  	idcardFront:function(){
		  		var that = this; 
		  		//自定义选择图片
				muiHelper.uploadImg(function(index) {
					switch(index) {
						case 1:
							muiHelper.byCamera(function(path){
								console.info(path);
								muiHelper.zipImg(path,function(zipPath){
									muiHelper.getBase64(zipPath,function(base64){
										console.info("身份证正面拍照压缩获取成功");
										that.idCardFrontBase64 = base64;
									});
								});
							});
							break;
						case 2:
							muiHelper.byGallery(function(path){
								console.info(path);
								muiHelper.zipImg(path,function(zipPath){
									muiHelper.getBase64(zipPath,function(base64){
										that.idCardFrontBase64 = base64;
										console.info("身份证正面从相册中获取压缩获取成功");
									});
								});
							},{ filter: "image", multiple: false });
							break;
						default:
							break;
						}
				});
		  	},
		  	idcardBack:function(){
		  		var that = this; 
		  		//自定义选择图片
				muiHelper.uploadImg(function(index) {
					switch(index) {
						case 1:
							muiHelper.byCamera(function(path){
								console.info(path);
								muiHelper.zipImg(path,function(zipPath){
									muiHelper.getBase64(zipPath,function(base64){
										that.idCardBackBase64 = base64;
										console.info("身份证反面拍照压缩获取成功");
									});
								});
							});
							break;
						case 2:
							muiHelper.byGallery(function(path){
								console.info(path);
								muiHelper.zipImg(path,function(zipPath){
									muiHelper.getBase64(zipPath,function(base64){
										that.idCardBackBase64 = base64;
										console.info("身份证反面从相册中获取压缩获取成功");
									});
								});
							},{ filter: "image", multiple: false });
							break;
						default:
							break;
						}
				});
		  	},
		  	uploadIdCard:function(){
		  		
		  		var that = this; 
		  		if(!that.idCardBackBase64){
		  			mui.toast('请选择您的身份证背面照片');
		  			return false;
		  		}
		  		if(!that.idCardFrontBase64){
		  			mui.toast('请选择您的身份证正面照片');
		  			return false;
		  		}
		  		
				//上传到服务器
				muiHelper.muiHelperAjax(null, true, "/CnShopController/app/shop/update", {
					"customberId":that.customber.id,
					"idCardBackBase64":that.idCardBackBase64,
					"idCardFrontBase64":that.idCardFrontBase64,
					"shopId":that.shop.id
				}, function(result) {
					if(result.success) {
						plus.webview.getWebviewById('shop_setting').evalJS("updateUploadStatus('"+JSON.stringify(result.data)+"')");
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
