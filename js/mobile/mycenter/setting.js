/*
 *APP登录 管理个人中心处理逻辑
 */
mui.plusReady(function() {
	var vm = new Vue({
		el: 'body',
		data: {
			customber:member.getMember(),
			localCacheNumber:''
		},
		created: function() {
		},
		methods: {
			bytesToSize:function(){
				var localCacheLength = 0;
				localStorageUtils.getAllKeys().forEach(function(item,ind){
					if(item!=='index_commoditys'&&item!=='myPosition'&&item!=='localPosition'){
						if(localStorageUtils.getParam(item).length){
							localCacheLength += localStorageUtils.getParam(item).length;
						}
					}
				});
				if (localCacheLength === 0) return '0 B';
			        var k = 1024;
			        sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
			        i = Math.floor(Math.log(localCacheLength) / Math.log(k));
				this.localCacheNumber = (localCacheLength / Math.pow(k, i)) + ' ' + sizes[i];
			},
			clearStorage:function(){
				localStorageUtils.getAllKeys().forEach(function(item,ind){
					if(item!=='customber'&&item!=='index_commoditys'&&item!=='myPosition'&&item!=='localPosition'){
						localStorageUtils.removeParam(item);
					}
				});
				mui.toast('清理完成');
			},
			goMessageSetting:function(){
				//進入消息设置页面/
				mui.openWindow({
					url: "message_setting.html", 
					id: "message_setting"
				});
			},
			goPrivacyStatement:function(){
				//進入隐私声明页面
				mui.openWindow({
					url: "privacy_statement.html",
					id: "privacy_statement"
				});
			},
			goServiceterm:function(){
				//進入服务条款页面
				mui.openWindow({
					url: "service_term.html",
					id: "service_term"
				});
			},
			exitLogon:function(){
				mui.confirm('是否退出登录?', '退出登录', ['否', '是'], function (e) {
					if (e.index == 1) {
						//第三方登录退出
						if(otherLogin.auths){
							otherLogin.logoutAll();
						}
						//清空用户登录的信息--保留首页商品
						//localStorageUtils.clear();
						localStorageUtils.getAllKeys().forEach(function(item,ind){
							if(item!=='index_commoditys'&&item!=='myPosition'&&item!=='localPosition'){
								localStorageUtils.removeParam(item);
							}
						});
						plus.runtime.restart();
					}
				},"div");
			}
		}
	});
});
