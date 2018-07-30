/*
 *APP商品详情处理逻辑
 */
mui.plusReady(function(){
	mui.init({
		subpages: [{
			url: 'goods_details_subpage.html',
			id: 'goods_details_subpage',
			styles: {
				top: '61px',
				bottom:"0px"
			},
			extras:{
				commodity:plus.webview.currentWebview().commodity
			}
		}]
	});
	var vm = new Vue({
		  el: 'body',
		  data: {
		  	commodity:plus.webview.currentWebview().commodity,
		  	shares:{}
		  },
		  
		  mounted:function(){
		  	
		  },
		  created:function(){
		  	//获取分享通道
			this.getShareServices();
		  },
		  methods:{
		  	getShareServices:function(){
		  		var that = this;
		  		plus.share.getServices(function(services){
					for(var i in services){
						var channel = services[i];
						that.shares[channel.id]=channel;
					}
				}, function(e){
					mui.toast('获取分享服务列表失败：'+e.message);
				});
		  	},
		  	showShare:function(){
		  		var shareBts = [],
				that = this;
				// 更新分享列表
				var ss = that.shares['weixin'];
				ss && ss.nativeClient && (shareBts.push({
						title: '微信朋友圈',
						s: ss,
						x: 'WXSceneTimeline'
					}),
					shareBts.push({
						title: '微信好友',
						s: ss,
						x: 'WXSceneSession'
					}));
				ss = that.shares['qq'];
				ss && ss.nativeClient && shareBts.push({
					title: 'QQ',
					s: ss
				});
				// 弹出分享列表
				shareBts.length > 0 ? plus.nativeUI.actionSheet({
					title: '分享链接',
					cancel: '取消',
					buttons: shareBts
				}, function(e) {
					(e.index > 0) && that.shareAction(shareBts[e.index - 1], true);
				}) : plus.nativeUI.alert('当前环境无法支持分享链接操作!');
			},
		  	shareAction:function(sb,bh){
		  		var that = this;
				if(!sb||!sb.s){
					return;
				}
				var msg={extra:{scene:sb.x}};
				if(bh){
					msg.href=RemoteHost+"/CnCommodityShareController/share.html?commodityId="+this.commodity.commodityId;
					msg.title = this.commodity.shopName;
					msg.content = this.commodity.commodityName+'\n'+"每"+this.commodity.unit+"只需:"+this.commodity.unitPrice+"元,等你来抢!";
					msg.thumbs=['../../images/about_us_03.png'];
					msg.pictures=[this.commodity.sampleSmallImgUrl];
				}
				console.info(msg.href);
				// 发送分享
				if(sb.s.authenticated){
					that.shareMessage(msg, sb.s);
				}else{
					sb.s.authorize(function(){
						that.shareMessage(msg,sb.s);
					}, function(e){
						console.info('认证授权失败：'+e.code+' - '+e.message);
					});
				}

		  	},
		  	shareMessage:function(msg, s){
		  		s.send(msg, function(){
					console.info('分享到"'+s.description+'"成功！');
				}, function(e){
					console.info('分享到"'+s.description+'"失败: '+JSON.stringify(e));
				});
		  	},
		  },
		  computed:{}
	});
})
