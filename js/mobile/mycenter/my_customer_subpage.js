/*
 *APP店铺所在位置获取
 */
var vm = {};
mui.plusReady(function(){
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				auto:true,
				style:'circle',
				color:'#FF4510', //可选，默认“#2BD009” 下拉刷新控件颜色
				callback: downLoad,
				cacheKey:"my_custombers"
			}
		}
	});
	vm = new Vue({
	  el: 'body',
	  data: {
	  	customber: member.getMember(),
	  	myCustombers:[]
	  },
	  mounted:function(){
	  	
	  },
	  created:function(){
	  	var that = this;
	  	setTimeout(function(){
	  		if(localStorageUtils.getParam("my_custombers")){
	  			that.myCustombers = mui.parseJSON(localStorageUtils.getParam("my_custombers"));
	  		}
	  	},100);
	  },
	  methods:{
	  	showDateSelect:function(){
  			var that = this;
  			plus.nativeUI.pickDate(function(e) {
  				console.info(JSON.stringify(e));
				var d = e.date;
				$("#show-date").html(d.getFullYear()+"年"+(d.getMonth() + 1)+"月"+'<img width="11px" src="../../images/my_customer_03.png" alt="" />');
			}, function(e) {
				console.info("您没有选择日期");
			}, {
				title: "请选择顾客收入日期",
				minDate: new Date().setFullYear(1970,1),
				maxDate: new Date()
			});
  		},
  		showMyCustombers:function(){
  			muiHelper.muiHelperAjax(null, true, "/CnCustomberController/app/get/my/custombers/", {
					"phone":vm.$data.customber.phone,
				}, function(result) {
				if(result.success) {
					vm.$data.myCustombers = result.data;
					muiHelper.muiHelperEndPulldownToRefresh("pullrefresh");
					setTimeout(function(){
						localStorageUtils.removeParam("my_custombers");
						localStorageUtils.setParam("my_custombers",JSON.stringify(result.data));
					},100);
				}
			});
  		}
	  },
	  computed:{
	  	nowDateStr:function(){
	  		return new Date().Format("yyyy-MM-dd");
	  	}
	  }
	});
});
///////////////////////下拉刷新函数/////////////////////////
function downLoad() {
	setTimeout(function(){
		vm.$options.methods.showMyCustombers();
	},300);
}
	

