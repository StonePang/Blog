const todo = require('../model/todo')

const sendJSON = function(response, data) {
    var r = JSON.stringify(data, null, 2)
    response.send(r)
}

var all = {
    path: '/api/todo/all',
    method: 'get',
    func: function(request, response) {
        var todos = todo.all()
        sendJSON(response, todos)
    }
}

var add = {
    path: '/api/todo/add',
    method: 'post',
    func: function(request, response) {
        var form = request.body
        var t = todo.addTodo(form)
        sendJSON(response, t)
    }
}

var deleteTodo = {
    path: '/api/todo/delete/:id',
    method: 'get',
    func: function(request, response) {
        var id = request.params.id
        var t = todo.deleteTodo(id)
        sendJSON(response, t)
    }
}

var completeTodo = {
    path: '/api/todo/complete/:id',
    method: 'get',
    func: function(request, response) {
        var id = request.params.id
        var t = todo.complete(id)
        sendJSON(response, t)
    }
}

var routes = [
    all,
    add,
    deleteTodo,
    completeTodo,
]

module.exports.routes = routes
