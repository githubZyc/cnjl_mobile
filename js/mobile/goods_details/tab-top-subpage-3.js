/*
 *APP商品菜谱列表处理逻辑
 */
mui.plusReady(function(){
	var vm = new Vue({
		  el: 'body',
		  data: {
		  	customber: member.getMember(),
		  	commodity:plus.webview.currentWebview().commodity,
		  	cookMenus:{}
		  },
		  
		  mounted:function(){
		  	
		  },
		  created:function(){
		  	this.cookMenuList(this.commodity.commodityName);
		  },
		  methods:{
		  	imgLazyLoad:function(){
		  		new LazyLoadImg({
			  		el: document.querySelector('#ul-list'),
			        error: function (el) { // 图片加载失败执行方法
			          el.src = '../../images/commodity-sample/no.png'
			        }
			  	});
		  	},
		  	cookMenuList:function(commodityName){
		  		var that = this;
		  		muiHelper.muiHelperAjax(null, true, "/CnCookMenuController/app/cook/menu/list", { "commodityName": commodityName }, function (result) {
					if (result.success) {
						that.cookMenus = result.data;
						if(that.cookMenus.length>0){
							setTimeout(function(){
								that.imgLazyLoad();
							},200);
						}
					} 
				});
		  	},
		  	goCookMenDetail:function(cookMenu){
		  		mui.openWindow({
					url:"../cookbook/cookbook_details.html",
					id:"cookbook_details",
					show: {
						aniShow: "slide-in-bottom",
						duration: 300
					},
					extras:{
						cookMenu:cookMenu
					}
				});
		  	}
		  },
		  computed:{}
	});
})
