// 注意：每次调用$.get()或$.post()或$.ajax()的时候
// 会先调用ajaxPrefilter函数
// 在这个函数可以拿到我们给Ajax配置的对象

$.ajaxPrefilter(function(options) {
    //在发起真正的Ajax请求之前，统一配置请求的根路径 

    options.url = 'http://ajax.frontend.itheima.net' + options.url
    console.log(options.url);
})