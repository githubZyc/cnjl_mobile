/*
 *APP首页 管理首页处理逻辑
 */

mui.plusReady(function() {
	///////////////////////初始化子页面构造器/////////////////////////
	mui.init({
		subpages: [{
			url: 'index_subpage.html',
			id: 'index_subpage',
			styles: {
				top: '0px',
				bottom: '0px'
			}
		}]
	});
});