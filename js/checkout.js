//---预加载开始	
var systenFolder="";
$(document).ready(function(){

		//为所有的radio绑定监听事件
		$("input[name='ca_id']").each(function(index){
			$(this).click(function(){
				if($(this).val()!=0){
					
					$("#selectAddr").hide();
				//	$("#detailAddr").hide();
					var name = $("#li_name"+this.value).val();
					var tel = $("#li_tel"+this.value).val();
					var mobile = $("#li_mobile"+this.value).val();
					var email = $("#li_email"+this.value).val();
					var address=$("#li_name_Address"+this.value).val();
					$("#con_name").val(name);
					$("#con_tel").val(tel);
					$("#con_mobile").val(mobile);
					$("#con_email").val(email);
					$("#address").val(address);
				}else{
					$("#selectAddr").fadeIn("normal");
					$("#detailAddr").fadeIn("normal");
					$("#con_name").val("");
					$("#con_tel").val("");
					$("#con_mobile").val("");
					$("#con_email").val("");
				}
			});
		});
			//pid:父ID,addr:赋值给的标签ID
		var asyncArea=function(pId,addr){
			jq.ajax({
				type:"post",
				data:{parentId:pId},
				url:systenFolder+"appController/asyncGetArea",
				dataType:"html",
				success:function(data,status){
					if("success"==status){
						$("#"+addr).empty();
						$("#"+addr).append("<option value=\"0\">=选择=</option>"+data);
					}else{
						$("#"+addr).empty();
					}
				}
			});
		}
		var jq =$;
		//初始化市列表
		asyncArea($("#province").val(),"city");
		
		$("#province").bind({change:function(){
			$("#county").empty();
			if($(this).val()!=0){
				asyncArea($(this).val(),"city");
			}
		}});
		$("#city").change(function(){
			if($(this).val()!=0){
				asyncArea($(this).val(),"county");
			}
		});
		$("#county").change(function(){
			if($(this).val()!=0){
				asyncArea($(this).val(),"street");
			}
		});
});
//---显示和隐藏
function showOrHide(showID,hideID)
{
	$("#"+showID).show();
	$("#"+hideID).hide();
}
//---预加载结束	
//设置默认收货地址
	function setDefault(caid){
		var jq =$;
		jq.ajax({
			type:"post",
			data:{ca_id:caid},
			url:systenFolder+"appController/asyncSetDefaultConsignee",
			dataType:"text",
			success:function(data,status){
				if("success"==status){
					var flag = parseInt(data);
					if(flag==1){
						//alert("默认地址设置成功!");
						$("span[id^='span_']").each(function(){
							$(this).show();
						});
						$("#span_"+caid).hide();
						$("input[name='ca_id']").each(function(item){
							if($(this).val()==caid){
								$(this).attr("checked","checked");
							}
						});
					}else{
						alert("默认地址设置失败!");
					}
				}
			}
		});
	}
	//删除收货地址
	function delConsignee(caid){
		var jq =$;
		jq.ajax({
			type:"post",
			data:{ca_id:caid},
			url:systenFolder+"appController/asyncDelConsignee",
			dataType:"text",
			success:function(data,status){
				if("success"==status){
					var flag = parseInt(data);
					if(flag==0){
						$("#li_"+caid).remove();
					}else if(flag==1){
						alert("用户未登陆!");
					}else{
						alert("删除失败!");
					}
				}
			}
		});
	}
