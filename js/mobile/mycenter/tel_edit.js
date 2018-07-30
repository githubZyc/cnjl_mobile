/*
 *APP店铺设置验证手机号页面处理逻辑
 */
mui.plusReady(function(){
	var vm = new Vue({
		  el: 'body',
		  data: {
		  	customber: member.getMember(),
		  	shopId: plus.webview.currentWebview().shopId,
		  	validCorporationPhone: plus.webview.currentWebview().validCorporationPhone,
		  	validFinancePhone: plus.webview.currentWebview().validFinancePhone,
		  	validCustomberPhone:plus.webview.currentWebview().validCustomberPhone,
		  	InterValObj: {}, //timer变量，控制时间
			count: 60, //间隔函数，1秒执行
			curCount: 0, //当前剩余秒数
			code: '',
		  },
		  created:function(){
		  },
		  mounted:function(){
		  },
		  methods:{
		  	sendMessageCode: function() {
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
				muiHelper.muiHelperAjax(null, true, "/CnMessageController/app/send/message", { "phone": $("#account").val().trim() }, function (result) {
					if (result.success) {
						that.InterValObj = window.setInterval(that.setRemainTime, 1000); //启动计时器，1秒执行一次
						mui.alert('短信验证码已经发送成功！', '<img src="../../images/code_icon_03.png" width="45px"/>', ['我知道了'], function() {},'div');
					} else {
						mui.toast("服务器开小差喽,稍后重试一下");
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
			sure:function(){
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
				if(that.validCorporationPhone){
					//绑定门店法人手机号验证
					var data = {
						"corporationPhone":$("#account").val().trim(),
						"code":$("#code").val().trim(),
						"customberId":that.customber.id,
		  				"shopId":that.shopId
					};
					this.updateShopBaseInfo(data,'updateShopCorporationPhone');	
					return false;
				}
				
				if(that.validFinancePhone){
					//绑定门店财务手机号验证
					var data = {
						"financePhone":$("#account").val().trim(),
						"code":$("#code").val().trim(),
						"customberId":that.customber.id,
		  				"shopId":that.shopId
					};
					this.updateShopBaseInfo(data,'updateShopFinancePhone');	
					return false;
				}
				
				if(that.validCustomberPhone){
					//修改（绑定）用户手机号
					var customberBaseInfo = {
			  			"customberId":that.customber.id,
			  			"phone":$("#account").val().trim(),
			  			"code":$("#code").val().trim()
			  		};
					muiHelper.muiHelperAjax(null, true, "/CnCustomberController/app/update/customber/phone",customberBaseInfo, function(result) {
						if(result.success) {
							//重新设置登陆者信息
							localStorageUtils.removeParam("customber");
							localStorageUtils.setParam("customber",JSON.stringify(result.data));
							plus.webview.getWebviewById('personal_message').reload();
							plus.webview.close("tel_edit", "slide-out-bottom", 300);
							mui.toast(result.msg);
						} else {
							mui.toast(result.msg);
							return;
						}
					});
				}
			},
			updateShopBaseInfo:function(data,validColumn){
				muiHelper.muiHelperAjax(null, true, "/CnShopController/app/shop/update", data, function (result) {
				if (result.success) {
					mui.toast(result.msg);
					console.info("操作的类型函数:"+validColumn+"('"+JSON.stringify(result.data)+"')");
					plus.webview.getWebviewById('shop_setting').evalJS(validColumn+"('"+JSON.stringify(result.data)+"')");
					plus.webview.close("tel_edit", "slide-out-bottom", 300);
				} else {
					mui.toast(result.msg);
					}
				});
			}
		}
	});
});
