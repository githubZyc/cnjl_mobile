/*
 *APP首页 购物车页面处理逻辑
 */
//mui.plusReady(function() {
	var svm = new Vue({
		el: "body",
		data: {

		},
		mounted: function() {
			///////////////////////初始化构造器/////////////////////////
			mui.init({
				pullRefresh: {
					container: "#pullrefresh",
					down: {
						height: 50, // 可选,默认50.触发下拉刷新拖动距离,
						auto: true,
						contentdown: "下拉可以刷新",
						contentover: "释放立即刷新",
						contentrefresh: "正在刷新...",
						callback: this.downLoad
					}
				}
			});
		},
		methods: {
			///////////////////////下拉刷新函数/////////////////////////
			downLoad: function() {
				setTimeout(function() {
					muiHelper.muiHelperEndPulldownToRefresh("pullrefresh");
				}, 300);
			},
			calculateDistance: function() {
				var point1 = new plus.maps.Point(116.351442, 39.972614);
				var point2 = new plus.maps.Point(116.340788, 39.973319)
				plus.maps.Map.calculateDistance(point1, point2, function(event) {
					var distance = event.distance; // 转换后的距离值
					alert("Distance:" + distance);
				}, function(e) {
					alert("Failed:" + JSON.stringify(e));
				});
			},
			edit: function() {
				changeStyle();
			}
		}
	});
	var btnArray = ['确认', '取消'];
	$('.shop-goods').on('tap', '.mui-slider-right .mui-btn', function(event) {
		var elem = this;
		var li = elem.parentNode.parentNode;
		mui.confirm('确认删除该条记录？', '删除提示', btnArray, function(e) {
			if(e.index == 0) {
				li.parentNode.removeChild(li);
			} else {
				setTimeout(function() {
					mui.swipeoutClose(li);
				}, 0);
			}
		}, "div");
	});
//});

//改变编辑后的样式
function changeStyle() {
	$(".mui-table-view-cell").toggleClass("edit-css");
	if($(".mui-table-view-cell").hasClass("edit-css")) {
		$(".mui-bar-tab input[type='checkbox']").removeAttr("disabled");
		$(".mui-bar-tab >div.mui-pull-right").addClass("hide");
		$(".mui-bar-tab >button.mui-pull-right.del-btn").removeClass("hide").addClass("show");
	} else {
		$(".mui-bar-tab input[type='checkbox']").attr({
			"disabled": "disabled"
		});
		$(".mui-bar-tab >div.mui-pull-right").removeClass("hide");
		$(".mui-bar-tab >button.mui-pull-right.del-btn").removeClass("show").addClass("hide");
	}
}