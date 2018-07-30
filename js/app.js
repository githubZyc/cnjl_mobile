var App = (function($) {
	var app = {};

	/**
	 * 获得屏幕的宽高
	 * @param {Object} element
	 */
	app.getScreen = function(maxW, maxH) {

		var arr = [
			document.documentElement.clientWidth || document.body.clientWidth,
			document.documentElement.clientHeight || document.body.clientHeigth
		];
		maxW && (function() {
			if(arr[0] > maxW) {
				arr[0] = maxW;
			}
		}());
		maxH && (function() {
			if(arr[1] > maxH) {
				arr[1] = maxH;
			}
		}());
		return arr;
	};
	/**
	 * 检测登录
	 * @param {Boolean} autoLogin 是否跳转登录
	 */
	app.checkLogin = function(autoLogin, callback) {
		var u = new User().getInfo(),
			has = false,
			that = this;
		for(var k in u) {
			has = u;
			break;
		}

		this._LOGIN_SUSSES_ = function(e) {
			callback(e.detail);
		}

		return has || ($.toast('用户未登录') || !0) && autoLogin && (function() {
			//$.toast('请先登录');
			//			$.openWindow('_www/hello.html', 'page_hello', {
			var nw = $.openWindow('_www/html/public/login.html', 'page_login', {
				show: {
					duration: 250,
					aniShow: 'pop-in'
				},
				extras: {
					noClose: true
				}
			});

			if(!callback) {
				return;
			}
			if(that._LOGIN_SUSSES_) {
				window.removeEventListener('_LOGIN_SUSSES_', that._LOGIN_SUSSES_)
			}
			window.addEventListener('_LOGIN_SUSSES_', that._LOGIN_SUSSES_);

			window.addEventListener('_LOGIN_SUSSES_', function() {
				alert();
			});

			return false;
		}());
	};

	/**
	 * 抛出页面错误
	 * @param {Object} 需要显示的标题和内容 
	 */
	app.throwErr = function(data) {
		this.rd(null, function() {
			window.sessionStorage.removeItem('ERRORINFO');
			window.sessionStorage.setItem('ERRORINFO', JSON.stringify(data));
			plus.webview.currentWebview().loadURL('_www/html/open/error.html');

		});
	};

	/**
	 * 打开第三方分享页面
	 * @param {Object} data 需要分享的JSON信息  标题，内容，图片，链接
	 * @param {Function} fn 分享的回调 分享成功返回 平台名称  失败返回undefinde
	 */
	app.openShare = function(data, fn) {
		if(!SHARE_SWITCH) {
			return mui.toast('此功能暂未开放，敬请期待');
		}
		var fnkey = 'SHARE_CALLBACK';
		if(fn) {
			//如果已存在事件，则先删除上一个事件
			app[fnkey] && window.removeEventListener(fnkey, app[fnkey])
			app[fnkey] = fn
			window.addEventListener(fnkey, app[fnkey])
		}
		$.openWindow('_www/html/open/share.html', 'share', {
			show: {
				duration: 100,
				aniShow: 'none'
			},
			styles: {
				height: '40%',
				bottom: 0,
				top: '60%',
				background: "rgba(0,0,0,0.6)"
			},
			extras: {
				shareConfig: data,
				callBackName: fnkey
			}
		});
	};

	/**
	 * 打开网页浏览器
	 */
	app.openBrowser = function(o) {
		//		if(typeof(o.isJump) == "undefined") {
		//			return;
		//		}
		if(o && o.isJump === 0) {
			if(o.originalUrl) {
				$.plusReady(function() {
					plus.runtime.openURL(o.originalUrl);
				});
			}
			return;
		}
		var url = "";
		var extra = {};
//		console.log(JSON.stringify(o))
		switch(o.jumpType) {
			case "ZT":
				{
					url = "_www/html/home/subject/subject.html";
					extra.data = {
						sid: o.jumpObjId
					};
					break;
				}
			case "HD":
				{
					if(o.jumpObjId==9999){
						mui.openWindow('_www/html/open/browser.html', 'browser', {
							extras: {
								url: 'https://anxin.61beidou.com/safeact/index.html',
								act: {
									id:o.jumpObjId,
									atvImgUrl:o.sourceImgUrl,
									atvTitle:o.mngmtTitle
								}
							}
						})
						return;
					}
					url = "_www/html/home/activity/activity_details.html";
					extra = {
						actid: o.jumpObjId
					};
					break;
				}
			case "ZX":
				{
					url = "_www/html/home/news/news_details.html";
					extra.data = {
						id: o.jumpObjId
					};
					break;
				}
			case "KC":
				{
					url = "_www/html/study/play.html";
					extra = {
						cid: o.jumpObjId,
						vipFlag: 'N',
					};
					break;
				}
			case "TZ":
				{
					url = "_www/html/world/myworld/tiecontent.html";
					extra = {
						InviaId: o.jumpObjId
					};
					break;
				}
			case "QZ":
				{
					url = "_www/html/world/myworld/quantie.html";
					extra = {
						boardId: o.jumpObjId
					};
					break;
				}
			case "HT":
				{
					url = "_www/html/world/hot/huaticontent.html";
					extra = {
						InviaId: o.jumpObjId
					};
					break;
				}
		}
		if(url) {
			App.openWindow({
				url: url,
				id: url,
				extras: extra
			}, true);
		}
	};

	app.getType = function(x) {
		if(x == null) return "null";
		var t = typeof x;
		if(t != "object") return t;
		var c = Object.prototype.toString.apply(x);
		c = c.substring(8, c.length - 1);
		if(c != "Object") return c;
		if(x.constructor == Object) return c;
		if("classname" in x.constructor.prototype && typeof x.constructor.prototype.classname == "string") return x.constructor.prototype.classname;
		return "[unknown type]";
	};
	app.rd = function(rfn, prfn) {
		rfn && $.ready(rfn);
		prfn && $.ready((function(f) {
			return f && window.plus && f || function() {
				document.addEventListener("plusready", function() {
					return f.apply(plus.webview.currentWebview());
				}, false);
			};
		}(prfn)));
		return this;
	};
	app.$ = function(s) {
		//		if(this.getType(s) === 'string') s = document.querySelectorAll(s);
		if(typeof s === 'string') s = document.querySelectorAll(s);
		return(function(doms, a$) {
			return {
				each: function(fn) {
					doms.length || (doms = [doms]);
					[].forEach.call(doms, fn);
					return this;
				},
				on: function(n, fn, b) {
					this.each(function(item) {
						item.addEventListener(n, fn, !!b);
					});
					return this;
				},
				onTap: function(fn, b) {
					this.on('tap', fn, b);
					return this;
				},
				get: function(index) {
					doms.length || (doms = [doms]);
					if(index === undefined) {
						return doms;
					}
					return doms[index];
				},
				length: function() {
					return doms.length;
				},
				css: function(a, b) {
					if(!b && typeof a === 'object') {
						for(var k in a) {
							arguments.callee.call(this, k, a[k]);
						}
						return this;
					}
					this.each(function(item) {
						item.style[a] = b;
					});
					return this;
				},
				html: function(a) {
					if(!a) {
						return this.get(0).innerHTML;
					}
					this.each(function(i) {
						i.innerHTML = a;
					});
					return this;
				},
				attr: function(a, b) {
					if(!b) {
						return this.get(0).getAttribute(a);
					}
					this.each(function(i) {
						i.setAttribute(a, b);
					});
					return this;
				},
				removeSelf: function() {
					this.each(function(i) {
						i.parentNode.removeChild(i);
					});
					return this;
				},
				parentN: function(n) {
					if(typeof n !== 'number') {
						n = 1;
					}
					var el = this.get(0);
					for(var i = 0; i < n; i++) {
						el = el.parentNode;
					}
					return a$(el);
				},
				cdClass: function() {
						return(function(_$) {
							return {
								cdBack: function() {
									return _$;
								},
								add: function(c) {
									if(Array.isArray(c)) {
										for(var i = 0, l = c.length; i < l; i++) {
											arguments.callee(c[i]);
										}
										return this;
									}
									_$.each(function(i) {
										i.classList.add(c);
									});
									return this;
								},
								remove: function(c) {
									if(Array.isArray(c)) {
										for(var i = 0, l = c.length; i < l; i++) {
											arguments.callee(c[i]);
										}
										return this;
									}
									_$.each(function(i) {
										i.classList.remove(c);
									});
									return this;
								},
								has: function(c) {
									return _$.get(0).classList.contains(c);
								},
								toggle: function(c) {
									_$.each(function(i) {
										i.classList.toggle(c);
									});
									return this;
								}
							}
						}(this))
					}
					//...
			}
		}(s, this.$));
	};

	/**
	 * 地理位置 
	 * @param {Function} fn 回调 
	 */
	app.getLocation = function(fn) {
		plus.geolocation.getCurrentPosition(function(p) {
			fn && fn(null, p);
		}, function(e) {
			fn && fn(e.message);
		}, {});
	};
	/**
	 * 地理位置 - 获得当前位置
	 * @param {Function} fn 回调 (err,data,position)
	 */
	app.getCurrentPosition = function(op, fn) {
		op = (function(o) {
			for(var i in op) {
				o[i] = op[i];
			}
			return o;
		}({
			width: 400, //宽
			height: 300, //高
			zoom: 15 //最大18 放大级别
		}));
		$.plusReady(function() {
			app.getLocation(function(err, position) {
				var codns = position.coords,
					baidu_map = "http://api.map.baidu.com/geocoder/v2/?output=json&ak=BFd9490df8a776482552006c538d6b27&location=";
				baidu_map += codns.latitude + ',' + codns.longitude;

				var baidu_mapimg = "http://api.map.baidu.com/staticimage";
				baidu_mapimg += '?' + 'width=' + op.width + '&height=' + op.height + '&center=' + codns.longitude + ',' + codns.latitude;
				baidu_mapimg += '&zoom=' + op.zoom;

				$.ajax(baidu_map, {
					type: 'get',
					dataType: "json",
					contentType: 'application/json; charset=utf-8',
					data: {},
					timeout: 10000,
					success: function(data) {
						fn && fn(data, baidu_mapimg, position);
					}
				});
			});

		})
	};
	/**
	 * 地理位置 - 获得当前位置地图截图
	 * @param {Object} op 配置
	 * @param {Object} fn 回调
	 */
	app.getCurrentPositionImg = function(op, fn) {
		op = (function(o) {
			for(var i in op) {
				o[i] = op[i];
			}
			return o;
		}({
			width: 400, //宽
			height: 300, //高
			zoom: 15 //最大18 放大级别
		}));
		$.plusReady(function() {
			app.getLocation(function(err, p) {
				var codns = p.coords;
				var baidu_map = "http://api.map.baidu.com/staticimage";
				baidu_map += '?' + 'width=' + op.width + '&height=' + op.height + '&center=' + codns.longitude + ',' + codns.latitude;
				baidu_map += '&zoom=' + op.zoom;
				fn(baidu_map);
			});
		});
	};

	/**
	 * 选择图片
	 * @param {Function} fn 图片选择回调
	 * @param {Number} more 图片最大选择数量（仅在选择相册时有效）
	 */
	app.selectImg = function(fn, more) {
		$.plusReady(function() {
			plus.nativeUI.actionSheet({

				cancel: "取消",
				buttons: [{
					title: "照相机",
					style: "destructive"
				}, {
					title: "相册"
				}]
			}, function(e) {
				var index = e.index;
				if(index === 0) {
					return;
				}
				index--;
				if(index === 0) {
					var cmr = plus.camera.getCamera();
					cmr.captureImage(function(p) {
						plus.io.resolveLocalFileSystemURL(p, function(entry) {
							var img_name = entry.name;
							var img_path = entry.toLocalURL();
							fn && fn(null, [img_path], [img_name]);
						}, function(e) {
							fn && fn(e.message);
						});
					}, function(e) {
						fn && fn(e.message);
					}, {
						filename: '_doc/camera/',
						index: 1
					});
				} else if(index === 1) {
					plus.gallery.pick(function(data) {
						if(more) {
							var imgs = [];
							for(var a in data.files) {
								imgs.push(data.files[a]);
							}
							data = imgs;
						}
						fn && fn(null, data);
					}, function(e) {
						fn && fn(e.message);
					}, {
						filter: "image",
						multiple: !!more,
						system: false,
						maximum: more,
						onmaxed: function() {
							$.toast('您最多能选择' + more + '张');
						}
					});
				}
			});
		});
	};
	/**
	 * 展示本地通知栏消息
	 * @param {Object} op
	 */
	app.showMsg = function(op) {
		op = (function(nop) {
			for(var i in op) {
				nop[i] = op[i];
			}
			return nop;
		}({
			cover: true,
			data: '',
			when: new Date(),
			content: '',
			time: false
		}));
		$.os.android && op.time && (op.content = new Date().toLocaleDateString().split('/').join('-') + ' ' + op.content);

		$.plusReady(function() {
			plus.push.createMessage(op.content, op.data, op);
		});

	};

	/**
	 * 第三方登录
	 * @param {String} type 登录平台 qq weixin sinaweibo
	 * @param {Function} Fun 登录成功后的回调函数 参数 {info,outLogin}
	 */
	app.authLogin = function(type, Fun) {
		var auths = null;

		var callback = function(ser) {
			Fun && Fun({
				info: ser.userInfo,
				outLogin: function() {
					authLogout(ser);
				}
			});
		}

		plus.nativeUI.showWaiting();

		plus.oauth.getServices(function(services) {
			auths = services;
			var ts = getServer(type);
			login(ts);
			setTimeout(function() {
				plus.nativeUI.closeWaiting();
			}, 800);
		}, function(e) {
			plus.nativeUI.closeWaiting();
			mui.toast("获取登录服务失败：" + e.message + " - " + e.code);
		});

		//获取登陆服务
		function getServer(type) {
			var len = auths.length;
			for(var i = 0; i < len; i++) {
				if(auths[i].id == type) {
					return auths[i];
				}
			}
			return null;
		}

		// 登录操作
		function login(s) {
			if(!s.authResult) {
				s.login(function(e) {
					mui.toast(s.description + " 登录认证成功！");
					authUserInfo(s);
				}, function(e) {
					mui.toast(s.description + " 登录认证失败！");
				});
			} else {
				mui.toast(s.description + " 已经登录认证！");
			}
		}

		// 登录认证信息
		function authUserInfo(s) {
			s.getUserInfo(function(e) {
				callback(s);
				// authLogout(s);
			}, function(e) {
				mui.toast("获取用户信息失败：" + e.message + " - " + e.code);
			});
		}

		//注销
		function authLogout(s) {
			if(s && s.authResult) {
				s.logout(function(e) {
					console.log(s.description + " 注销登录认证成功！");
				}, function(e) {
					console.log(s.description + " 注销登录认证失败！");
				});
			}
		}

	}

	app.checkNet = function() {
		return ['unknow', 'none'].indexOf(app.getNetwork()) < 0;
	}

	/**
	 * 获取网络类型
	 */
	app.getNetwork = function() {
		var networkTypes = {};
		networkTypes[plus.networkinfo.CONNECTION_UNKNOW] = "unknow"; //未知
		networkTypes[plus.networkinfo.CONNECTION_NONE] = "none"; //未连接
		networkTypes[plus.networkinfo.CONNECTION_ETHERNET] = "line"; //有线网络
		networkTypes[plus.networkinfo.CONNECTION_WIFI] = "wifi"; //wifi
		networkTypes[plus.networkinfo.CONNECTION_CELL2G] = "2g"; //2g
		networkTypes[plus.networkinfo.CONNECTION_CELL3G] = "3g"; //3g
		networkTypes[plus.networkinfo.CONNECTION_CELL4G] = "4g"; //4g
		return networkTypes[plus.networkinfo.getCurrentType()];
	}

	/**
	 * 下载文件
	 * @param {String} url 文件地址
	 * @param {Function} callback 下载完成回调
	 * @param {Boolean} isImg 是否属于图片逻辑
	 */
	app.downFile = function(url, callback, isImg, downCallBack) {
		if(!url) {
			return;
		}
		var op = {
			method: "GET"
		};

		if(isImg) { //如果是图片文件
			op.filename = '_downloads/image/' + this.md5(url) + '.jpg'; //HBuilder平台路径
			this.hasImgFile(op.filename, function(has) {
				if(has) {
					console.log('已存在图片')
					callback(has)
				} else {
					console.log('开始下载：' + url)
					dtask.start()
				}
			})
		}
		console.info(url);
		var dtask = plus.downloader.createDownload(url, op, function(d, status) {
			if(status == 200) {

				var path = plus.io.convertLocalFileSystemURL(d.filename);
				if(path.indexOf('file') < 0) {
					path = 'file://' + path;
				}
				callback && callback(path);
			} else {
				d.abort(); //自动会删除 临时文件
				callback && callback();
			}
		});
		var size = 0;
		dtask.addEventListener('statechanged', function(d, status) {
			size = +(d.downloadedSize / d.totalSize * 100);
			size = size.toFixed(0)
			downCallBack && downCallBack(size);
			console.log("statechanged: " + d.state);
		});

		isImg || dtask.start();
		return dtask;
		// 暂停下载任务 dtask.pause();
		// 取消下载任务 dtask.abort();
	}
	app.hasImgFile = function(hb_path, callback) {
		if(hb_path[0] === '_') {
			hb_path = plus.io.convertLocalFileSystemURL(hb_path);
			if(hb_path.indexOf('file') < 0) {
				hb_path = 'file://' + hb_path;
			}
		}
		var img = new Image();
		img.src = hb_path;
		img.onload = function() {
			callback(hb_path);
		};
		img.onerror = function() {
			callback();
		}
	}

	/**
	 * 打开wifi
	 */
	app.openWifi = function() {
		if($.os.ios) {
			plus.runtime.openURL("prefs:root=WIFI"); //ios需要手动打开
		} else if($.os.android) {
			var Context = plus.android.importClass("android.content.Context");
			var WifiManager = plus.android.importClass("android.net.wifi.WifiManager")
			var wifiManager = plus.android.runtimeMainActivity().getSystemService(Context.WIFI_SERVICE);
			wifiManager.setWifiEnabled(true); //false 为关闭
		}
	}

	/**
	 * Input获取焦点 弹出软键盘
	 * @param {HTMLInputElement} inputElem 
	 */
	app.showSoftInput = function(inputElem) {
		if(!inputElem) {
			return;
		}
		if(!inputElem.id) {
			this.input.id = inputElem.id = 'InputDefultId';
		}

		var nativeWebview, imm, InputMethodManager;
		var initNativeObjects = function() {
			if($.os.android) {
				var main = plus.android.runtimeMainActivity();
				var Context = plus.android.importClass("android.content.Context");
				InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
				imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
				plus.android.importClass(nativeWebview);
				nativeWebview.requestFocusFromTouch();
				//强制显示软键盘 
				//imm.showSoftInput(nativeWebview,InputMethodManager.SHOW_FORCED);
				imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);

			} else {
				nativeWebview.plusCallMethod({
					"setKeyboardDisplayRequiresUserAction": false
				});
			}
		};
		$.plusReady(function() {
			if(document.activeElement.id === inputElem.id) {
				return;
			}
			nativeWebview = plus.webview.currentWebview().nativeInstanceObject();
			initNativeObjects();
			setTimeout(function() {
				inputElem.focus();
			}, 200);
		});

	}

	//资源升级
	app.updateWgt = function(url, downCallBack, isHideUpdate) {
		var hz = url.split('.').pop();
		if(hz.indexOf('wgt') < 0 && hz.indexOf('apk') < 0) {
			if($.os.ios) {
				$.plusReady(function() {
					isHideUpdate || plus.runtime.openURL(url);
				});
			}
			return downCallBack && downCallBack();
		}
		//更新应用资源 
		var installWgt = function(path, callback) {
				plus.runtime.install(path, {}, function() {
					callback && callback(true);
				}, function(e) {
					callback && callback(false, e);
				});
			},
			w;

		if(!isHideUpdate) {
			w = plus.nativeUI.showWaiting("获取资源...", {
				back: 'none'
			});
		}

		var task = this.downFile(url, function(path) {
			isHideUpdate || w.setTitle('安装资源中...')
			installWgt(path, function(state, e) {
				w && w.close();
				if(isHideUpdate) {
					return downCallBack && downCallBack(!!state);
				}
				if(!state) {
					alert("安装失败[" + e.code + "]：" + e.message);
					$.toast('更新失败稍后再试...');
					return downCallBack && downCallBack();
				}
				console.log("安装成功！");
				plus.nativeUI.alert("应用资源更新完成！", function() {
					$.os.android && plus.runtime.restart();
					$.os.ios && $.toast('您可能需要手动重启应用');
					downCallBack && downCallBack(!0);
				});
			});
		}, false, function(size) {
			w && w.setTitle('正在下载\n' + size + '%');
			isHideUpdate && console.log('正在下载\n' + size + '%');
		});

	}

	//开始原生动画
	function startAnimation(type, bitmapT, bitmapB, callback) {
		var bm = bitmapB ? {
				bitmap: bitmapB
			} : {},
			tm = bitmapT ? {
				bitmap: bitmapT
			} : {};
		plus.nativeObj.View.startAnimation({
			type: type || 'pop-in' //默认
		}, bm, tm, function() {
			callback && callback(plus.nativeObj.View.clearAnimation);
		});
	}

	//webview截图
	function drawWebView(webview, bitmap, callback) {
		bitmap = bitmap || new plus.nativeObj.Bitmap('defultBitMap');
		webview.draw(bitmap, function() {
			callback && callback(bitmap);
		}, function(err) {
			callback && callback();

			console.log('截图错误：' + JSON.stringify(err) + bitmap.id)
		});
	}
	var bitmap, //动画上层截图
		bitmap2, //动画下层截图
		bitmapCount = 0;

	app.openWindow = function(op, when) {
		op.show = {
			aniShow: 'pop-in',
			duration: 250
		};
		return $.openWindow(op);

		if(op.id && plus.webview.getWebviewById(op.id)) {
			plus.webview.close(op.id);
		}
		when = [when ? 'onloading' : 'onloaded'];
		bitmapCount++;
		bitmap = bitmap || new plus.nativeObj.Bitmap('nwbitmap' + op.id + bitmapCount);
		bitmap2 = bitmap2 || new plus.nativeObj.Bitmap('cwbitmap' + op.id + bitmapCount);

		//'',{color:'#636ee1',loading:{display:'inline'}});

		if(when) {

			when = 'onloading';
		} else {
			plus.nativeUI.showWaiting('', {
				padlock: true
			});
			when = 'onloaded';
		}

		var nw = $.preload(op);
		nw[when] = function(e) {

				//开始截图open
				drawWebView(nw, bitmap, function() {
					plus.nativeUI.closeWaiting();
				});

				nw.show("pop-in", 300, function() {
					// 动画完成，销毁截图
					bitmap.clear();
					bitmap2.clear();
					bitmap = bitmap2 = null;
				}, {
					capture: bitmap,
					otherCapture: bitmap2
				});

				nw.addEventListener('hide', function() {
					$.back();
					console.log()
					return;
				});

			}
			//新页面在load的同时，截图当前页面
		var cw = plus.webview.currentWebview();
		while(cw.parent()) {
			cw = cw.parent();
		}
		drawWebView(cw, bitmap2, function() {});

		return nw;
	}

	/**
	 * 炒鸡无敌跨webview显示在最顶端的真男人alert
	 * 
	 */
	app.superAlert = function(title, text, btnArr, callback, maskCallback) {
			var vInfo = {
				rect: {
					top: '35%',
					left: '10%',
					width: '80%',
					height: '30%',
					background: '#f00'
				},
				title: {
					dst: {
						top: '5%',
						width: '80%',
						left: '10%',
						height: '20%'
					},
					styles: {
						color: '#000',
						size: '18px'
					}
				},
				ctent: {
					dst: {
						top: '25%',
						width: '90%',
						left: '5%',
						height: '50%'
					},
					src: {},
					styles: {
						color: '#5C75EE',
						size: '20px'
					}
				}
			};
			var view = plus.nativeObj.View.getViewById('superView'),
				maskView = plus.nativeObj.View.getViewById('superMaskView'),
				bitmap = plus.nativeObj.Bitmap.getBitmapById('superBitmap');
			view && view.clear();
			maskView && maskView.clear();
			bitmap && bitmap.clear();
			view = new plus.nativeObj.View('superView', vInfo.rect);
			maskView = new plus.nativeObj.View('superMaskView');
			//bitmap = new plus.nativeObj.Bitmap('superBitmap');

			//绘制遮罩
			maskView.drawRect("rgba(0,0,0,0.5)");
			//监听遮罩 防止透传事件
			maskView.addEventListener('click', function() {
				maskCallback && maskCallback();
			});

			//绘制弹窗
			view.drawRect("#ddd");
			//绘制弹窗标题
			view.drawText(title, vInfo.title.dst, vInfo.title.styles);

			//如果是图片
			if((function(hz, arr) {
					for(var i = 0, l = arr.length - 1; i < l; i++) {
						if(arr[i] == hz) {
							return !0;
						}
					}
				}(text.split('.').pop(), [
					'jpg', 'png', 'jpeg'
				]))) {
				text = plus.io.convertLocalFileSystemURL(text);
				bitmap = new plus.nativeObj.Bitmap('superBitmap');
				bitmap.load(text, function() {
					view.drawBitmap(bitmap, vInfo.ctent.src, vInfo.ctent.dst);
				}, function() {});
			} else {
				//绘制弹窗内容
				view.drawText(text, vInfo.ctent.dst, vInfo.ctent.styles);
			}

			//转化为数组
			if(!Array.isArray(btnArr)) {
				btnArr = [btnArr];
			}

			//百分比转小数
			function toPoint(percent) {
				var str = percent.replace("%", "");
				str = str / 100;
				return str;
			}

			var btnInfo = {
				w: (100 / btnArr.length).toFixed(0), //每个btn宽度
				sw: plus.screen.resolutionWidth //屏幕宽度
			};
			btnInfo.offl = toPoint(vInfo.rect.left) * btnInfo.sw; //左偏移 
			btnInfo.offw = toPoint(btnInfo.w) * (btnInfo.sw * toPoint(vInfo.rect.width));
			btnArr.map(function(item, index) {
				view.drawText(item, {
					top: '80%',
					left: btnInfo.w * index + '%',
					width: btnInfo.w + '%',
					height: '10%'
				}, {
					color: '#438',
					size: '20px'
				});
			});

			//设置监听区域
			view.setTouchEventRect({
				top: '70%',
				width: '100%',
				height: '20%'
			});
			var oback = $.back;
			$.back = function() {
				maskView.clear();
				view.clear();
				this.back = oback;
			};
			//监听弹窗
			view.addEventListener('click', function(e) {
				maskView.clear();
				view.clear();
				$.back = oback;
				//计算click下标的位置
				var index = Math.floor((e.pageX - btnInfo.offl) / btnInfo.offw);
				callback && callback(index);
			});

			maskView.show();
			view.show();

		},
		app.md5 = function(string) {
			function md5_RotateLeft(lValue, iShiftBits) {
				return(lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
			}

			function md5_AddUnsigned(lX, lY) {
				var lX4, lY4, lX8, lY8, lResult;
				lX8 = (lX & 0x80000000);
				lY8 = (lY & 0x80000000);
				lX4 = (lX & 0x40000000);
				lY4 = (lY & 0x40000000);
				lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
				if(lX4 & lY4) {
					return(lResult ^ 0x80000000 ^ lX8 ^ lY8)
				}
				if(lX4 | lY4) {
					if(lResult & 0x40000000) {
						return(lResult ^ 0xC0000000 ^ lX8 ^ lY8)
					} else {
						return(lResult ^ 0x40000000 ^ lX8 ^ lY8)
					}
				} else {
					return(lResult ^ lX8 ^ lY8)
				}
			}

			function md5_F(x, y, z) {
				return(x & y) | ((~x) & z)
			}

			function md5_G(x, y, z) {
				return(x & z) | (y & (~z))
			}

			function md5_H(x, y, z) {
				return(x ^ y ^ z)
			}

			function md5_I(x, y, z) {
				return(y ^ (x | (~z)))
			}

			function md5_FF(a, b, c, d, x, s, ac) {
				a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
				return md5_AddUnsigned(md5_RotateLeft(a, s), b)
			};

			function md5_GG(a, b, c, d, x, s, ac) {
				a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
				return md5_AddUnsigned(md5_RotateLeft(a, s), b)
			};

			function md5_HH(a, b, c, d, x, s, ac) {
				a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
				return md5_AddUnsigned(md5_RotateLeft(a, s), b)
			};

			function md5_II(a, b, c, d, x, s, ac) {
				a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
				return md5_AddUnsigned(md5_RotateLeft(a, s), b)
			};

			function md5_ConvertToWordArray(string) {
				var lWordCount;
				var lMessageLength = string.length;
				var lNumberOfWords_temp1 = lMessageLength + 8;
				var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
				var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
				var lWordArray = Array(lNumberOfWords - 1);
				var lBytePosition = 0;
				var lByteCount = 0;
				while(lByteCount < lMessageLength) {
					lWordCount = (lByteCount - (lByteCount % 4)) / 4;
					lBytePosition = (lByteCount % 4) * 8;
					lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
					lByteCount += 1
				}
				lWordCount = (lByteCount - (lByteCount % 4)) / 4;
				lBytePosition = (lByteCount % 4) * 8;
				lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
				lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
				lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
				return lWordArray
			};

			function md5_WordToHex(lValue) {
				var WordToHexValue = "",
					WordToHexValue_temp = "",
					lByte, lCount;
				for(lCount = 0; lCount <= 3; lCount += 1) {
					lByte = (lValue >>> (lCount * 8)) & 255;
					WordToHexValue_temp = "0" + lByte.toString(16);
					WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2)
				}
				return WordToHexValue
			};

			function md5_Utf8Encode(string) {
				string = string.replace(/\r\n/g, "\n");
				var utftext = "";
				for(var n = 0; n < string.length; n += 1) {
					var c = string.charCodeAt(n);
					if(c < 128) {
						utftext += String.fromCharCode(c)
					} else if((c > 127) && (c < 2048)) {
						utftext += String.fromCharCode((c >> 6) | 192);
						utftext += String.fromCharCode((c & 63) | 128)
					} else {
						utftext += String.fromCharCode((c >> 12) | 224);
						utftext += String.fromCharCode(((c >> 6) & 63) | 128);
						utftext += String.fromCharCode((c & 63) | 128)
					}
				}
				return utftext
			};
			var x = Array();
			var k, AA, BB, CC, DD, a, b, c, d;
			var S11 = 7,
				S12 = 12,
				S13 = 17,
				S14 = 22;
			var S21 = 5,
				S22 = 9,
				S23 = 14,
				S24 = 20;
			var S31 = 4,
				S32 = 11,
				S33 = 16,
				S34 = 23;
			var S41 = 6,
				S42 = 10,
				S43 = 15,
				S44 = 21;
			string = md5_Utf8Encode(string);
			x = md5_ConvertToWordArray(string);
			a = 0x67452301;
			b = 0xEFCDAB89;
			c = 0x98BADCFE;
			d = 0x10325476;
			for(k = 0; k < x.length; k += 16) {
				AA = a;
				BB = b;
				CC = c;
				DD = d;
				a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
				d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
				c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
				b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
				a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
				d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
				c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
				b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
				a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
				d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
				c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
				b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
				a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
				d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
				c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
				b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
				a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
				d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
				c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
				b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
				a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
				d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
				c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
				b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
				a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
				d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
				c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
				b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
				a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
				d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
				c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
				b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
				a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
				d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
				c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
				b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
				a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
				d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
				c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
				b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
				a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
				d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
				c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
				b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
				a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
				d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
				c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
				b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
				a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
				d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
				c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
				b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
				a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
				d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
				c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
				b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
				a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
				d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
				c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
				b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
				a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
				d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
				c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
				b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
				a = md5_AddUnsigned(a, AA);
				b = md5_AddUnsigned(b, BB);
				c = md5_AddUnsigned(c, CC);
				d = md5_AddUnsigned(d, DD)
			}
			return(md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase()
		}

	return app;
}(mui));

