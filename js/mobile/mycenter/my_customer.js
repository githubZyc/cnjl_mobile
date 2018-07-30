/*
 *APP个人中心 我的顾客处理逻辑
 */
mui.plusReady(function() {
	///////////////////////初始化子页面构造器/////////////////////////
	mui.init({
		subpages: [{
			url: 'my_customer_subpage.html',
			id: 'my_customer_subpage',
			styles: {
				top: '65px',
				bottom: '0px'
			}
		}]
	});
});