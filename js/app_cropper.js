/*
 *APP图片裁剪页面
 */
mui.plusReady(function() {
	var vue = new Vue({
		el: "body",
		data: {
			zipImg:plus.webview.currentWebview().waitImgUrl,
			base64:""
		},
		created:function(){
		},
		methods: {
			selectImg:function(){
		        var cas=$('#image').cropper('getCroppedCanvas');
		        var base64url=cas.toDataURL('image/jpeg');
		        this.base64 = base64url;
		        plus.webview.getWebviewById('personal_message').evalJS("uploadHeaderImg('"+this.base64+"')");
		        plus.webview.currentWebview().close();
			}
		}
	});
	$('#image').cropper({
       	aspectRatio: 1 / 1,
		viewMode: 1,
		autoCropArea: 0.8,
		cropBoxMovable: false,
		cropBoxResizable: false,
		dragMode: "move",
        crop: function (e) {
            console.log(e);
        }
	});
});