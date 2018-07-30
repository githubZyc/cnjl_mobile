//var RemoteHostResource = "http://www.gileey.cn/CNJL/static";
//var RemoteHost = "http://www.gileey.cn/CNJL";
//var RemoteHostResource = "http://193.112.191.224:8083/CNJL/static";
//var RemoteHost = "http://193.112.191.224:8083/CNJL";
var RemoteHostResource = "http://192.168.1.118:8083/CNJL/static";
var RemoteHost = "http://192.168.1.118:8083/CNJL";
var muiHelper = {
	muiHelperAjax: function muiHelperAjax(id, flag, url, data, callBack) {
		//获取当前网络状态
		if(!muiHelper.getNetWorkState()) {
			mui.toast('似乎已断开与互联网的连接');
			return false;
		}

		//false  是否使用上拉下拉
		console.group("统一请求");
		console.log("需要请求的服务器路径：" + RemoteHost + url);
		console.log("请求的参数：" + JSON.stringify(data));
		console.groupEnd();
		if(flag) {
			muiHelper.showWait();
		}
		try {
			mui.ajax({
				url: RemoteHost + url,
				type: 'post', //HTTP请求类型
				processData: false, //禁用对data的序列化（processData:false）
				headers: {
					'Content-Type': 'application/json'
				},
				data: JSON.stringify(data),
				dataType: 'json', //服务器返回json格式数据
				timeout: 30000, //超时时间设置为30秒钟；
				success: function success(result) {
					muiHelper.DealAjaxResult(flag, result, callBack);
				},
				error: function error(xhr, type, errorThrown) {
					console.info(JSON.stringify(type));
					console.info(JSON.stringify(xhr));
					console.info(JSON.stringify(errorThrown));
					muiHelper.DealError(id, flag);
				}
			});
		} catch(e) {
			console.info(e.message);
		}
	},
	DealAjaxResult: function DealAjaxResult(flag, result, okFun) {
		if(flag) {
			muiHelper.closeWait();
		}
		if(typeof okFun == "function") {
			console.log("请求接口回调的结果:");
			console.log(JSON.stringify(result));
			okFun(result);
		}
	},
	DealError: function DealError(id, flag) {
		if(flag) {
			muiHelper.closeWait();
		} else {
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			mui('#pullrefresh').pullRefresh().refresh(true);
			mui('#pullrefresh').pullRefresh().endPullupToRefresh();
		}
		if(id) {
			document.querySelector("#" + id).innerHTML = "连接出错,<a id='reloadPage' href='javascript:void(0)' >点击重试</a>";
			mui("#" + id).on('tap', "#reloadPage", function() {
				mui('#pullrefresh').pullRefresh().pulldownLoading();
			});
		} else {
			mui.toast("服务器开小差喽,稍后重试一下");
		}
	},
	showWait: function showWait() {
		plus.nativeUI.showWaiting();
	},
	closeWait: function closeWait() {
		plus.nativeUI.closeWaiting();
	},
	uploadImg: function uploadImg(callBack) {
		/**
		 * 从相册中选择
		 */
		var bts = [{
			title: "拍照"
		}, {
			title: "从相册中选择"
		}];
		if(typeof callBack == "function") {
			plus.nativeUI.actionSheet({
				cancel: "取消",
				buttons: bts
			}, function(e) {
				callBack(e.index);
			});
		}
	},
	byGallery: function byGallery(callBack, options) {
		/**
		 * 从相册中获取图片上传
		 */
		plus.gallery.pick(function(path) {
			//返回图片所在路径
			// file:///storage/emulated/0/tencent/MicroMsg/WeiXin/mmexport1528076522726.jpg
			if(typeof callBack == "function") {
				callBack(path);
			}

			return false;
		}, function(error) {
			//mui.toast(error.message);
			mui.toast('用户取消操作');
		}, options);
	},
	byCamera: function byCamera(callBack) {
		var cmr = plus.camera.getCamera();
		cmr.captureImage(function(p) {
			plus.io.resolveLocalFileSystemURL(p, function(entry) {
				if(typeof callBack == "function") {
					callBack(entry.fullPath);
				}
			});
		},function(e){
			mui.toast('用户取消操作');
		});
	},
	zipImg: function(path, callBack) {
		// file:///storage/emulated/0/tencent/MicroMsg/WeiXin/mmexport1528076522726.jpg
		var that = this;
		var name = "_doc/upload/F_ZDDZZ_" + (new Date()).valueOf() + ".jpg"; //拼装唯一图片值  
		plus.zip.compressImage({
				src: path, //src: (String 类型 )压缩转换原始图片的路径  
				dst: name, //压缩转换目标图片的路径  
				quality: 20, //quality: (Number 类型 )压缩图片的质量.取值范围为1-100  
				overwrite: true //overwrite: (Boolean 类型 )覆盖生成新文件  
			},
			function(event) {
				console.log('本地压缩图片成功：' + event.target);
				if(typeof callBack == "function") {
					//显示压缩后的图片
					callBack(event.target);
				}
				//file:///var/mobile/Containers/Data/Application/67789E0B-1848-4491-A225-E25B1C645A26/Documents/Pandora/apps/HBuilder/doc/upload/F_cutOut_1504768316962.jpg
			},
			function(error) {
				plus.nativeUI.toast("压缩图片失败，请稍候再试");
			});

	},
	getBase64: function getBase64(path, callBack) {
		var img = new Image();
		img.src = path; // 传过来的图片路径在这里用。
		img.onload = function() {
			var that = this;
			//生成比例 
			var w = that.width,
				h = that.height;
			//生成canvas
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			$(canvas).attr({
				width: w,
				height: h
			});
			ctx.drawImage(that, 0, 0, w, h);
			var base64 = canvas.toDataURL('image/jpeg', 1 || 0.8); //1最清晰，越低越模糊。有一点不清楚这里明明设置的是jpeg。弹出 base64 开头的一段 data：image/png;却是png。哎开心就好，开心就好
			if(typeof callBack == "function") {
				callBack(base64);
			}
		};
	},
	dateToStr: function dateToStr(time) {
		if(time) {
			var datetime = new Date();
			datetime.setTime(time);
			var year = datetime.getFullYear();
			var month = datetime.getMonth() + 1;
			var date = datetime.getDate();
			var hour = datetime.getHours();
			var minute = datetime.getMinutes();
			var second = datetime.getSeconds();
			var mseconds = datetime.getMilliseconds();
			return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
		}
		return "";
	},
	ultZeroize: function ultZeroize(v, l) {
		var z = "";
		l = l || 2;
		v = String(v);
		for(var i = 0; i < l - v.length; i++) {
			z += "0";
		}
		return z + v;
	},
	/**
	 * 获取当前设备网络环境
	 */
	getNetWorkState: function getNetWorkState() {
		var NetStateStr = '未知';
		var types = {};
		types[plus.networkinfo.CONNECTION_UNKNOW] = "未知";
		types[plus.networkinfo.CONNECTION_NONE] = "未连接网络";
		types[plus.networkinfo.CONNECTION_ETHERNET] = "有线网络";
		types[plus.networkinfo.CONNECTION_WIFI] = "WiFi网络";
		types[plus.networkinfo.CONNECTION_CELL2G] = "2G蜂窝网络";
		types[plus.networkinfo.CONNECTION_CELL3G] = "3G蜂窝网络";
		types[plus.networkinfo.CONNECTION_CELL4G] = "4G蜂窝网络";
		NetStateStr = types[plus.networkinfo.getCurrentType()];
		return NetStateStr === "未知" || NetStateStr === "未连接网络" ? false : true;
	},
	/**
	 * 图片懒加载
	 * @param {Object} obj
	 */
	lazyload: function lazyload(obj) {
		if(obj.getAttribute('data-loaded')) {
			return;
		}
		var image_url = obj.getAttribute('data-lazyload');
		var temp_img = new Image();
		temp_img.src = RemoteHostResource + image_url;
		temp_img.onload = function() {
			obj.setAttribute('src', this.src);
			obj.setAttribute('data-loaded', true);
			obj.classList.add("anim_opacity"); //渐变动画
			return;
		};
	},
	lazyloadNewVersion: function(docm) {
		mui(document).imageLazyload({
			placeholder: '../../images/commodity-sample/no.png'
		});
	},
	/**
	 * 结束刷新操作
	 * @param {Object} id 需要结束的滚动区域
	 */
	muiHelperEndPulldownToRefresh: function muiHelperEndPulldownToRefresh(id) {
		mui("#" + id + "").pullRefresh().endPulldownToRefresh(); //结束刷新
		mui("#" + id + "").pullRefresh().refresh(true); //重置上拉加载
	},
	/**
	 * 结束刷新操作
	 * @param {Object} id 需要结束的滚动区域
	 * @param {Boolean} flag标记是否可以继续加载
	 */
	muiHelperEndPullupToRefresh: function muiHelperEndPullupToRefresh(id, flag) {
		mui("#" + id + "").pullRefresh().endPullupToRefresh(flag); //设置是否存在更多数据
	},
	/**
	 * 
	 * @param {Object} url 加载的http地址
	 * @param {Object} ws 窗口对象
	 */
	openHttpView:function(url,ws){
		var topoffset='44px';
		if(plus.navigator.isImmersedStatusbar()){// 兼容immersed状态栏模式
			topoffset=(Math.round(plus.navigator.getStatusbarHeight())+45)+'px';
		}
		plus.nativeUI.showWaiting('',{style:'black',modal:false,background:'rgba(0,0,0,0)'});
		embed=plus.webview.create(url,'embed',{top:topoffset,bottom:'0px',position:'dock',dock:'bottom',bounce:'vertical'});
		ws.append(embed);
		embed.addEventListener('loaded',function(){
			plus.nativeUI.closeWaiting();
		},false);
		embed.addEventListener('loading',function(){
			plus.nativeUI.showWaiting('',{style:'black',modal:false,background:'rgba(0,0,0,0)'});
		},false);
	}
	
};
/**
 * 本地存储Utils
 */
