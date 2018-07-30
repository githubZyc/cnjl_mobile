// 当前环境为沉浸式状态栏模式
mui.ready(function () {
    var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
        var immersed=21;
        var header = document.querySelector('header');
        var content = document.querySelector('.mui-bar-nav~.mui-content');
        var wrapper = document.querySelector('.mui-content>.mui-scroll-wrapper');
        if (header) {
        	//header.style.backgroundColor='#A6A6D2';
            var topoffset = immersed + 44;
            header.style.paddingTop = immersed + 'px';
            header.style.height = topoffset + 'px';
        }
    /*}*/
});