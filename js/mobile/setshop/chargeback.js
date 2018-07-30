//获取文本长度函数
function txtCont(elem){
	var val = $(elem).val();
	var len = val.length;
	return len;
}
$(".order-intro").on("input","textarea",function() {
	var valLen = txtCont(this);
	$(".order-intro i").text(valLen);
	if(valLen == 0) {
		$(".sure-btn button").attr({
			"disabled": "disabled"
		});
	} else {
		$(".sure-btn button").removeAttr("disabled");

	}
})