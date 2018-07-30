/*
 *APP首页 管理首页子页面找回密码
 */
mui.plusReady(function() {
	var vue = new Vue({
		el: ".mui-content",
		data: {
			InterValObj: {}, //timer变量，控制时间
			count: 60, //间隔函数，1秒执行
			curCount: 0, //当前剩余秒数
			code: ''
		},
		methods: {
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
				muiHelper.muiHelperAjax(null, true, "/CnMessageController/app/send/message/find/password", { "phone": $("#account").val().trim() }, function (result) {
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
					$(".code-btn").text( this.curCount + "s");
					$(".code-btn").attr("disabled", "true");
				}
			},
			findPassword: function findPassword() {
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
				var data = {
					"phone": $("#account").val().trim(),
					"code": $("#code").val().trim(),
					"password": $.md5($("#password").val().trim()),
					"rePassword": $.md5($("#password-again").val().trim())
				};
				muiHelper.muiHelperAjax(null, true, "/CnCustomberController/app/find/password", data, function (result) {
					if (result.success) {
						mui.toast(result.msg);
						plus.webview.hide("find_password", "slide-out-bottom", 300);
					} else {
						mui.toast(result.msg);
					}
				});
			}
		}
	});
})