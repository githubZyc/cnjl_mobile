/*
 *APP首页 管理通用搜索页面处理逻辑
 */
mui.plusReady(function(){
	var vm=new Vue({
		el:"body",
		data:{
			searchHistory:[],
		},
		created:function(){
			//加载搜索历史
			this.searchHistory = mui.parseJSON(localStorageUtils.getParam("searchHistory"))||[];
		},
		methods:{
			hotWordSerach:function(obj,searchParam){
				$(obj.target).siblings('li').removeClass('select');
				$(obj.target).addClass('select');
				mui.openWindow({
					url:"search.html",
					id:"search",
					extras:{
						searchParam:searchParam
					}
				});
			},
			historySerach:function(history){
				mui.openWindow({
					url:"search.html",
					id:"search",
					extras:{
						searchParam:history
					}
				});
			},
			search:function(){
				var searchParam = $("#searchParam").val().trim();
				if(searchParam){
					var searchHistory = mui.parseJSON(localStorageUtils.getParam("searchHistory"))||[];
					searchHistory.unshift(searchParam);
					localStorageUtils.setParam("searchHistory",JSON.stringify(searchHistory));
				}
				//异步同步热搜词汇
				
				//
				mui.openWindow({
					url:"search.html",
					id:"search",
					extras:{
						searchParam:searchParam
					}
				});
			},
			clearHistory:function(){
				localStorageUtils.removeParam("searchHistory");
				this.searchHistory = [];
			}
		}
	});
});

