/*
 * 手机App主WebView管理底部tab切换
 */
var vm = {};
mui.plusReady(function () {
	vm = new Vue({
	  el: 'body',
	  data: {
	  	self:plus.webview.currentWebview(),
	  	subpages:['index.html', 'shop_car.html', 'set_shop.html', 'my_center.html'],
	  	subpage_style:{
			top: '0px',
			bottom: '50px'
	  	},
	  	aniShow:{}
	  },
	  
	  mounted:function(){
	  	
	  },
	  created:function(){
	  	this.update();
	  	this.createSubWebView();
	  	this.activeTab();
	  	this.activeIndexTab();
	  },
	  methods:{
	  	activeIndexTab:function(){
	  		//自定义事件，模拟点击“首页选项卡”
			document.addEventListener('gohome', function () {
				var defaultTab = document.getElementById("defaultTab");
				//模拟首页点击
				mui.trigger(defaultTab, 'tap');
				//切换选项卡高亮
				var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active");
				if (defaultTab !== current) {
					current.classList.remove('mui-active');
					defaultTab.classList.add('mui-active');
				}
			});
	  	},
	  	activeTab:function(){
	  		//当前激活选项
			var that = this, activeTab = this.subpages[0];
			var title = document.getElementById("title");
			//选项卡点击事件
			mui('.mui-bar-tab').on('tap', 'a', function (e) {
				var targetTab = this.getAttribute('href'),
				    header = document.querySelector("header");
				if (targetTab !== "index.html") {
					if (!member.isLogin()) {
						mui.openWindow({
							url: "login.html",
							id: "login",
							show: {
								aniShow: "slide-in-bottom",
								duration: 300
							}
						});
						return false;
					}else{
						if(targetTab === "shop_car.html"){
							mui.toast('开发中....');
							return false;
						}
					}
				} else if (targetTab !== "index.html") {
					//记不起来为啥这样写了.....
					header.style.padding = '10px';
					header.style.height = '65px';
				}
				if (targetTab == activeTab) {
					return;
				}
				//更换标题
				title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
				//显示目标选项卡
				//若为iOS平台或非首次显示，则直接显示
				if (mui.os.ios || that.aniShow[targetTab]) {
					plus.webview.show(targetTab);
				} else {
					//否则，使用fade-in动画，且保存变量
					var temp = {};
					temp[targetTab] = "true";
					mui.extend(that.aniShow, temp);
					plus.webview.show(targetTab, "fade-in", 300);
				}
				//隐藏当前;
				plus.webview.hide(activeTab);
				//更改当前活跃的选项卡
				activeTab = targetTab;
			});
	  	},
	  	createSubWebView:function(){
	  		for (var i = 0; i < 4; i++) {
				var temp = {};
				var sub = plus.webview.create(this.subpages[i], this.subpages[i], this.subpage_style);
				if (i > 0) {
					sub.hide();
				} else {
					temp[this.subpages[i]] = "true";
					mui.extend(this.aniShow, temp);
				}
				this.self.append(sub);
			}
	  	},
	  	update:function(){
	  		//更新APP
			muiHelper.muiHelperAjax("",false,"/CnAppUpdateController/app/update",{
				"appId":plus.runtime.appid,
				"apkVersion":plus.runtime.version
			},function(result){
				if(result.data){
					var title = "";
					var titleList = result.data.title.split(";");
					titleList.pop();
					titleList.forEach(function(item,index){
						title+=item+"\n";
					});
					plus.nativeUI.confirm(title, function(event) {
						if (0 == event.index) {
							//用户点击链接下载
							plus.runtime.openURL(result.data.downLoadUrl);
						}
					}, '吉犁APP更新提示', ["立即更新", "取　　消"]);
				}
			});
	  	}
	  },
	  computed:{
	  	
	  }
	});
	
});
