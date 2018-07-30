/*
 *APP我的门店商品管理子页面处理逻辑
 */
var vm = {};
mui.plusReady(function(){
	mui.init({
		pullRefresh : {
	    	container:"#pullrefresh",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		    down : {
		      style:'circle',
		      color:'#FF4510', 
		      auto: true,
		      callback :downLoad 
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
		  	customber:member.getMember(),
		  	pageNo:1,
		  	commoditys:[],
		  	commodityTypeCode:"",
		  	shopId:plus.webview.currentWebview().shopId,
		  	lineCode:"0006001",
		  	desc:"下架选择的商品",
		  	commodityNameOrBarCode:"",
		  	downLineCommoditys:[]
		  },
		  
		  mounted:function(){
		  },
		  created:function(){
		  	
		  },
		  methods:{
		  	goCustomHouse:function(commodity){
		  		mui.openWindow({
					url: "my_shop_commodity_edit.html",
					id: "my_shop_commodity_edit",
					extras:{
						shopId:this.shopId,
						commodity:commodity
					}
				});
		  	},
		  	selectCommoditys:function(){
		  		var that = this;
		  		mui.confirm('确实操作？', that.desc, ['否', '是'], function (e) {
		  			if(e.index == 1){
		  				//选择待下架的商品
					  	var commoditys = [];
						$("input[name='commodity']:checked").each(function(j) { 
						    if (j >= 0) {
						    	commoditys.push($(this).attr("data-commodity"));
						    }
						}); 
						if(commoditys.length>0){
							that.downLineCommoditys = commoditys;
							that.downLine();
						}else{
							mui.toast("请选择您要下架的商品!");
						}
		  			}
		  		},"div");
		  	},
		  	selectCommodity:function(obj){
		  		var that = this;
		  		mui.confirm('确实操作？', that.desc, ['否', '是'], function (e) {
		  			if(e.index == 1){
		  				that.downLineCommoditys[0]= $(obj.target).attr("data-commodity");
		  				that.downLine();
		  			}
		  		},"div");
		  		
		  	},
		  	downLine:function(){
				muiHelper.muiHelperAjax(null, true, "/CnMyShopCommodityController/app/my/shop/commodity/updOnlineOrDown", {
					"customberId":vm.$data.customber.id,
					"isUpOrDown":vm.$data.lineCode==="0006001"?"0006002":"0006001",
					"commodityId":vm.$data.downLineCommoditys.join(",")
				}, function(result) {
					if(result.success){
						mui.toast(result.msg);
						mui('#pullrefresh').pullRefresh().pulldownLoading();
					}
				});
			
		  	},
		  	search:function(commodityNameOrBarCode){
		  		vm.$data.commodityNameOrBarCode = commodityNameOrBarCode;
		  		mui('#pullrefresh').pullRefresh().pulldownLoading();
		  	},
		  	isOnline:function(lineCode){
		  		vm.$data.lineCode = lineCode;
		  		mui('#pullrefresh').pullRefresh().pulldownLoading();
		  	},
		  	byCommodityTypeCode:function(CommodityTypeCode){
		  		vm.$data.commodityTypeCode = CommodityTypeCode;
		  		mui('#pullrefresh').pullRefresh().pulldownLoading();
		  	},
		  	showCommodity:function(){
				muiHelper.muiHelperAjax(null, false, "/CnMyShopCommodityController/app/my/shop/commodity/search/list", {
					"customberId":vm.$data.customber.id,
					"pageNo":vm.$data.pageNo,
					"pageCount":10,
					"shopId":vm.$data.shopId,
					"commodityTypeCode":vm.$data.commodityTypeCode,
					"isOnline":vm.$data.lineCode||"0006001",
					"commodityNameOrBarCode":vm.$data.commodityNameOrBarCode
				}, function(result) {
					if(vm.$data.pageNo === 1&&!result.content){
						vm.$data.commoditys = [];
						muiHelper.muiHelperEndPulldownToRefresh("pullrefresh");
					}
					//数据组装
					var applyNewPage = result.content&&result.content.filter(function(item,index){
						if(item.sampleImgUrl){
							item.sampleImgUrl = RemoteHostResource + item.sampleImgUrl;
						}
						if(!item.sampleImgUrl&&!item.customCommodityUrl){
							//都不存在商品主图时设置默认图
							item.sampleImgUrl='../../images/commodity-sample/no.png';
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
					}else{
						//加载
						vm.$data.commoditys.push.apply(vm.$data.commoditys,applyNewPage);
						if(result.totalPageNo>vm.$data.pageNo) {
							muiHelper.muiHelperEndPullupToRefresh("pullrefresh",false);
						}else{
							muiHelper.muiHelperEndPullupToRefresh("pullrefresh",true);
						}
					}
				});
			},
		  },
		  computed:{
		  	
		  },
		  watch:{
		  	commoditys:function(){
		  		if($(".mui-table-view-cell").hasClass("edit-css")) {
		  			$(".mui-table-view-cell").toggleClass("edit-css",true);
		  			$(".mui-bar.mui-bar-tab").css("display", "block");
		  		}else{
		  			$(".mui-table-view-cell").toggleClass("edit-css",false);
		  			$(".mui-bar.mui-bar-tab").css("display", "none");
		  			plus.webview.currentWebview().parent().evalJS("changeStyle()");
		  		}
		  	},
		  	lineCode:function(){
		  		if(this.lineCode ==="0006001"){
		  			this.desc ="下架选择的商品";
		  		}else{
		  			this.desc ="上架选择的商品";
		  		}
		  	},
		  	
		 }
	});
	
	///////////////////////下拉刷新函数/////////////////////////
	function downLoad() {
		setTimeout(function(){
			vm.$options.methods.showCommodity(vm.$data.pageNo=1);
		},300);
	}
	///////////////////////上拉加载函数/////////////////////////
	function upLoad() {
		setTimeout(function(){
			vm.$options.methods.showCommodity(vm.$data.pageNo+=1);
		},300);
	}
});

//子页面搜索
function search(commodityNameOrBarCode){
	vm.$options.methods.search(commodityNameOrBarCode);
}
function searchClear(){
	vm.$data.commodityNameOrBarCode = "";
}

//子页面上下架切换
function isOnline(lineCode){
	vm.$options.methods.isOnline(lineCode);
}

//子页面切换类型
function byCommodityTypeCode(commodityTypeCode){
	vm.$options.methods.byCommodityTypeCode(commodityTypeCode);
}
//子页面编辑更改样式
function changeStyle() {
	$(".mui-table-view-cell").toggleClass("edit-css");
	if($(".mui-table-view-cell").hasClass("edit-css")) {
		$(".mui-bar.mui-bar-tab").css("display", "block");
	} else {
		$(".mui-bar.mui-bar-tab").css("display", "none");
	}
}