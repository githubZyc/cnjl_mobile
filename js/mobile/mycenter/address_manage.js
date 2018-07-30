/*
 *APP--收货地址管理页面处理逻辑
 */
var vm = {};
mui.plusReady(function(){
	vm = new Vue({
		el: 'body',
		data: {
			customberAddress:[],
			customber:member.getMember()
		},
	  	created:function(){
	  		var that = this;
			muiHelper.muiHelperAjax(null, true, "/CnCustomberAddressController/app/customber/address/list", {
				"customberId":that.customber.id,
			}, function(result) {
				if(result.success) {
					that.customberAddress = result.data;
				} else {
					mui.toast(result.msg);
					return;
				}
			});
	  	},
	  	mounted:function(){
	  	},
	  	methods:{
	  		upd:function(address){
	  			mui.openWindow({
					url: "add_address.html",
					id: "add_address",
					extras: {
						address:address
				    }
				});
	  		},
	  		del:function(address){
	  			mui.confirm('是否删除该地址？', '删除收获地址', ['否', '是'], function (e) {
					if (e.index == 1) {
					muiHelper.muiHelperAjax(null, true, "/CnCustomberAddressController/app/customber/address/dele", {
						"id":address.id,
						}, function(result) {
							if(result.success) {
								plus.webview.currentWebview().reload();
							} else {
								mui.toast(result.msg);
								return;
							}
						});
					}
				},"div");
	  		},
	  		addAddress:function(){
	  			mui.openWindow({
					url: "add_address.html",
					id: "add_address"
				});
	  		}
	  	},
	  	watch:{
	  		
	  	}
	},'div');
});
