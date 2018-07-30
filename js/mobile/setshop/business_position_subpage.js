/*
 *APP店铺所在位置获取
 */
var vm = {};
mui.plusReady(function(){
	vm = new Vue({
		  el: 'body',
		  data: {
		  	searchData:[],
		  	cityPicker:{},
		  	shopCity:""
		  },
		  
		  mounted:function(){
		  	
		  },
		  created:function(){
		  		//设置手动选择所在区域
			this.cityPicker = new mui.PopPicker({layer: 3});
			this.cityPicker.setData(cityData3);
		  },
		  methods:{
		  	showPostionSearch:function(){
				vm.$data.cityPicker.show(function(items) {
					vm.$data.shopCity = vm.$options.methods.getParam(items[1], 'text') ;
					plus.webview.currentWebview().parent().evalJS("changeCity('"+vm.$data.shopCity+"')");
					return true;
				});
		  	},
		  	getParam : function(obj, param) {
				return obj[param] || '';
			},
		  	selectThis:function(item){
		  		console.info("选中的门店位置:"+JSON.stringify(item));
		  		plus.webview.getWebviewById('shop_setting').evalJS("updateShopPostion('"+JSON.stringify(item)+"')");
				plus.webview.close(plus.webview.currentWebview().parent());
		  	},
		  	more:function(){
		  		plus.webview.currentWebview().parent().evalJS("loadMore()");
		  	}
		  },
		  computed:{
		  }
	});
});

/**
 * 更改子页面地址列表
 * @param {Object} searchData
 */
function changeResult(searchData,isNewKeyWord){
	console.info("新的关键词:"+isNewKeyWord);
	if(isNewKeyWord=="true"){
		vm.$data.searchData = [];
	}
	vm.$data.searchData.push.apply(vm.$data.searchData,mui.parseJSON(searchData));
}
/**
 * 选择城市区域
 */
function showPostionSearch(){
	vm.$options.methods.showPostionSearch();
}
