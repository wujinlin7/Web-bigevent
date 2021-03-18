// 注意：每次调用$.get()或$.post()或$.ajax()的时候
// 会先调用ajaxPrefilter函数
// 在这个函数可以拿到我们给Ajax配置的对象

$.ajaxPrefilter(function(options) {
    //在发起真正的Ajax请求之前，统一配置请求的根路径 

    options.url = 'http://ajax.frontend.itheima.net' + options.url
        // console.log(options.url);
        // 统一为有权限的接口，设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 统一挂载complete回调函数
    options.complete = function(res) {
        // console.log(res);
        // 在complete函数中可以使用res.responseJSON服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空token
            localStorage.removeItem('token')
                // 2.强制跳转到登录页面
            location.href = '/login.html'
        }
    }

})