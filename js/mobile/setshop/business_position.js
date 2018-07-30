/*
 *APP店铺所在位置获取
 */
var vm = {};
mui.plusReady(function(){
	vm = new Vue({
		  el: 'body',
		  data: {
		  	customber: member.getMember(),
		  	shop:plus.webview.currentWebview().shop,
		  	map:{},
		  	searchMap:{},
		  	pcenter:{},
		  	searchData:[],
		  	nextPage:0,
		  	shopCity:mui.parseJSON(localStorageUtils.getParam("localPosition")).city||'广东',
			isNewKeyWord:false
		  },
		  
		  mounted:function(){
		  	
		  },
		  created:function(){
		  	
		  	var that= this;
		  	console.info("显示门店详情的内容:"+JSON.stringify(this.shop));
	  		setTimeout(function(){
	  			that.map = new plus.maps.Map("map");
				that.pcenter = new plus.maps.Point(that.shop.lng,that.shop.lat);
				that.map.centerAndZoom( that.pcenter, 15 );
				var marker=new plus.maps.Marker(that.pcenter);
				marker.setIcon('../../images/green_location.png');
				marker.setLabel(that.shop.shopName);
				var bubble = new plus.maps.Bubble(that.shop.shopAddress);
				marker.setBubble(bubble);
				that.map.addOverlay(marker);
				that.searchMap = new plus.maps.Search(that.map);
				that.searchMap.onPoiSearchComplete = function(state, result){
					that.searchComplete(state, result);
				};
				that.createSubview();
				that.searchAround();
	  		},100);
	  		
		  },
		  methods:{
		  	showPostionSearch:function(){
		  		plus.webview.getWebviewById('business_position_subpage').evalJS("showPostionSearch()");
		  	},
		  	searchComplete:function(state,result){
		  		if(result.poiList){
		  			plus.webview.getWebviewById('business_position_subpage').evalJS("changeResult('"+JSON.stringify(result.poiList)+"','"+this.isNewKeyWord+"')");
		  		}else{
		  			mui.toast("没有更多喽...");
		  		}
		  		
		  	},
		  	searchAround:function(nextPage,isNewKeyWord){
		  		console.info(nextPage);
		  		this.isNewKeyWord = isNewKeyWord;
				var keyWord =$("#search-place").val().trim()||this.shop.shopAddress;
				console.info(this.shopCity);
				this.searchMap.poiSearchInCity(this.shopCity, keyWord, nextPage );
//		  		this.searchMap.poiSearchNearBy(keyWord,this.pcenter,500,nextPage);
		  	},
		  	createSubview:function(data){
		  		// 创建加载内容窗口
				var wsub = plus.webview.create(
					'business_position_subpage.html',
					'business_position_subpage',
					{	
						top:'315',
						bottom:'0'
					});
				plus.webview.currentWebview().append(wsub);
		  	}
		  },
		  computed:{
		  	
		  },
		  watch:{
		  	nextPage:function(){
		  		this.searchAround(this.nextPage,false);
		  	},
		  }
	});
});
/**
 * 加载更多
 * @param {Object} pageIndex
 */
function loadMore(){
	vm.$data.nextPage+=1;
}
function changeCity(shopCity){
	console.info(shopCity);
	vm.$data.shopCity = shopCity;
}
