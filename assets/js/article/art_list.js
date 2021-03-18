$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        //定义模板时间过滤器
    template.defaults.imports.DateFormat = function(date) {
            const dt = new Date(date);
            var y = dt.getFullYear();
            var m = patZero(dt.getMonth() + 1);
            var h = patZero(dt.getDate());

            var hh = patZero(dt.getHours());
            var mm = patZero(dt.getMinutes());
            var ss = patZero(dt.getSeconds());
            return y + '-' + m + '-' + h + ' ' + hh + ":" + mm + ":" + ss;
        }
        // 补0函数
    function patZero(n) {
        return n < 9 ? '0' + n : n;
    }


    // 定义一个查询的参数对象，将来请求数据时，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cata_id: '', //文章分类的Id
        state: '', //文章发布状态
    }
    initCate()
    initTable()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                console.log('ok');
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类列表失败！')
                }
                // 调用模板引擎渲染分类的可选性
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // console.log(htmlStr)
                    // 调用form.render()方法将分类可选内容渲染出来
                form.render()
            }

        })
    }

    // 为筛选表单绑定submit 事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            // 获取表单中选中项的值
        var cata_id = $('[name=cata_id]').val()
        var state = $('[name=state]').val()
            // 为查询对象q 中的对应属性赋值
        q.cata_id = cata_id
        q.state = state
            // 根据最新的筛选条件 重新渲染表格数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用   laypage.render()方法来渲染分页结构
        laypage.render({
            elem: 'pageBox', //分页容器的id,不用带#号
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换时，触发jump回调
            // 触发jump 回调的两种方式
            // 1、点击页码时触发jump函数
            // 2、只要调用laypage.render()方法，就会触发jump回调
            jump: function(obj, first) {
                // console.log(obj.curr);
                // 把最新页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                    // 把最新条目数，赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit
                    // 通过first值来判断哪种方式触发junp回调
                    // 如果first值是true,则是方式2触发
                    // 反之就是方式1
                if (!first) {
                    initTable()
                }
                // 根据最新的q获取对应的数据列表，并渲染表格
            }
        })

    }

    // 删除数据的方法 通过代理事件，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function() {
            var len = $('.btn-delete').length
                // 获取到文章的id
            var id = $(this).attr('data-id')
                // var index = null

            // 询问用户是否删除数据
            layer.confirm('确认删除？', { icon: 3, title: '提示' }, function() {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/delete/' + id,
                    success: function(res) {
                        if (res.status !== 0) {
                            return layer.msg('删除文章失败！')
                        }
                        layer.msg('删除文章成功！')
                            // 当数据删除完成后，需要判断当前这一页中，是否还有剩余数据
                            // 如果没有剩余的数据，则让页码值减1之后，再重新调用initTable()方法
                        if (len === 1) {
                            // 如果len的值等于1，证明删除完毕后，页面上没有任何数据,页码值最小值必须是1
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        }
                        initTable()
                    }
                })
            })
            layer.close()
        })
        // 通过代理事件,为btn-edit按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function() {
        // var id = $(this).attr('data-id')
        //     // console.log(id);
        //     // 发起请求获取对应数据
        // $.ajax({
        //     method: 'GET',
        //     url: '/my/article/cates/' + id,
        //     success: function(res) {
        //         // console.log(res);
        //         // form.val('form-pubEdit', res.data)
        //     }
        // })
        //1.获取文章ID
        location.href = './art_edit.html?id=' + $(this).attr('data-id')
            // 6. 监听编辑按钮的点击事件

        // 2.发送ajax请求

    })
})