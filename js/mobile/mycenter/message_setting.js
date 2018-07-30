/*
 *APP登录 管理个人中心消息处理逻辑
 */
mui.plusReady(function() {
	var vm = new Vue({
		el: 'body',
		data: {
			customber:member.getMember(),
			
		},
		created: function() {
			var that = this;
			plus.push.addEventListener( "click", function( msg ) {
				console.info(JSON.stringify(msg));
				// 判断是从本地创建还是离线推送的消息
				switch( msg.payload ) {
					case "LocalMSG":
						alert( "点击本地创建消息启动：" );
					break;
					default:
						alert( "点击离线推送消息启动：");
					break;
				}
				// 提示点击的内容
				plus.nativeUI.alert( msg.content );
			}, false );
			document.querySelector("#systemMessageActive").addEventListener('toggle', function(event) {
				that.upSystemMessage(event.detail.isActive);
			});
		},
		methods: {
			upSystemMessage:function(isActive){
				if(isActive){
					var msg = new Date().Format("yyyy-MM-dd hh:mm:ss");
					msg += ": 欢迎使用HTML5+创建本地消息！";
					this.createLocalPushMsg(msg);
				}
			},
			createLocalPushMsg:function(msg){
				var options = {cover:false,title:"系统消息设置开启！"};
				plus.push.createMessage( msg, "LocalMSG", options );
				console.info( "创建本地消息成功！" );
				console.info( "请到系统消息中心查看！" );
				if(plus.os.name=="iOS"){
					alert('*如果无法创建消息，请到"设置"->"通知"中配置应用在通知中心显示!');
				}
			}
		}
	});
});
