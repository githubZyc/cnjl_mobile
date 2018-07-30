/*
 *APP首页 管理通用搜索页面处理逻辑
 */
var vm = {};
mui.plusReady(function(){
	mui.init({
		subpages: [{
			url: 'cookbook_list_subpage.html',
			id: 'cookbook_list_subpage.html',
			styles: {
				top: '100px',
				width: '75%',
				left:'25%'
			}
		}]
	});
	mui('.mui-scroll-wrapper').scroll({
		indicators: false //是否显示滚动条
	});
	vm = new Vue({
		el: "body",
		data: {
			commodityTypeCode: plus.webview.currentWebview().commodityTypeCode || '',
		},
		created: function() {
			var that = this;
			$("#segmentedControls a").each(function(index, item) {
				if(that.commodityTypeCode == $(item).attr("data-code")) $(item).addClass("mui-active");
			});
			setTimeout(function(){
				plus.webview.getWebviewById('search_list_subpage').evalJS("searchByTypeCode('"+that.commodityTypeCode+"')");
			},500);
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
			showSearch: function() {
				mui.openWindow({
					url: "search_common.html",
					id: "search_common",
					show: {
						aniShow: "slide-in-bottom",
						duration: 300
					}
				});
			},
			orderByThis:function(orderBy, obj){
				if($(obj.target).find("i").hasClass("triangle-up")) {
					$(obj.target).find("i").removeClass("triangle-up").addClass("triangle-down");
					orderBy += ",desc";
				} else {
					$(obj.target).find("i").removeClass("triangle-down").addClass("triangle-up");
					orderBy += ",asc";
				}
				plus.webview.getWebviewById('search_list_subpage').evalJS("orderByThis('"+orderBy+"')");
				
			},
			searchByTypeCode:function(commodityTypeCode){
				plus.webview.getWebviewById('search_list_subpage').evalJS("searchByTypeCode('"+commodityTypeCode+"')");
			},
		}
	});
});