var localStorageUtils = {
	setParam: function setParam(name, value) {
		if(value) {
			plus.storage.setItem(name, value);
		}
	},
	getParam: function getParam(name) {
		/**
		 * 键(key)对应应用存储的值，如果没有保存则返回null。
		 * @param 只有name为organ_user时返回对象，其他获取将返回字符串
		 */
		if(name === "customber") return JSON.parse(plus.storage.getItem(name));
		else return plus.storage.getItem(name);
	},
	removeParam: function removeParam(key) {
		/**
		 * 清除key存储数据
		 */
		return plus.storage.removeItem(key);
	},
	getLength: function getLength() {
		/**
		 * 获取应用存储区中保存的键值对的个数
		 */
		return plus.storage.getLength();
	},
	clear: function clear() {
		/**
		 * 清除应用所有的键值对存储数据
		 */
		return plus.storage.clear();
	},
	getAllKeys: function AllKeys() {
		/**
		 * 应用所有的键
		 */
		var keyNames = [];
		var numKeys = plus.storage.getLength();
		for(var i = 0; i < numKeys; i++) {
			keyNames[i] = plus.storage.key(i);
		}
		return keyNames;
	}

};

/////////////////加载第三方登录渠道///////////////
var otherLogin = {
	auths:{},//存储渠道
	getServices:function getServices(callBack){
		plus.oauth.getServices(function(services) {
			for(var i in services) {
				var service = services[i];
				otherLogin.auths[service.id] = service;
			}
			callBack(otherLogin.auths);
		}, function(e) {
			plus.nativeUI.closeWaiting();
			mui.alert("获取登录认证失败：" + e.message);
			return false;
		});
	},
	login:function login(auth, callBack){
		// 获取登录认证通道
		if(auth) {
			auth.login(function() {
				callBack(auth);
			}, function(e) {
				plus.nativeUI.closeWaiting();
				plus.nativeUI.alert("登录认证失败", null, "登录失败" + e.code + e.message);
			});
		} else {
			plus.nativeUI.alert("无效的登录认证通道！", null, "登录");
			return false;
		}
	},
	userInfo:function userInfo(auth, callBack){
		auth.getUserInfo(function() {
			callBack(auth);
		}, function(e) {
			plus.nativeUI.closeWaiting();
			plus.nativeUI.alert("获取用户信息失败！", null, "获取用户信息失败" + e.code + e.message);
			return false;
		});
	},
	logoutAll:function logoutAll(){
		console.info("----- 注销登录认证 -----");
		for(var i in this.auths) {
			console.info("注销内容包括:",JSON.stringify(this.auths[i]));
			this.logout(this.auths[i]);
		}
	},
	logout:function logout(auth){
		console.info("开始注销");
		console.info("注销内容包括:",JSON.stringify(auth));
		auth.logout(function() {
			console.info("注销\"" + auth.description + "\"成功");
		}, function(e) {
			console.info("注销\"" + auth.description + "\"失败：" + e.message);
		});
	}
};
/**
 * 登录用户操作
 */
