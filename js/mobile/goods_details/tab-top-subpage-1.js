/*
 *APP商品详情处理逻辑
 */
mui.plusReady(function(){
	var vm = new Vue({
		  el: 'body',
		  data: {
		  	customber: member.getMember(),
		  	commodity:plus.webview.currentWebview().commodity,
		  	map:{},
		  	mapShow:false,
		  	shares:{}
		  },
		  
		  mounted:function(){
		  	
		  },
		  created:function(){
		  	var that= this;
		  	console.info("显示详情的内容:"+JSON.stringify(this.commodity));
	  		that.map = new plus.maps.Map("map");
  			var pcenter = new plus.maps.Point(that.commodity.shopLng,that.commodity.shopLat);
			that.map.centerAndZoom( pcenter, 15 );
			var marker=new plus.maps.Marker(pcenter);
			marker.setIcon('../../images/green_location.png');
			marker.setLabel(that.commodity.commodityName);
			var bubble = new plus.maps.Bubble(that.commodity.commodityDescribe);
			marker.setBubble(bubble);
			that.map.addOverlay(marker);
			
		  },
		  methods:{
		  	goMap:function(){
		  		if(this.mapShow = !this.mapShow){
		  			this.map.hide();
		  		}else{
		  			this.map.show();
		  		}
		  	},
		  	goPosition:function(){
		  		mui.openWindow({
		  			url:"goods_position_details.html",
		  			id:"goods_position_details.html"
		  		})
		  		
		  	}
		  },
		  computed:{
		  	commodityMainImg:function(){
		  		if(this.commodity.sampleImgUrl){
		  			if(this.commodity.sampleImgUrl.indexOf("http://")<0){
		  				return RemoteHostResource+this.commodity.sampleImgUrl;
		  			}else{
		  				return this.commodity.sampleImgUrl;
		  			}
		  		}else if(this.commodity.customCommodityUrl){
		  			return this.commodity.customCommodityUrl;
		  		}else{
		  			return '../../images/commodity-sample/no.png';
		  		}
		  	}
		  }
	});
})
