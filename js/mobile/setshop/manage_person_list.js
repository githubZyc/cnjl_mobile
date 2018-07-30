/*
 *APP店铺操作管理员
 */
mui.plusReady(function(){
	var vm = new Vue({
		  el: 'body',
		  data: {
		  	customber: member.getMember(),
		  	shop:plus.webview.currentWebview().shop,
		  	pageNo:1,
		  	pageCount:20,
		  	shopAdminList:[],
		  	
		  },
		  
		  mounted:function(){
		  	
		  },
		  created:function(){
		  	this.loadShopAdminList();
		  },
		  methods:{
		  	addManagePerson:function(){
		  		mui.openWindow({
					url: "add_manage_person.html",
					id: "add_manage_person",
					extras:{
						shop:this.shop
					}
				});
		  	},
		  	delThis:function(obj,shopAdmin){
		  		var that = this;
		  		var btnArray = ['确认', '取消'];
		  		mui.confirm('确认删除该条记录？','', btnArray, function(e) {
					if(e.index == 0) {
						muiHelper.muiHelperAjax(null, true, "/CnShopAdminController/app/shop/admin/del", {"shopAdminId":shopAdmin.id}, function(result) {
							if(result.success){
								var elem = obj.target;
								var li = elem.parentNode.parentNode;
								li.parentNode.removeChild(li);
								that.shopAdminList.removeByValue(shopAdmin);
							}
						});
					}
				},'div');
				
		  	},
		  	showDel:function(){
				$(".mui-table-view-cell").toggleClass("edit-css");
				if($(".mui-table-view-cell").hasClass("edit-css")){
					$(".mui-bar button").html("完成");
					$(".add-btn button").html("删除所选管理人员");
				}else{
					$(".mui-bar button").html("编辑");		
					$(".add-btn button").html("添加管理人员");		
				}
		  	},
		  	loadShopAdminList:function(){
		  		var that = this;
			  	var data = {
			  		"shopId":this.shop.id,
			  		"pageNo":this.pageNo,
			  		"pageCount":this.pageCount
			  	};
			  	muiHelper.muiHelperAjax(null, true, "/CnShopAdminController/app/shop/admin/list", data, function(result) {
					that.shopAdminList = result.content
				});
		  	}
		  },
		  computed:{
		  }
	});
});
