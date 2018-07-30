/*
 *APP登录 管理个人中心处理逻辑
 */
mui.plusReady(function() {
	var vm = new Vue({
		el: 'body',
		data: {
			customber:member.getMember()
		},
		created: function() {
		},
		computed:{
		},
		methods: {
			goPersonalMessage:function(){
				mui.openWindow({
					url: "mycenter/personal_message.html",
					id: "personal_message"
				});
			},
			goAboutUs:function(){
				mui.openWindow({
					url: "mycenter/about_us.html",
					id: "about_us"
				});
			},
			goSystemSet:function(){
				mui.openWindow({
					url: "mycenter/setting.html",
					id: "setting"
				});
			},
			goAddressManager:function(){
				mui.openWindow({
					url: "mycenter/address_manage.html",
					id: "address_manage"
				});
			},
			developing:function developing(){
				mui.toast("开发中···")
			},
			goWallet:function goWallet(){
				mui.openWindow({
					url:"mycenter/my_wallet/my_wallet_index.html",
					id:"mycenter/my_wallet/my_wallet_index.html"
				})
			},
			goRedPacket:function goRedPacket(){
				
			},
			goBalance:function goBalance(){
				
			},
			goCustomerList:function goCustomerList(){
				mui.openWindow({
					url:"mycenter/my_customer.html",
					id:"mycenter/my_customer.html"
				})
			}
		}
	});
});
