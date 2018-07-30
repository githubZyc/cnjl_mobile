/*
 *APP登录 管理登录处理逻辑
 */
$(".login_cont").height($(window).height() - 154);
mui.plusReady(function () {
	var vue = new Vue({
		el:"body",
		data:{},
		methods:{
			login:function(){
				if (!$("#account").val()) {
					mui.toast("请输入手机号!");
					return;
				}
				if (!$("#password").val()) {
					mui.toast("请输入密码!");
					return;
				}
				var data = {
					"phone": $("#account").val(),
					"password": $.md5($("#password").val())
				};
		
				muiHelper.muiHelperAjax(null, true, "/CnCustomberController/app/login", data, function (result) {
					if (result.success) {
						localStorageUtils.setParam("customber", JSON.stringify(result.data));
						plus.nativeUI.closeWaiting();
						mui.toast("欢迎："+localStorageUtils.getParam("customber").customberName+"登录吉犁APP");
						plus.webview.hide("login", "slide-out-bottom", 300);
						$("#password").val("");
						plus.webview.getWebviewById('my_center_subpage').reload();
						plus.webview.getWebviewById('set_shop_subpage').reload();
					} else {
						plus.nativeUI.closeWaiting();
						mui.toast(result.msg);
						return;
					}
				});
	
			},
			otherLogin: function(id){
				plus.nativeUI.showWaiting("请稍后...");
				otherLogin.getServices(function(auths){
					otherLogin.login(auths[id],function(auth){
						otherLogin.userInfo(auth,function(userInfo){
							if (userInfo) {
								muiHelper.muiHelperAjax(null, true, "/CnCustomberController/app/other/login", { loginType: id, token: userInfo.authResult.openid }, function (result) {
									if (result.success) {
										localStorage.removeItem("customber");
										localStorageUtils.setParam("customber", JSON.stringify(result.data));
										plus.nativeUI.closeWaiting();
										mui.toast("欢迎："+localStorageUtils.getParam("customber").customberName+"登录吉犁APP");
										plus.webview.hide("login", "slide-out-bottom", 300);
										//加载我的门店
										plus.webview.getWebviewById('set_shop_subpage').reload();
										//更新个人中心
										plus.webview.getWebviewById('my_center_subpage').reload();
									} else {
										plus.nativeUI.closeWaiting();
										mui.toast(result.msg);
										return;
									}
								});
							}
						});
					});
				});
			},
			goRegister:function(){
				mui.openWindow({
					url: "register.html",
					id: "register"
				});
				plus.webview.hide("login", "slide-out-bottom", 300);
			},
			goFindPassward:function(){
				mui.openWindow({
					url: "find_passward.html",
					id: "find_passward",
					show: {
						aniShow: "slide-in-bottom",
						duration: 300
					}
				});
			}
		}
	});
});