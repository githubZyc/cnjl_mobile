/*@charset "gb2312";*/

if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
   //alert(navigator.userAgent); 
   
   //add a new meta node of viewport in head node
	head = document.getElementsByTagName('head');
	viewport = document.createElement('meta');
	viewport.name = 'viewport';
	viewport.content = 'target-densitydpi=device-dpi, width=' + 640 + 'px, user-scalable=no';
	head.length > 0 && head[head.length - 1].appendChild(viewport);    
   
}
	
$(function(){
	 var wechat_developer_reload = function(){
		$('body').append('<input type="button" value="refresh" onclick="window.location.reload();"/>');	 
	} 
	//wechat_developer_reload();
	
	if (window.console) {
		console.info(">>Join us? Email：developer@qietu.com");
	}		
	
	//页面不足一屏，铺满一屏
	$('.layout').css('min-height',$(window).height());
	
	$('.fx').click(function(){
			if($('.share').hasClass('on')){
				$('.share').slideUp();
				$('.share').removeClass('on');
				}else{
					$('.share').slideDown();
					$('.share').addClass('on');
					}
		})
		
	$('.a5_1').click(function(){
			if($('.tc').hasClass('on')){
				$('.tc').slideUp();
				$('.tc').removeClass('on');
				}else{
					$('.tc').slideDown();
					$('.tc').addClass('on');
					}
		})
	
	

})