(function(app, $, undefined) {
	//通过参数个数的不同实现重载
	app.addMethod = function(name, fn) {
		var ofn = app[name];
		app[name] = function() {
			if(fn.length === arguments.length) {
				return fn.apply(this, arguments);
			} else if(typeof ofn === 'function') {
				return ofn.apply(this, arguments);
			}
		};
	};
}(App, mui));

(function(app, $) {
	var Sto = function(_keyName) {
			this.keyName = _keyName || '_DEFALUT_KEY_NAME_';
		},
		store = window.localStorage,
		pro = Sto.prototype;
	pro.addMethod = function(name, fn) {
		var ofn = pro[name];
		pro[name] = function() {
			if(fn.length === arguments.length) {
				return fn.apply(this, arguments);
			} else if(typeof ofn === 'function') {
				return ofn.apply(this, arguments);
			}
		};
	};

	pro.addMethod('save', function() {
		return JSON.parse(store.getItem(this.keyName) || '{}');
	});
	pro.addMethod('save', function(o) {
		store.setItem(this.keyName, JSON.stringify(o));
	});

	pro.addMethod('getItem', function(key) {
		var rs = this.save();
		return rs[key] || {};
	});
	pro.addMethod('setItem', function() {
		store.removeItem(this.keyName);
	});
	pro.addMethod('setItem', function(key) {
		var rs = this.save();
		//delete rs[key];
		rs[key] = null;
		this.save(rs);
	});
	pro.addMethod('setItem', function(key, val) {
		var rs = this.save();
		//delete rs[key];
		rs[key] = val;
		this.save(rs);
	});
	pro.getKeyName = function() {
		return this.keyName;
	};

	app.Sto = Sto;
}(App, mui));

