 const comment = require('../model/comment')
const blog = require('../model/blog')

//此文件是对主页和详细页页面的加载的后端函数

var sendHtml = function(path, response) {
    var fs = require('fs')
    var options = {
        encoding: 'utf-8'
    }
    //将服务器path下的html文件作为响应数据发出
    path = 'template/' + path
    fs.readFile(path, options, function(err, data){
        // console.log(`读取的html文件 ${path} 内容是`, typeof data, data)
        // 替换参数
        response.send(data)
    })
}

//配置index页
var index = {
    path: '/',
    method: 'get',
    func: function(request, response) {
        var path = 'index.html'
        sendHtml(path, response)
    }
}

//后端返回blog_detail.html字符串,因为要修改字符串中的内容作为id，所以发送的是JSON字符串
var blogDetail = {
    path: '/blog/:id',
    method: 'get',
    func: function(request, response) {
        var blog_id = request.params.id
        var path = 'blog_detail.html'
        var fs = require('fs')
        var options = {
            encoding: 'utf-8'
        }
        path = 'template/' + path
        fs.readFile(path, options, function(err, data){
            // console.log(`读取的html文件 ${path} 内容是`, data)
            // 替换参数
            data = data.replace('{{blog_id}}', blog_id)
            response.send(data)
        })
    }
}

//配置movie页
var movie = {
    path: '/movie',
    method: 'get',
    func: function(request, response) {
        var path = 'movie.html'
        sendHtml(path, response)
    }
}

var todo = {
    path: '/todo',
    method: 'get',
    func: function(request, response) {
        var path = 'todo.html'
        sendHtml(path, response)
    }
}

var music = {
    path: '/music',
    method: 'get',
    func: function(request, response) {
        var path = 'music.html'
        sendHtml(path, response)
    }
}




var routes = [
    index,
    blogDetail,
    movie,
    todo,
    music,
]

module.exports.routes = routes
