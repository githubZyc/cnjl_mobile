// JavaScript Document
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var html = document.documentElement;
        var windowWidth = html.clientWidth;
        html.style.fontSize = windowWidth / 6.4 + 'px';

    }, false);
    })();


	window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function(event){

        if ( window.orientation == 180 || window.orientation==0 ) {
            var html = document.documentElement;
            var windowWidth = html.clientWidth;
            html.style.fontSize = windowWidth / 6.4 + 'px';

        }
        if( window.orientation == 90 || window.orientation == -90 ) {
            var html = document.documentElement;
            var windowWidth = html.clientHeight;
            html.style.fontSize = windowWidth / 6.4 + 'px';

        }

        location.reload();

});




	 // 等价于html.style.fontSize = windowWidth / 640 * 100 + 'px';
        // 这个6.4就是根据设计稿的横向宽度来确定的，假如你的设计稿是750
        // 那么 html.style.fontSize = windowWidth / 7.5 + 'px';
