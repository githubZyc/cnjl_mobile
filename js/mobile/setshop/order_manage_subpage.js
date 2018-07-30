$('.order-del-btn').on('tap', '.mui-btn', function(event) {

	var elem = this;
	var li = elem.parentNode.parentNode;
	mui.confirm('订单记录删除后，将无法查看此订单详情', '<img src="../../../images/order_manage_12.png" style="display:block;	"/>是否确认删除订单？', ["取消", "确认删除"], function(e) {
		if(e.index == 1) {
			li.parentNode.removeChild(li);
			mui.toast('<img src="../../../images/order_manage_11.png" style="display:block;width:24px;margin:10px auto;"/>订单删除成功', {
				duration: 'short',
				type: 'div'
			});
		}
	}, 'div');
});
$('.order-sure-btn').on('tap', '.mui-btn:first-child', function(event) {
	mui.openWindow({
		url: "chargeback.html",
		id: "chargeback.html"
	})
});
$('.order-sure-btn').on('tap', '.mui-btn:nth-child(2)', function(event) {
	var elem = this;
	var li = elem.parentNode.parentNode;
	mui.toast('<img src="../../../images/order_manage_11.png" style="display:block;width:24px;margin:10px auto;"/>标签打印成功', {
		duration: 'short',
		type: 'div'
	});
});
//跳详情
$('.shop-goods').on('tap', function(event) {
	mui.openWindow({
		url: "order_details.html",
		id: "order_details",
		extras: {}
	});
});