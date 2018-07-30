/*
 *APP店铺添加管理员
 */
mui.plusReady(function(){
	var vm = new Vue({
		  el: 'body',
		  data: {
		  	customber: member.getMember(),
		  	shop:plus.webview.currentWebview().shop,
		  	InterValObj: {}, //timer变量，控制时间
			count: 60, //间隔函数，1秒执行
			curCount: 0, //当前剩余秒数
			code: '',
		  },
		  
		  mounted:function(){
		  	
		  },
		  created:function(){
		  	
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
			addAdmin:function(){
				if (!$("#manage-name").val().trim()) {
					mui.toast("请输入管理员名称！");
					return false;
				}
				if (!$("#account").val().trim()) {
					mui.toast("请输入手机号！");
					return false;
				}
				if (!$("#code").val().trim()) {
					mui.toast("请输入验证码！");
					return false;
				}else if($("#code").val().trim().length>4){
					mui.toast("请输入正确的验证码！");
					return false;
				}
				muiHelper.muiHelperAjax(null, true, "/CnShopAdminController/app/shop/admin/add", { "shopAdminPhone": $("#account").val().trim(),"code":$("#code").val().trim(),"shopAdminName":$("#manage-name").val().trim(),"shopId":this.shop.id }, function (result) {
					if (result.success) {
						plus.webview.getWebviewById('manage_person_list').reload();
						plus.webview.close(plus.webview.currentWebview());
					} else {
						mui.toast(result.msg);
					}
				});
			}
		  },
		  computed:{
		  }
	});
});


