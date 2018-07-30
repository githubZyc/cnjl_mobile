/*
 *APP加载网络页面处理逻辑
 */
var vm ={};
mui.plusReady(function(){
	vm = new Vue({
		el:"body",
		data:{
			commodity:plus.webview.currentWebview().commodity
		},
		created:function(){
			var that = this;
			setTimeout(function(){
				that.openHttpView();
			},300);
		},
		methods:{
			openHttpView:function(){
				var ws = plus.webview.currentWebview();
				var url ="http://192.168.1.128:8083/CNJL/CnCommodityShareController/share.html?commodityId="+this.commodity.commodityId;
				muiHelper.openHttpView(url,ws);
			}
		}
	});
});
