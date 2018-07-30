mui.plusReady(function () {
	var vue = new Vue({
		el: ".mui-content",
		data: {
			InterValObj: {}, //timer变量，控制时间
			count: 60, //间隔函数，1秒执行
			curCount: 0, //当前剩余秒数
			code: ''
		},
		methods: {
			goServiceterm:function(){
				//進入服务条款页面
				mui.openWindow({
					url: "/mobile/mycenter/service_term.html",
					id: "service_term"
				});
			},
			sendRegCode: function sendRegCode() {
				var that = this;
				if (!$("#account").val().trim()) {
					mui.toast("请输入手机号！");
					return false;
				} else if (!/^1[3|4|5|7|8][0-9]{9}$/.test($("#account").val().trim())) {
					mui.toast("请输入正确的手机号！");
					return false;
				}
				//设置button效果，开始计时
				that.curCount = that.count;
				muiHelper.muiHelperAjax(null, true, "/CnMessageController/app/send/message/register", { "phone": $("#account").val().trim() }, function (result) {
					if (result.success) {
						that.InterValObj = window.setInterval(that.setRemainTime, 1000); //启动计时器，1秒执行一次
					} else {
						mui.toast(result.msg);
					}
				});
			},
			setRemainTime: function setRemainTime() {
				if (this.curCount == 0) {
					window.clearInterval(this.InterValObj); //停止计时器
					$(".code-btn").removeAttr("disabled"); //启用按钮
					$(".code-btn").text("发送验证码");
				} else {
					this.curCount--;
					$(".code-btn").text(this.curCount + "s");
					$(".code-btn").attr("disabled", "true");
				}
			},
			register: function register() {
				var that = this;
				if (!$("#account").val().trim()) {
					mui.toast("请输入手机号！");
					return false;
				} else if (!/^1[3|4|5|7|8][0-9]{9}$/.test($("#account").val().trim())) {
					mui.toast("请输入正确的手机号！");
					return false;
				}
				if (!$("#code").val().trim()) {
					mui.toast("请输入验证码！");
					return false;
				}else if($("#code").val().trim().length>4){
					mui.toast("请输入正确的验证码！");
					return false;
				}
				if (!$("#password").val().trim()) {
					mui.toast("请输入密码！");
					return false;
				}
				if (!$("#password-again").val().trim()) {
					mui.toast("请再次输入密码！");
					return false;
				}
				if ($("#password").val().trim() !== $("#password-again").val().trim()) {
					mui.toast("两次输入密码不同！");
					return false;
				}
				
				if($("#city-partners").val().trim()){
					if (!/^1[3|4|5|7|8][0-9]{9}$/.test($("#city-partners").val().trim())) {
						mui.toast("请输入正确的合伙人手机号！");
						return false;
					}
				}
				
				
				plus.nativeUI.showWaiting("请稍后...");
				var data = {
					"phone": $("#account").val().trim(),
					"code": $("#code").val().trim(),
					"password": $("#password").val().trim(),
					"rePassword": $("#password-again").val().trim(),
					"cityPartners": $("#city-partners").val().trim()
					
				};
				muiHelper.muiHelperAjax(null, true, "/CnCustomberController/app/register/customber", data, function (result) {
					if (result.success) {
						mui.toast(result.msg);
						localStorageUtils.setParam("customber", JSON.stringify(result.data));
						plus.webview.getWebviewById('my_center_subpage').reload();
						plus.webview.close(plus.webview.currentWebview(),"slide-out-bottom", 300);
						// 说是没有起作用，改成 close plus.webview.hide("register", "slide-out-bottom", 300);
					} else {
						plus.nativeUI.closeWaiting();
						mui.toast(result.msg);
					}
				});
			},
			otherRegister:  function otherRegister(id) {
				plus.nativeUI.showWaiting("请稍后...");
				otherLogin.getServices(function(auths){
					otherLogin.login(auths[id],function(auth){
						otherLogin.userInfo(auth,function(userInfo){
							if (userInfo) {
								muiHelper.muiHelperAjax(null, true, "/CnCustomberController/app/other/register/customber", {
									loginType: id,
									token: userInfo.authResult.openid,
									customberName: userInfo.userInfo.nickname,
									headImgurl: userInfo.userInfo.headimgurl,
									phone: userInfo.phonenumber || '',
									sex: userInfo.userInfo.sex || 1
								}, function (result) {
									if (result.success) {
										plus.nativeUI.closeWaiting();
										localStorageUtils.setParam("customber", JSON.stringify(result.data));
										plus.webview.getWebviewById('my_center_subpage').reload();
										mui.toast(result.msg);
										plus.webview.hide("register", "slide-out-bottom", 300);
									} else {
										plus.nativeUI.closeWaiting();
										mui.toast(result.msg);
									}
								});
							}
						});
					});
				});
			}
		}
	});
});