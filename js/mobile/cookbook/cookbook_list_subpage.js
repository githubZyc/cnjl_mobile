/*
 *APP首页 菜谱列表页面处理逻辑
 */
var vm = {};
mui.plusReady(function() {
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				auto: false,
				style: 'circle',
				color: '#FF4510', //可选，默认“#2BD009” 下拉刷新控件颜色
				callback: downLoad
			},
			up: {
				contentrefresh: '正在加载...',
				callback: upLoad
			}
		}
	});
	vm = new Vue({
		el: "body",
		data: {
			commoditys: [],
			pageNo: 1,
			commodityTypeCode:'',
			orderBy: 'createTime,desc'
		},
		created: function() {},
		methods: {
			goCommodityDetal: function(commodity) {
//				mui.openWindow({
//					url: "../setshop/goods_details.html",
//					id: "goods_details",
//					extras: {
//						commodity: commodity
//					}
//				});
			},
			showCommodity: function() {
				muiHelper.muiHelperAjax(null, false, "/CnShopCommodityController/app/shop/commodity/search/list", {
					"lat": mui.parseJSON(localStorageUtils.getParam("myPosition")).latitude,
					"lng": mui.parseJSON(localStorageUtils.getParam("myPosition")).longitude,
					"commodityTypeCode": vm.$data.commodityTypeCode,
					"pageNo": vm.$data.pageNo,
					"pageCount": 10,
					"orderBy": vm.$data.orderBy
				}, function(result) {
					if(vm.$data.pageNo === 1 && !result.content) {
						vm.$data.commoditys = [];
						muiHelper.muiHelperEndPulldownToRefresh("pullrefresh");
					}
					//数据组装
					var applyNewPage = result.content && result.content.filter(function(item, index) {
						if(item.sampleImgUrl) {
							item.sampleImgUrl = RemoteHostResource + item.sampleImgUrl;
						}
						if(!item.sampleImgUrl && !item.customCommodityUrl) {
							//都不存在商品主图时设置默认图
							item.sampleImgUrl = '../images/commodity-sample/no.png';
						}
						if(item.distance > 1000) {
							item.distance = (item.distance / 1000).toFixed(2) + 'km';
						} else {
							item.distance = item.distance + 'm';
						}

						return item
					});
					//刷新
					if(vm.$data.pageNo === 1) {
						if(result.totalPageNo >= 1) {
							vm.$data.commoditys = applyNewPage;
						} else {
							mui.toast(result.msg);
						}
						muiHelper.muiHelperEndPulldownToRefresh("pullrefresh");
					} else {
						//加载
						vm.$data.commoditys.push.apply(vm.$data.commoditys, applyNewPage);
						if(result.totalPageNo > vm.$data.pageNo) {
							muiHelper.muiHelperEndPullupToRefresh("pullrefresh", false);
						} else {
							muiHelper.muiHelperEndPullupToRefresh("pullrefresh", true);
						}
					}
				});
			},
			searchByTypeCode: function(commodityTypeCode) {
				vm.$data.commodityTypeCode = commodityTypeCode;
				vm.$data.pageNo = 1;
				mui('#pullrefresh').pullRefresh().pulldownLoading();
			},
			orderByThis: function(orderBy) {
				vm.$data.orderBy = orderBy;
				vm.$data.pageNo = 1;
				mui('#pullrefresh').pullRefresh().pulldownLoading();
			}
		},
	});
	///////////////////////下拉刷新函数/////////////////////////
	function downLoad() {
		setTimeout(function() {
			vm.$options.methods.showCommodity(vm.$data.commodityTypeCode, vm.$data.pageNo = 1, '');
		}, 300);
	}
	///////////////////////上拉加载函数/////////////////////////
	function upLoad() {
		setTimeout(function() {
			vm.$options.methods.showCommodity(vm.$data.commodityTypeCode, vm.$data.pageNo += 1, '');
		}, 300);
	}
});
//根据类别查询
function searchByTypeCode(commodityTypeCode){
	vm.$options.methods.searchByTypeCode(commodityTypeCode);
}
//根据条件排序
function orderByThis(orderBy){
	vm.$options.methods.orderByThis(orderBy);
}