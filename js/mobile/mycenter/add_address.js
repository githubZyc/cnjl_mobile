/*
 *APP--添加收货地址管理页面处理逻辑
 */
var vm = {};
mui.plusReady(function(){
	vm = new Vue({
		el: 'body',
		data: {
			address:plus.webview.currentWebview().address||{},
			cityAddressObj:{},
			customber:member.getMember(),
			position:"",
			cityAddress:"",
			cityPicker:{},
			isDefault:true,
			tempPostion:""
		},
	  	created:function(){
	  		var that = this;
	  		//当前位置信息
	  		plus.geolocation.getCurrentPosition(function(p){
	  			console.info("当前定位对象:"+JSON.stringify(p));
	  			//that.cityAddressObj = p.address;
	  			that.cityAddress = p.address.province + p.address.city + p.address.district;
	  			that.position = p.address.street + p.address.poiName ;
			}, function(e){
				mui.toast('当前位置获取失败' + e.message);
			});
			//设置手动选择所在区域
			that.cityPicker = new mui.PopPicker({layer: 3});
			that.cityPicker.setData(cityData3);
			//是否默认监听
			mui('.mui-checkbox').on('change', 'input', function() {
				that.isDefault = this.checked;
			});
			//我的位置
//			$("#position").focus( function () {
//				if(that.address.position){that.tempPostion = that.address.position;}
//				that.address.position= null;
//				that.position = null;
//			});
//			
//			$("#position").blur( function () { 
//				if($(this).val().trim()){
//					that.position = $(this).val().trim();
//				}else{
//					that.position = that.tempPostion;
//				}
//			});
	  	},
	  	mounted:function(){
	  	},
	  	methods:{
	  		resetMyPosition:function(){
	  			
	  		},
	  		selectMyPosition:function(){
	  			var that = this;
				that.cityPicker.show(function(items) {
					that.cityAddress = that.getParam(items[0], 'text') + " " + that.getParam(items[1], 'text') + " " + that.getParam(items[2], 'text');
					//选择地址后重置定位的地址
					that.address.cityAddress = null;
					return true;
				});
	  		},
	  		getParam : function(obj, param) {
				return obj[param] || '';
			},
			addAddress:function(){
				var that = this;
				if(!$("#receiver").val().trim()){
					mui.toast('请输入收货人');
					return false;
				}
				if (!$("#phone").val().trim()) {
					mui.toast("请输入手机号！");
					return false;
				} else if (!/^1[3|4|5|7|8][0-9]{9}$/.test($("#phone").val().trim())) {
					mui.toast("请输入正确的手机号！");
					return false;
				}
				if(!$("#cityAddress").val().trim()){
					mui.toast('请选择您所在的区域!');
					return false;
				}
				if(!$("#position").val().trim()){
					mui.toast('请输入您所在的位置!');
					return false;
				}
//				if(!$("#specificAddress").val().trim()){
//					mui.toast('请输入您所在的位置的具体位置!');
//					return false;
//				}
				muiHelper.muiHelperAjax(null, true, "/CnCustomberAddressController/app/customber/address/save", {
					"position":$("#position").val().trim(),
					"phone":$("#phone").val().trim(),
					"cityAddress":$("#cityAddress").val().trim(),
					"customberId":that.customber.id,
					"receiver":$("#receiver").val().trim(),
					"specificAddress":$("#specificAddress").val().trim(),
					"isDefault":that.isDefault,
					"id":that.address.id||''
				}, function(result) {
					if(result.success) {
						mui.toast(result.msg);
						plus.webview.getWebviewById('address_manage').reload();
						$("#phone").val('');
						$("#receiver").val('');
						$("#specificAddress").val('');
						that.address = {};
						plus.webview.close('add_address','',300);
					} else {
						mui.toast(result.msg);
						return;
					}
				});
			}
	  	},
	  	watch:{
	  		
	  	}
	});
});


//$(".save-btn").on("tap",function(){
//	mui.alert('地址添加成功', '<img src="../../images/add_address_03.png" width="45px"/>', ['我知道了'], function() {
//					
//	},"div");
//})
