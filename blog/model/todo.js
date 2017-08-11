const log = console.log.bind(console)

var fs = require('fs')

var todoFilePath = 'db/todo.json'

class ModelTodo {
    constructor(form) {
        this.id = form.id || -1
        this.title = form.title || ''
        this.deadline = form.deadline || ''
        this.content = form.content || ''
        this.complete = form.complete || 'no'
        this.time = Math.floor(new Date() / 1000)
    }
}

const loadTodos = function() {
    var content = fs.readFileSync(todoFilePath, 'utf8')
    var todos = JSON.parse(content)
    return todos
}

var t = {
    data: loadTodos()
}

t.save = function(todos) {
    var s = JSON.stringify(todos, null, 2)
    fs.writeFileSync(todoFilePath, s, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('保存成功')
        }
    })

}

t.all = function() {
    var todos = this.data
    return todos
}

t.addTodo = function(form) {
    var todos = this.data
    var todo = new ModelTodo(form)
    if (todos.length == 0) {
        todo.id = 1
    } else {
        let lastTodo = todos[todos.length - 1]
        todo.id = lastTodo.id + 1
    }
    todos.push(todo)
    this.save(todos)
    return todos
}

t.deleteTodo = function(id) {
    var todos = this.data
    var t = {}
    var id = Number(id)
    var index = -1
    for (var i = 0; i < todos.length; i++) {
        var t = todos[i]
        if (t.id == id) {
            // 找到了
            index = i
            break
        }
    }
    // 判断 index 来查看是否找到了相应的数据
    if (index > -1) {
        // 找到了, 用 splice 函数删除
        // splice 函数返回的是包含被删除元素的数组
        // 所以要用 [0] 取出数据
        var t = todos.splice(index, 1)[0]
    }
    this.save(todos)
    return todos
}

t.complete = function(id) {
    var todos = this.data
    var t = {}
    id = Number(id)
    var index = -1
    for (var i = 0; i < todos.length; i++) {
        var t = todos[i]
        if (t.id == id) {
            // 找到了
            index = i
            break
        }
    }
    if (index > -1) {
        let t = todos[index]
        t.complete = ((t.complete == 'yes') ? 'no' : 'yes')
    }
    this.save(todos)
    return todos
}

module.exports = t