///异步提交 修改收获地址
	function addressInfo(a_name,a_province,a_city,a_county,a_address,a_email,a_tel,a_mobile,a_postcode){
			this.name=a_name;
			this.province=a_province;
			this.city=a_city;
			this.county=a_county;
			this.address=a_address;
			this.email=a_email;
			this.tel=a_tel;
			this.mobile=a_mobile;
			this.postcode=a_postcode;
	};
	///异步保存 收获地址
	function asyncSaveAddress()
	{
		
		var addrInfo=null;
		var jsonStr=null;
		var checkoutCa_id=$("input[name='ca_id']:checked").val();
		if(typeof(checkoutCa_id)=="undefined")
		{
			alert("请选择地址！");
			return "";
		}
		var com_name="";
		var province="";
		var city="";
		var county="";
		var province_title="";
		var city_title="";
		var count_titel="";
		var address="";
		var tel="";
		var mobile="";
		var email="";
		var postcode="";
	
		
		//判断是否是新建地址
		if(checkoutCa_id=="0")
		{
			 com_name=$("#con_name").val();
			 province=$("#province").val();
			 city=$("#city").val();
			 county=$("#county").val();
			 province_title=$("#province").find("option:selected").text();
			 city_title=$("#city").find("option:selected").text();
			 count_titel=$("#county").find("option:selected").text();
			 address=$("#address").val();
			 tel=$("#con_tel").val();
			 mobile=$("#con_mobile").val();
			 email=$("#con_email").val();
			 postcode=$("#con_postcode").val();
		}
		else
		{
			 com_name=$("#con_name").val();
			 province=$("#li_id_Province"+checkoutCa_id).val();
			 city=$("#li_id_City"+checkoutCa_id).val();
			 county=$("#li_id_County"+checkoutCa_id).val();
			 province_title=$("#li_name_Province"+checkoutCa_id).val();
			 city_title=$("#li_name_City"+checkoutCa_id).val();
			 count_titel=$("#li_name_County"+checkoutCa_id).val();
			 address=$("#address").val();
			 tel=$("#con_tel").val();
			 mobile=$("#con_mobile").val();
			 email=$("#con_email").val();
			 postcode=$("#con_postcode").val();
		}
		if ( province=="0" )
		{
			alert("请选择配送地区省份");
			return(false);
		}
		if ( city=="0" )
		{
			alert("请选择配送地区城市");
			return(false);
		}
		
		if ( Utils.isEmpty(com_name))
		{
			alert("收货人姓名不能为空");
			return(false);
		}
		
	
		if ( Utils.isEmpty(address) )
		{
			alert("收货人详细地址不能为空");
			return(false);
		}
		if(mobile == "" || !Utils.isTelePhone(mobile))
		{
			alert("手机号码格式不正确");
			return(false);
		}
		if ( !Utils.isEmpty(email) )
		{
			if ( !Utils.isEmail(email) )
			{
				alert("收货人电子邮件地址格式不正确");
				return(false);
			}
		}
		
		
		
		if ( !Utils.isEmpty(postcode) )
		{
			if ( !Utils.isNumber(postcode))
			{
				alert("收货人邮编格式不正确");
				return(false);
			}
		}
		$.ajax({
			type:"post",
			data:{name:com_name,province:province,city:city,county:county,address:address,email:email,tel:tel,mobile:mobile,postcode:postcode,ca_id:checkoutCa_id},
			url:systenFolder+"appController/asynccheckoutConsigneeAddress",
			dataType:"text",
			success:function(data,status){
				if(data=="1")
				{
					$("#sendername").html(com_name);
					$("#sendercity").html(province_title+" "+city_title+" "+count_titel);
					$("#senderaddress").html(address);
					$("#sendermobile").html(mobile);
					$("#seenderphone").html(tel);
					$("#senderpostcode").html(postcode);
					$("#senderemail").html(email);
					showOrHide('part_consignee','part_consignee1');
				}
				
			}
		});
	}
	//显示不同的支付方式
	function showsubmenu(sid)
	{ 
		for(i=1;i<7;i++)
		{
			if (parseInt(sid)==i)
			{
				document.getElementById("submenu"+i).style.display="";
			}
			else 
			{
				document.getElementById("submenu"+i).style.display="none";
			}
		}
	}
	//保存支付方式
	function savePayType()
	{
		showOrHide('o_show1','o_show2');
	}
	//提交
	function check(theForm)
	{
		var part_consignee1Show=$("#part_consignee1").is(":hidden");
		var o_show2Show=$("#o_show2").is(":hidden");
		var part_consignee2Show=$("#part_consignee2").is(":hidden");
		if(part_consignee1Show==false)
		{
			alert("请保存收货地址！")
			return (false);
		}
		if(o_show2Show==false)
		{
			alert("请确认支付方式！")
			return (false);
		}
		if(part_consignee2Show==false)
		{
			alert("请确认发票信息！")
			return (false);
		}
		var flag = false;
		if (theForm.delivery_type.length>1)
		{
			for (i=0; i<theForm.delivery_type.length; i++)
			{
				if(theForm.delivery_type[i].checked)
				{
					flag = true;
					break;
				}
			}
		}
		else
		{
				if(theForm.delivery_type.checked)
				{
					flag = true;
				}
		}
		if ( !flag )
		{
			alert("请选择一种配送方式");
			return(false);
		}
		
		flag = false;
		if (theForm.pay_type.length>1)
		{
			for (i=0; i<theForm.pay_type.length; i++)
			{
				if(theForm.pay_type[i].checked)
				{
					flag = true;
					break;
				}
			}
		}
		else
		{
				if(theForm.pay_type.checked)
				{
					flag = true;
				}
		}
		if ( !flag )
		{
			alert("请选择一种支付方式");
			return(false);
		}
		if($("#sendername").text()==null || $.trim($("#sendername").text())=="")
		{
			alert("请填收货人姓名！");
			return (false);
		}
		if($("#sendercity").text()==null || $.trim($("#sendercity").text())=="")
		{
			alert("请填写省市！");
			return (false);
		}
		if($("#senderaddress").text()==null || $.trim($("#senderaddress").text())=="")
		{
			alert("请填写收货地址！");
			return (false);
		}
		if($("#sendermobile").text()==null || $.trim($("#sendermobile").text())==""|| !Utils.isTelePhone( $.trim($("#sendermobile").text())))
		{
			alert("手机号码格式不对，请重新填写！");
			return (false);
		}
		flag = false;
		if (theForm.invoice_flag.length>1)
		{
			for (i=0; i<theForm.invoice_flag.length; i++)
			{
				if(theForm.invoice_flag[i].checked)
				{
					flag = true;
					break;
				}
			}
		}
		else
		{
				if(theForm.invoice_flag.checked)
				{
					flag = true;
				}
		}
		if ( !flag )
		{
			alert("请选择发票种类");
			return(false);
		}
	}
	