//本地存储
//(function(app) {
//	var keyName = 'store', //方法名称
//		store = window.localStorage,
//		nkey = function(k) {
//			return '_news_' + k + '_ning_'; 
//		},
//		storeFn = function(fn) {
//			app.addMethod(keyName, fn);
//		};
//	//获取
//	storeFn(function(key) {
//		var str = store.getItem(nkey(key)) || '{}';
//		return JSON.parse(str);
//	});
//	//全部覆盖
//	storeFn(function(key, val) {
//		var str = JSON.stringify(val) || '{}';
//		store.setItem(nkey(key), str);
//
//	});
//	//追加并覆盖key
//	storeFn(function(key, val, isAppend) {
//		var oval = storeFn(key);
//		for(var i in val) {
//			oval[i] = val[i];
//		}
//		storeFn(key, oval);
//	});
//
//}(App));

//多页面 监听事件
(function(app, $) {
	var storeKeyName = '_NEWSNING_EVENTS_LISTENER_',
		elists = new app.Sto(storeKeyName),
		//	var eList = function() {
		//			
		//			arguments[0] = storeKeyName + arguments[0];
		//			return app.store.apply(this, arguments);
		//		},

		indexPageEventList = [],

		eMethod = function(key, fn, isMore, dOnce) {
			var arg = arguments,
				//keyArr = eList(key);
				keyArr = elists.getItem(key);
			if(!Array.isArray(keyArr) && $.isEmptyObject(keyArr)) {
				keyArr = [];
			}
			if(fn) { //如果是增添事件 
				$.plusReady(function() {
					//获取当前webview的id
					var wid = plus.webview.currentWebview().id;

					for(var i = 0, l = keyArr.length; i < l; i++) {
						if(keyArr[i].id === wid) {
							console.log('~页面：' + wid + '已存在事件：' + '【' + key + '】');
							//如果已经监听 则不做任何 
							return true;
						}
					}
					//添加事件
					window.addEventListener(key, function _newsning_event_(e) {
						fn.apply(fn, arguments);
						//是否可以多次触发
						isMore || (window.removeEventListener(key, _newsning_event_));
					});
					console.log('+页面：' + wid + '添加事件：' + '【' + key + '】');
					//增添至事件数组
					keyArr.push({
						id: wid,
						once: !isMore
					});
					//保存至本地
					//eList(key, keyArr);
					elists.setItem(key, keyArr);
				});
			} else { //触发事件
				var i = 0,
					l = keyArr.length,
					tempW, temp, nArr = [];
				$.plusReady(function() {
					for(; i < l; i++) {
						temp = keyArr[i];
						//获取需要触发事件的webview
						tempW = plus.webview.getWebviewById(temp.id);
						$.fire(tempW, key, isMore);
						(dOnce || temp.once) || nArr.push(temp);

						console.log('@页面：' + temp.id + '触发事件：' + '【' + key + '】' + JSON.stringify(isMore));
					}
					//覆盖
					//eList(key, nArr);
					elists.setItem(key, nArr);
				});
			}
		};

	app.events = {
		//添加事件 once ：是否只监听一次  默认监听一次
		add: function(kname, fn, more) {
			if(!eMethod(kname, fn, more)) {
				indexPageEventList.push(kname);
			}
		},
		//触发事件
		fire: function(kname, data, more) {
			eMethod(kname, null, data, more);
		},
		remove: function(kname) {
			//eList(kname, []);
			elists.setItem(kname, []);
		},
		clear: function() {
			console.log('%清除所有App.events自定义事件列表')
			elists.save({});
		}
	}

	$.plusReady(function() {
		plus.webview.currentWebview().onclose = function() {

			indexPageEventList.forEach(function(item) {
				app.events.remove(item);
				console.log('-页面：' + temp.id + '清除事件：' + '【' + item + '】');
			});
		}
	});

}(App, mui));

(function(app) {
	app.getArguments = function() {
		var s = plus.runtime.arguments;
		o = {};
		if(s && !!~s.indexOf('?')) {
			s = s.split('?').pop().split('&');
			for(var i in s) {
				o[s[i].split('=')[0]] = s[i].split('=')[1] || null;
			}
		} else {
			o = null;
		}
		s = o;
		return s;
	}
}(App));