$(function() {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录”的链接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui中获取form对象
    var form = layui.form
    var layer = layui.layer
        // 通过form.verify自定义校验规则
    form.verify({
        // 自定义一个psw校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码一致的规则
        repwd: function(value) {
            // 通过形参拿到确认密码框中的值
            // 还需拿到密码框中的内容
            // 然后进行一次等号的判断
            // 如果失败就return提示失败信息
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })


    $('#form_reg').on('submit', function(e) {
            e.preventDefault()
                // 监听注册表单的提交事件
            var data = {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            }
            $.post('/api/reguser', data, function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('注册成功，请登录！')
                        // 模拟人的点击行为
                    $('#link_login').click()
                }

            )
        })
        // 监听登录表单事件
    $('#form_login').submit(function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                    // console.log(res.token)
                    // 将登录成功得到的token字符串，保存到localStorage中
                    // localStorage.setItem('token', res.token)
                localStorage.setItem('token', res.token)
                    // 跳转到后台页面
                location.href = '/index.html'
            }
        })
    })

})