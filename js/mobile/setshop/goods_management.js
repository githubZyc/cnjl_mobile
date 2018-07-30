/*
 *APP我的门店商品管理处理逻辑
 */
mui.plusReady(function(){
	mui.init({
		subpages: [{
			url: 'goods_management_subpage.html',
			id: 'goods_management_subpage.html',
			styles: {
				top: '185px',
				bottom: '0px',
			},
			extras:{
				shopId:plus.webview.currentWebview().shopId
			}
		}]
	});
	var vm = new Vue({
		  el: 'body',
		  data: {
		  	commodityNameOrBarCode:"",
		  },
		  
		  mounted:function(){
		  },
		  created:function(){
		  	var that = this;
		  	$("header .mui-btn").on("tap", function() {
				$(this).toggleClass("btn-type");
				if($(this).hasClass("btn-type")) {
					$("header .mui-btn").text("完成");
				} else {
					$("header .mui-btn").text("编辑");
				}
				plus.webview.getWebviewById('goods_management_subpage.html').evalJS("changeStyle()");
			});
			$('#search-ipt').bind('input propertychange', function() {
				if(!$(this).val().trim()){
					console.info("不存在内容了!");
			  		console.info("触发函数执行:");
		  			plus.webview.getWebviewById('goods_management_subpage.html').evalJS("searchClear()");
				}else{
					//实时更新要搜索的内容
					that.commodityNameOrBarCode = $("#search-ipt").val().trim();
				}
			});
		  },
		  methods:{
		  	isOnline:function(lineCode){
		  		plus.webview.getWebviewById('goods_management_subpage.html').evalJS("isOnline('"+lineCode+"')");
		  	},
		  	byCommodityTypeCode:function(commodityTypeCode){
		  		plus.webview.getWebviewById('goods_management_subpage.html').evalJS("byCommodityTypeCode('"+commodityTypeCode+"')");
		  	},
		  	search:function(){
		  		if(this.commodityNameOrBarCode){
		  			plus.webview.getWebviewById('goods_management_subpage.html').evalJS("search('"+this.commodityNameOrBarCode+"')");
		  		}else{
		  			mui.toast("请输入您要搜索的内容!");
		  		}
		  	}
		  },
		  computed:{
		  	
		  },
		  watch:{
		  }
	});
});
//父页面编辑更改样式
function changeStyle() {
	$("header .mui-btn").text("编辑");
}