var member = {
	isLogin: function isLogin() {
		if(localStorageUtils.getParam("customber")) {
			return true;
		}
		return false;
	},
	getMember: function getMember() {
		if(this.isLogin()) {
			return localStorageUtils.getParam("customber");
		} else {
			return null;
		}
	},
	memberLogin: function memberLogin() {
		mui.confirm('是否登录？', '请先登录', ['否', '是'], function(e) {
			if(e.index == 1) {
				mui.openWindow({
					url: "login.html",
					id: "login",
					show: {
						aniShow: "slide-in-bottom",
						duration: 300
					}
				});
			}
		});
	}
};

var strUtil = {
	/**
	 * 生成定长随机字符串
	 */
	getMessageCode: function getMessageCode(codeLength) {
		// 0-9的随机数  
		var arr = []; //容器  
		for(var i = 0; i < codeLength; i++) {
			//循环六次  
			var num = Math.random() * 9; //Math.random();每次生成(0-1)之间的数;  
			num = parseInt(num, 10);
			arr.push(num);
		}
		return arr.join("");;
	}
};

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
(function(d) {
	Date.prototype.Format = function(fmt) { //author: meizz 
		var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"h+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
		};
		if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	},
	Array.prototype.removeByValue = function(val) {
	  for(var i=0; i<this.length; i++) {
	    if(this[i] == val) {
	      this.splice(i, 1);
	      break;
	    }
	  }
	}
})();