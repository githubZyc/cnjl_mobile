/*
 *APP首页 管理首页子页面处理逻辑
 */
var vm ={};
mui.plusReady(function(){
	///////////////////////初始化构造器/////////////////////////
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				auto:true,
				style:'circle',
				color:'#FF4510', //可选，默认“#2BD009” 下拉刷新控件颜色
				callback: downLoad,
				cacheKey:"index_commoditys"
			},
			up: {
				contentup: "上拉可以加载",
				contentrefresh: "正在加载...",
				contentnomore:'没有更多数据了,刷新一下试试看呢?',//可选，请求完毕若没有更多数据时显示的提醒内容；
				callback: upLoad
			}
		}
	});
	vm = new Vue({
		el:"body",
		data:{
			localPosition:{},
			pageNo:1,
			commoditys:[],
			myPosition:{}
		},
		created:function(){
			this.initData();
		},
		methods:{
			initData:function(){
				this.commoditys = mui.parseJSON(localStorageUtils.getParam("index_commoditys"))||[];
				this.localPosition = mui.parseJSON(localStorageUtils.getParam("localPosition"))||[];
				this.imgLazyLoad();
			},
			imgLazyLoad:function(){
				setTimeout(function(){
			  		new LazyLoadImg({
				  		el: document.querySelector('#ul-list'),
				        error: function (el) { // 图片加载失败执行方法
				          el.src = '../../images/commodity-sample/no.png'
				        }
				  	});
				},300);
		  	},
			showSearch:function(){
				mui.openWindow({
					url:"search/search_common.html",
					id:"search_common",
					show: {
						aniShow: "slide-in-bottom",
						duration: 300
					}
				});
			},
			around4Kilometre:function(){
//		代码错误不需要获取原位置--否则用户每次都是以往位置 if(localStorageUtils.getParam("myPosition")){
//					this.around4KilometreList();
//					return false;
//				}
				//当前位置信息
		  		plus.geolocation.getCurrentPosition(function(p){
		  			console.info("当前定位对象:"+JSON.stringify(p));
		  			vm.$data.localPosition = p.address;
		  			vm.$data.myPosition = p.coords;
		  			//设置在本地
		  			vm.$options.methods.around4KilometreList();
		  			localStorageUtils.removeParam("myPosition");
		  			localStorageUtils.removeParam("localPosition");
		  			localStorageUtils.setParam("myPosition",JSON.stringify(vm.$data.myPosition));
					localStorageUtils.setParam("localPosition",JSON.stringify(vm.$data.localPosition));
				}, function(e){
					mui.toast('当前位置获取失败' + e.message);
				});
				
				
			},
			around4KilometreList:function(){
				muiHelper.muiHelperAjax("", false, "/CnIndexController/app/commodity/list", {
					"pageNo":vm.$data.pageNo,
					"lat":vm.$data.myPosition.latitude||mui.parseJSON(localStorageUtils.getParam("myPosition")).latitude,
			  		"lng":vm.$data.myPosition.longitude||mui.parseJSON(localStorageUtils.getParam("myPosition")).longitude
				}, function(result) {
					//数据组装
					var applyNewPage = result.content&&result.content.filter(function(item,index){
						if(item.sampleImgUrl){
							
							item.sampleImgUrl = RemoteHostResource + item.sampleImgUrl;
							item.sampleSmallImgUrl = RemoteHostResource + item.sampleSmallImgUrl;
							
						}
						if(!item.sampleImgUrl&&!item.customCommodityUrl){
							//都不存在商品主图时设置默认图
							item.sampleImgUrl='../images/commodity-sample/no.png';
							item.sampleSmallImgUrl ='../images/commodity-sample/no.png';
						}
						if(item.distance>1000){
							item.distance=(item.distance/1000).toFixed(2)+'km';
						}else{
							item.distance= item.distance+'m';
						}
						
						return item
					});
					//刷新
					if(vm.$data.pageNo ===1){
						if(result.totalPageNo>=1) {
							vm.$data.commoditys = applyNewPage;
						} else {
							mui.toast(result.msg);
						}
						muiHelper.muiHelperEndPulldownToRefresh("pullrefresh");
						setTimeout(function(){
							localStorageUtils.setParam("index_commoditys",JSON.stringify(applyNewPage));},
						300);
					}else{
						//加载
						vm.$data.commoditys.push.apply(vm.$data.commoditys,applyNewPage);
						if(result.totalPageNo>vm.$data.pageNo) {
							muiHelper.muiHelperEndPullupToRefresh("pullrefresh",false);
						}else{
							muiHelper.muiHelperEndPullupToRefresh("pullrefresh",true);
						}
					}
					vm.$options.methods.imgLazyLoad();
				});
			},
			selectLocalPosition:function(){
				
			},
			goCommodityDetal:function(commodity){
//				mui.openWindow({
//					url:"setshop/goods_details.html",
//					id:"goods_details",
//					extras:{
//						commodity:commodity
//					}
//				});
				mui.openWindow({
					url:"goods_details/goods_details_main.html",
					id:"goods_details_main",
					extras:{
						commodity:commodity
					}
				});
			},
			goSearchList:function(typeCode){
				mui.openWindow({
					url:"search/search_list.html",
					id:"search_list",
					extras:{
						commodityTypeCode:typeCode
					}
				});
			}
		}
	});
	
	
	///////////////////////下拉刷新函数/////////////////////////
	function downLoad() {
		setTimeout(function(){
			vm.$options.methods.around4Kilometre(vm.$data.pageNo=1);
		},300);
	}
	///////////////////////上拉加载函数/////////////////////////
	function upLoad() {
		setTimeout(function(){
			vm.$options.methods.around4Kilometre(vm.$data.pageNo+=1);
		},300);
	}
	
	
});
