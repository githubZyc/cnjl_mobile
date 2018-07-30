/*
 *APP--编辑个人信息页面处理逻辑
 */
var vm = {};
mui.plusReady(function(){
	vm = new Vue({
		el: 'body',
		data: {
			customber:member.getMember(),
			headerImageId:'',
			sexPicker:{},
			sexData:[],
			educationPicker:{},
			educationData:[],
			hobbyPicker:{},
			hobbyData:[],
			base64:"",
		},
	  	created:function(){
	  		var that = this;
	  		console.info("未修改前用户基本信息:"+JSON.stringify(this.customber));
			//性别选择
			muiHelper.muiHelperAjax(null, true, "/CnDocInfoController/app/doc/info/", {
					"code":'0001',
				}, function(result) {
				if(result.success) {
					result.data.forEach(function(item,index){
						var datas = {};
						datas.value = item.code;
						datas.text = item.content;
						that.sexData.push(datas);
					});
				}
			});
			//学历
			muiHelper.muiHelperAjax(null, true, "/CnDocInfoController/app/doc/info/", {
					"code":'0002',
				}, function(result) {
				if(result.success) {
					result.data.forEach(function(item,index){
						var datas = {};
						datas.value = item.code;
						datas.text = item.content;
						if(that.customber.education === item.code){
							that.customber.education = item.content;
						}
						that.educationData.push(datas);
					});
				}
			});
			//口味爱好
			muiHelper.muiHelperAjax(null, true, "/CnDocInfoController/app/doc/info/", {
					"code":'0003',
				}, function(result) {
				if(result.success) {
					result.data.forEach(function(item,index){
						var datas = {};
						datas.value = item.code;
						datas.text = item.content;
						if(that.customber.hobby === item.code){
							that.customber.hobby = item.content;
						}
						that.hobbyData.push(datas);
					});
				}
			});
	  	},
	  	mounted:function(){
	  	},
	  	methods:{
	  		goValidCustomberPhone:function(customberPhone){
	  			if(!customberPhone){
		  			mui.openWindow({
						url: "tel_edit.html",
						id: "tel_edit",
						extras:{
							validCustomberPhone:true
						}
					});
		  		}
	  		},
	  		showBirthdaySelect:function(){
	  			var that = this;
	  			plus.nativeUI.pickDate(function(e) {
	  				console.info(JSON.stringify(e));
					var d = e.date;
					//alert('您选择的日期是:' + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()); 
					$("#birthday-inp").val(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());
				}, function(e) {
					console.info("您没有选择日期");
				}, {
					title: "请选择您出生的日期",
					minDate: new Date().setFullYear(1970,1,1),
					maxDate: new Date()
				});
	  		},
	  		showHobbySelect:function(){
	  			this.hobbyPicker = new mui.PopPicker();
				this.hobbyPicker.setData(this.hobbyData);
	  			this.hobbyPicker.show(function(items) {
					$("#hobby-inp").val(items[0].text);
					$("#hobby-inp").attr("data-hobby",items[0].value);
					return true;
				});
	  		},
	  		showSexSelect:function(){
	  			this.sexPicker = new mui.PopPicker();
				this.sexPicker.setData(this.sexData);
	  			this.sexPicker.show(function(items) {
					$("#sex-inp").val(items[0].text);
					$("#sex-inp").attr("data-sex",items[0].value);
					return true;
				});
	  		},
	  		showEducationSelect:function(){
	  			this.educationPicker = new mui.PopPicker();
				this.educationPicker.setData(this.educationData);
	  			this.educationPicker.show(function(items) {
	  				$("#education-inp").val(items[0].text);
					$("#education-inp").attr("data-education",items[0].value);
					return true;
				});
	  		},
	  		uploadHeaderImage:function(){
		  		var that = this; 
		  		//自定义选择图片
				muiHelper.uploadImg(function(index) {
					switch(index) {
						case 1:
							muiHelper.byCamera(function(path){
								console.info(path);
								that.goCropper(path);
							});
							break;
						case 2:
							muiHelper.byGallery(function(path){
								console.info(path);
								that.goCropper(path);
							},{ filter: "image", multiple: false });
							break;
						default:
							break;
						}
				});
	  		},
	  		goCropper:function(path){
	  			muiHelper.zipImg(path,function(zipPath){
					//进入剪切页面将当前压缩好的图片进行裁剪
					mui.openWindow({
						url: "../cropper.html",
						id: "cropper",
						extras: {
							waitImgUrl:zipPath,
					   	},
						show: {
							aniShow: "slide-in-bottom",
							duration: 300
						}
					});
//					muiHelper.getBase64(zipPath,function(base64){
//						that.submitHeaderImg(base64);
//					});
				});
	  		},
	  		submitHeaderImg:function(base64){
	  			console.info(base64);
		  		var that = this; 
				//上传到服务器
				muiHelper.muiHelperAjax(null, true, "/CnCustomberHeaderPicController/app/customber/headerPic", {
					"customberId":that.customber.id,
					"imageBase64":base64
				}, function(result) {
					if(result.success) {
						that.customber.heartImage = result.data.imageBase64;
						that.headerImageId = result.data.id;
						mui.toast(result.msg);
					} else {
						mui.toast(result.msg);
						return;
					}
				});
		  	},
		  	saveShop:function(){
		  		var that = this; 
		  		var customberBaseInfo = {
		  			id:that.customber.id,
		  			customberName:$("#customberName-inp").val().trim(),
		  			nation:$("#nation-inp").val().trim(),
		  			sex:$("#sex-inp").attr("data-sex"),
		  			education:$("#education-inp").attr("data-education"),
		  			hobby:$("#hobby-inp").attr("data-hobby"),
		  			height:$("#height-inp").val().trim(),
		  			job:$("#job-inp").val().trim(),
		  			heartImage:that.headerImageId,
		  			birthday:$("#birthday-inp").val().trim()
		  			
		  		};
		  		console.info("需要修改的信息:"+JSON.stringify(customberBaseInfo));
				//修改用户信息上传到服务器
				muiHelper.muiHelperAjax(null, true, "/CnCustomberController/app/update/customber/baseInfo",customberBaseInfo, function(result) {
					if(result.success) {
						//重新设置登陆者信息
						localStorageUtils.removeParam("customber");
						localStorageUtils.setParam("customber",JSON.stringify(result.data));
						plus.webview.getWebviewById('my_center_subpage').reload();
						plus.webview.close("personal_message", "slide-out-bottom", 300);
						mui.toast(result.msg);
					} else {
						mui.toast(result.msg);
						return;
					}
				});
		  	},
	  	},
	  	computed:{
	  		birthday:function(){
	  			return new Date(this.customber.birthday).Format("yyyy-MM-dd");
	  		},
	  	},
	  	watch:{
	  		base64:function(){
	  			this.submitHeaderImg(this.base64);
	  		}
	  	}
	});
	mui.back=function(){
  		mui.confirm("放弃保存?","保存信息",["放弃","继续"], function (e) {
			if (e.index == 0) {
				plus.webview.hide("personal_message", "slide-out-bottom", 300);
			}
		},"div");
	}
});
function uploadHeaderImg(base64){
	vm.$data.base64=base64;
}
