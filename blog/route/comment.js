const comment = require('../model/comment')


var all = {
    path: '/api/comment/all',
    method: 'get',
    func: function(request, response) {
        var comments = comment.all()
        var r = JSON.stringify(comments)
        response.send(r)
    }
}

var add = {
    path: '/api/comment/add',
    method: 'post',
    func: function(request, response) {
        // 浏览器发过来的数据我们一般称之为 form (表单)
        var form = request.body
        // 插入新数据并返回
        var b = comment.new(form)
        var r = JSON.stringify(b)
        // console.log('后端发出', r)
        response.send(r)
    }
}

var deleteComment = {
    path: '/api/comment/delete',
    method: 'post',
    func: function(request, response) {
        // 浏览器发过来的数据我们一般称之为 form (表单)
        var form = request.body
        // 删除数据并返回结果
        var data = comment.deleteById(form.id)
        var r = JSON.stringify(data)
        response.send(r)
    }
}


var routes = [
    all,
    add,
    deleteComment,
]

module.exports.routes = routes
