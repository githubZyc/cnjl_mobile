/*
 *APP菜谱详情处理逻辑
 */
mui.plusReady(function(){
	var vm = new Vue({
		  el: 'body',
		  data: {
		  	customber: member.getMember(),
		  	cookMenu:plus.webview.currentWebview().cookMenu,
		  	cookMenuDetail:{},
		  	cookMenuStepList:[]
		  },
		  
		  mounted:function(){
		  	
		  },
		  created:function(){
		  	console.info("菜谱详细:"+JSON.stringify(this.cookMenu));
		  	this.showCookMenuDetail(this.cookMenu.id);
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
		  	showCookMenuDetail:function(cookMenuId){
		  		var that = this;
		  		muiHelper.muiHelperAjax(null, true, "/CnCookMenuController/app/cook/menu/detail", { "cookMenuId": cookMenuId }, function (result) {
					if (result.success) {
						that.cookMenuDetail = result.data.cookMenu;
						that.cookMenuStepList = result.data.cookMenuStepList;
						if(that.cookMenuStepList.length>0){
							setTimeout(function(){
								that.imgLazyLoad();
							},200);
						}
					} 
				});
		  	},
		  	showPreviewImage:function(ind){
		  		var images = [];
		  		this.cookMenuStepList.filter(function(item,index){
		  			images.push(item.stepPic);
		  		});
		  		plus.nativeUI.previewImage(images,{
		          current: ind,
		          indicator: 'number'
		        });
		  	}
		  },
		  computed:{
		  	mainCookList:function(){
		  		var mainCookListTemp = [];
		  		this.cookMenuDetail.main_cook.split(";").filter(function(item,index){
		  			mainCookListTemp.push(item);
		  		});
		  		mainCookListTemp.pop();
		  		return mainCookListTemp;
		  	},
		  	createTime:function(){
		  		return new Date(this.cookMenuDetail.create_time).Format("yyyy-MM-dd hh:mm:ss")
		  	}
		  }
	});
})
