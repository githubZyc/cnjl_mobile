/*
 *APP门店样品库添加商品页面处理逻辑
 */
var vm = {};
mui.plusReady(function(){
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				auto:true,
				style:'circle',
				color:'#FF4510', //可选，默认“#2BD009” 下拉刷新控件颜色
				callback: downLoad,
				cacheKey:"commodity_sample_type_code_list"
			},
			up: {
				contentrefresh: '正在加载...',
				callback: upLoad
			}
		}
	});
	
	vm = new Vue({
		el: 'body',
		data: {
			shopId:plus.webview.currentWebview().shopId,
			commoditySamples:[],
			pageNo:1,
			commodityTypeCode:'01',
			contentId:1, //暂未使用到
			commodityNameOrBarCode:'',
			cacheCommoditySample:{}
		},
	  	created:function(){
	  		setTimeout(function(){
	  			showCommodityByCode('01',1,1);
	  		},500);
	  	},
	  	mounted:function(){},
	  	methods:{
	  		imgLazyLoad:function(){
				setTimeout(function(){
			  		new LazyLoadImg({
				  		el: document.querySelector('#div-list'),
				        error: function (el) { // 图片加载失败执行方法
				          el.src = '../../images/commodity-sample/no.png'
				        }
				  	});
				},300);
		  	},
	  		showCommodity:function(){
				var that = this;
				//if(that.pageNo === 1) mui('#pullrefresh').pullRefresh().pulldownLoading() ;
				muiHelper.muiHelperAjax(null, false, "/CnCommoditySampleController/app/commoditySample/page", {
					"commodityTypeCode":vm.$data.commodityTypeCode,
					"commodityNameOrBarCode":vm.$data.commodityNameOrBarCode,
					"pageNo":vm.$data.pageNo,
					"pageCount":50,
				}, function(result) {
					if(vm.$data.pageNo ==1 && result.totalColumns ==0){
						vm.$data.commoditySamples = [];
						muiHelper.muiHelperEndPulldownToRefresh("pullrefresh");
						return false;
					}
					//数据组装
					var applyNewPage = result.content&&result.content.filter(function(item,index){
						if(item.commoditySampleImgUrl){
							item.commoditySampleImgUrl = RemoteHostResource + item.commoditySampleImgUrl;
							item.sampleSmallImgUrl = RemoteHostResource + item.sampleSmallImgUrl;
						}else{
							item.commoditySampleImgUrl = "../../images/commodity-sample/no.png";
							item.sampleSmallImgUrl = "../../images/commodity-sample/no.png";
						}
						return item
					});
					
					//刷新
					if(vm.$data.pageNo ===1){
						if(result.totalPageNo>=1) {
							console.info("搜索结果-----3----");
							vm.$data.commoditySamples = applyNewPage;
						} else {
							mui.toast(result.msg);
						}
						muiHelper.muiHelperEndPulldownToRefresh("pullrefresh");
						//第一页数据，不存在查询条件是默认存储查询分类的缓存 --- {"01":[],"02":[]}
						if(vm.$data.commodityNameOrBarCode===''){
							//缓存第一页数据
							console.info("写入缓存----");
							var cacheCommoditySample={};
							cacheCommoditySample[vm.$data.commodityTypeCode] = applyNewPage;
							var lastList = mui.parseJSON(localStorageUtils.getParam("commodity_sample_type_code_list"));
							if(lastList){
								cacheCommoditySample = Object.assign(lastList,cacheCommoditySample);
							}
							localStorageUtils.setParam("commodity_sample_type_code_list",JSON.stringify(cacheCommoditySample));
							console.info("目标对象写入缓存------后获取----");
							console.info(JSON.stringify(localStorageUtils.getParam("commodity_sample_type_code_list")));
						}
					}else{
						//加载
						vm.$data.commoditySamples.push.apply(vm.$data.commoditySamples,applyNewPage);
						if(result.totalPageNo>vm.$data.pageNo) {
							muiHelper.muiHelperEndPullupToRefresh("pullrefresh",false);
						}else{
							muiHelper.muiHelperEndPullupToRefresh("pullrefresh",true);
						}
					}
					that.imgLazyLoad();
				});
			},
			goCommodityDetail:function(commoditySample){
				mui.openWindow({
					url:"goods_management_goodsedit.html",
					id:"goods_management_goodsedit",
					extras:{
						shopId:this.shopId,
						commoditySample:commoditySample
					}
				});
			}
	  	}
	});
	///////////////////////下拉刷新函数/////////////////////////
	function downLoad() {
		setTimeout(function(){
			vm.$options.methods.showCommodity(vm.$data.commodityTypeCode,1,vm.$data.pageNo=1);
		},300);
	}
	///////////////////////上拉加载函数/////////////////////////
	function upLoad() {
		setTimeout(function(){
			vm.$options.methods.showCommodity(vm.$data.commodityTypeCode,1,vm.$data.pageNo+=1);
		},300);
	}
});
//根据类别查询
function showCommodityByCode(commodityTypeCode,contentId,pageNo){
	vm.$data.commodityTypeCode = commodityTypeCode;
	vm.$data.pageNo = pageNo;
	var commoditySampleTypeCodeList = mui.parseJSON(localStorageUtils.getParam("commodity_sample_type_code_list"));
	if(commoditySampleTypeCodeList[commodityTypeCode]){
		vm.$data.commoditySamples = commoditySampleTypeCodeList[commodityTypeCode];
		vm.$options.methods.imgLazyLoad();
		muiHelper.muiHelperEndPulldownToRefresh("pullrefresh");
		return false;
	}else{
		mui('#pullrefresh').pullRefresh().pulldownLoading();
		mui('#pullrefresh').pullRefresh().scrollTo(0,0,100);
	}
}
//根据商品名称编号查询
function searchCommodityBy(commodityNameOrBarCode,contentId,pageNo){
	vm.$data.commodityNameOrBarCode = commodityNameOrBarCode;
	vm.$data.pageNo = 1;
	mui('#pullrefresh').pullRefresh().pulldownLoading();
	mui('#pullrefresh').pullRefresh().scrollTo(0,0,100);
}
