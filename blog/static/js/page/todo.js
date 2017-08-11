class Todo {
    constructor(data) {
        this.title = data.title || ''
        this.deadline = data.deadline || ''
        this.content = data.content || ''
        this.time = data.time || ''
        this.id = data.id || -1
        this.complete = data.complete || ''
        this.currentTime = this.current()
        this.createdTime = this.created()
        this.deadlineTime = this.deadlinef()
        this.completeText = this.completeTextf()
        this.dlDate = this.dlDatef()
        this.dlTime = this.dltimef()
    }
    add0(num) {
        var str = String(num)
        while(str.length < 2) {
            str = '0' + str
        }
        return str
    }

    dlDatef() {
        var dl = this.deadline
        var date = dl.split('T')[0]
        var year = date.split('-')[0]
        var month = date.split('-')[1]
        var day = date.split('-')[2]
        return year + month + day
    }

    dltimef() {
        var dl = this.deadline
        var time = dl.split('T')[1]
        var hour = time.split(':')[0]
        var min = time.split(':')[1]
        return hour + min
    }

    format1(d) {
        var year = d.getFullYear()
        var month = this.add0(d.getMonth() + 1)
        var day = this.add0(d.getDate())
        var hour = this.add0(d.getHours())
        var min = this.add0(d.getMinutes())
        return `${year}-${month}-${day}T${hour}:${min}`
    }

    format2(d) {
        var year = d.getFullYear()
        var month = this.add0(d.getMonth() + 1)
        var day = this.add0(d.getDate())
        var hour = this.add0(d.getHours())
        var min = this.add0(d.getMinutes())
        return `${year}/${month}/${day}  ${hour}:${min}`
    }

    format3(str) {
        var date = str.split('T')[0]
        var time = str.split('T')[1]
        if (time == undefined) {
            time = '00:00'
        }
        var year = date.split('-')[0]
        var month = date.split('-')[1]
        var day = date.split('-')[2]
        var hour = time.split(':')[0]
        var min = time.split(':')[1]
        var res = `${year}/${month}/${day}  ${hour}:${min}`
        return res
    }

    current() {
        var d = new Date()
        return this.format1(d)
    }

    created() {
        var ct = new Date(this.time * 1000)
        return this.format2(ct)
    }
    deadlinef() {
        var str = this.deadline
        return this.format3(str)
    }
    completeTextf() {
        var completeText = {
            no : '完成',
            yes : '已完成'
        }
        return completeText[this.complete]
    }

}

class Todos {
    constructor(array) {
        this.data = this.getTodos(array)
        this.sortedComplete = this.getCompleteAllf()
        this.sortedUncomplete = this.getUncompleteAllf()
        this.sortedData = this.getSortedAllf()
        this.NumUncomplete = this.getNumUncomplete()
    }
    contains(arr, ele) {
        for (var i = 0; i < arr.length; i++) {
            var e = arr[i]
            if (e == ele) {
                return true
            }
        }
        return false
    }

    getTodos(array) {
        var arr = []
        for (var i = 0; i < array.length; i++) {
            var a = array[i]
            var todo = new Todo(a)
            arr.push(todo)
        }
        return arr
    }

    sorted(arr) {
        var array = arr.slice(0)
        array.sort(function(a,b){
            if(Number(a.dlDate) != Number(b.dlDate)) {
                return Number(a.dlDate) - Number(b.dlDate)
            }else {
                if (Number(a.dlTime) != Number(b.dlTime)) {
                    return Number(a.dlTime) - Number(b.dlTime)
                }else {
                    return 0
                }
                return 0
            }
        })
        return array
    }

    sortedAll(arr) {
        var a = this.sorted(arr)
        var d = this.getdlDateAllf(a)
        var res = this.getSortedData(a, d, 'all')
        return res
    }

    getSortedAllf() {
        var data = this.data
        return this.sortedAll(data)
    }

    getCompleteAllf() {
        var arr = []
        for (var i = 0; i < this.data.length; i++) {
            var ele = this.data[i]
            if (ele.complete == 'yes') {
                arr.push(ele)
            }
        }
        var data = arr
        return this.sortedAll(data)
    }

    getUncompleteAllf() {
        var arr = []
        for (var i = 0; i < this.data.length; i++) {
            var ele = this.data[i]
            if (ele.complete == 'no') {
                arr.push(ele)
            }
        }
        var data = arr
        return this.sortedAll(data)
    }

    getdlDateAllf(array) {
        var arr = []
        for (var i = 0; i < array.length; i++) {
            var ele = array[i].dlDate
            if (!this.contains(arr, ele)) {
                arr.push(ele)
            }
        }
        return arr
    }

    getSortedData(dataArray, dateArray, com) {
        var d = []
        for (var i = 0; i < dateArray.length; i++) {
            var a = []
            var date = dateArray[i]
            for (var j = 0; j < dataArray.length; j++) {
                var data = dataArray[j]
                if (data.dlDate == date) {
                    a.push(data)
                }
            }
            var eachDate = {
                complete: com,
                deadlineDate: date,
                todos: a,
            }
            d.push(eachDate)
        }
        return d
    }

    getNumUncomplete() {
        var count = 0
        var data = this.data
        for (var i = 0; i < data.length; i++) {
            var ele = data[i]
            if (ele.complete == 'no') {
                count += 1
            }
        }
        return count
    }
}

class Time {
    constructor() {
        this.currentTime = this.current()
    }
    add0(num) {
        var str = String(num)
        while(str.length < 2) {
            str = '0' + str
        }
        return str
    }

    format1(d) {
        var year = d.getFullYear()
        var month = this.add0(d.getMonth() + 1)
        var day = this.add0(d.getDate())
        var hour = this.add0(d.getHours())
        var min = this.add0(d.getMinutes())
        return `${year}-${month}-${day}T${hour}:${min}`
    }

    current(){
        var d = new Date()
        return this.format1(d)
    }
}

var stringformat = function(str) {
    var s = ''
    for (var i = 0; i < str.length; i++) {
        var c = str[i]
        if (c == '\n') {
            c = '<br>'
        }
        s += c
    }
    return s
}

var insertData = function(datas, selector) {
    for (var i = 0; i < datas.length; i++) {
        var d = datas[i]
        var dlDate = d.deadlineDate
        var year = dlDate.slice(0, 4)
        var month = dlDate.slice(4, 6)
        var day = dlDate.slice(6, 8)
        var html = `
        <div class="deadline-date" data-deadline_date='${dlDate}'>
            <div class='dldate'>${year}/${month}/${day}</div>
        </div>
        `
        var todoList = e(selector).querySelector('.todoList')
        appendHTML(todoList, html)
        var ts = d.todos
        insertEachDate(ts, selector)
    }
}

var insertEachDate = function(datas, selector) {
    for (var j = 0; j < datas.length; j++) {
        var data = datas[j]
        showData(data, selector)
    }
}

//插入一个li元素
var showData = (d, selector) => {
    var title = d.title
    var content = d.content
    var id = d.id
    var createdTime = d.createdTime
    var deadline = d.deadlineTime
    var complete = d.complete
    var text = d.completeText
    var deadlineDate = d.dlDate
    var deadlineTime = deadline.slice(12)
    var html =
        `
        <div class='list ${complete}' data-id=${id} data-complete=${complete}>
            <div class='deadline'>${deadlineTime}</div>
            <div class='title'>
                ${title}
                <div class='l-complete'></div>
            </div>
            <div class='l none' data-ct='${createdTime}' data-dl='${deadline}' data-content='${content}'></div>
            <div class='l-delete'>×</div>
        </div>
        `
    var deadlineDates = e(selector).querySelectorAll('.deadline-date')
    for (var i = 0; i < deadlineDates.length; i++) {
        var d = deadlineDates[i]
        if (deadlineDate == d.dataset.deadline_date) {
            appendHTML(d, html)
        }
    }
    var lists = es('.list')
    for (var i = 0; i < lists.length; i++) {
        var list = lists[i]
        var oddEven = {
            '0': 'even',
            '1': 'odd'
        }
        var oe = oddEven[String(i % 2)]
        list.classList.add(oe)
    }
}

callBack.refreshTodos = function(data) {
    var todos = new Todos(data)
    var sortedCompleteData = todos.sortedComplete
    var sortedUncompleteData = todos.sortedUncomplete
    var ts = es('.todoList')
    for (var i = 0; i < ts.length; i++) {
        var t = ts[i]
        t.innerHTML = ''
    }
    insertData(sortedUncompleteData, '.uncomplete-todos')
    insertData(sortedCompleteData, '.complete-todos')
    var num = todos.NumUncomplete
    setReminderNum(num)
    var t = new Time()
    e('.todo-title').value = ''
    e('.todo-deadline').value = ''
    e('.todo-content').value = ''
}

//绑定add按钮
bindEvents.todoAdd = function() {
    var buttonAdd = document.querySelector('.add')
    buttonAdd.addEventListener('click', function() {
        var title = e('.todo-title').value
        var deadline = e('.todo-deadline').value
        var content = e('.todo-content').value
        //输入不是空时调用api
        if (title != '' && deadline != '' && content != '') {
            var data = {
                title: title,
                deadline: deadline,
                content: content,
            }
            api.todoAdd(data, function(data) {
                callBack.refreshTodos(data)
            })
        }
    })
}

bindEvents.todoDelete = function() {
    var todo = document.querySelector('.todos')
    todo.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('l-delete')) {
            sweetalert.delete(function() {
                var list = self.closest('.list')
                var id = list.dataset.id
                api.todoDelete(id, function(data) {
                    swal("删除！", "事件删除成功", "success")
                    callBack.refreshTodos(data)
                    e('.add-block').innerHTML = ''
                })
            })
        }
    })
}

bindEvents.todoComplete = function() {
    var todo = document.querySelector('.todos')
    todo.addEventListener('click', function(event) {
        var self = event.target
        var list = self.closest('.list')
        if (self.classList.contains('l-complete')) {
            var id = list.dataset.id
            var com = list.dataset.complete
            var str = {
                'no': '完成',
                'yes': '取消完成',
            }
            sweetalert.complete(str[com], function() {
                api.todoComplete(id, function(data) {
                    swal("成功", "成功", "success")
                    callBack.refreshTodos(data)
                })
            })
        }
    })
}



//绑定input输入时的回车down
bindEvents.inputEnter = function(event) {
    var inputs = es('input')
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i]
        input.addEventListener('keydown', function(event) {
            if (event.key == 'Enter') {
                var title = e('.todo-title').value
                var deadline = e('.todo-deadline').value
                var content = e('.todo-content').value
                //输入不是空时调用api
                if (title != '' && deadline != '' && content != '') {
                    var data = {
                        title: title,
                        deadline: deadline,
                        content: content,
                    }
                    api.todoAdd(data, function(data) {
                        callBack.refreshTodos(data)
                    })
                }
            }
        })
    }
}


bindEvents.inputDate = function() {
    var i = e('.todo-deadline')
    i.addEventListener('focus', function() {
        var t = new Time()
        i.min = t.currentTime
        i.value = t.currentTime
    })
}

bindEvents.showAdd = function() {
    var showAdd = e('.add-todo')
    showAdd.addEventListener('click', function() {
        var addBlock = e('.ab')
        var newform = e('.nb')
        addBlock.classList.toggle('none')
        newform.classList.toggle('none')
    })
}

bindEvents.showContent = function() {
    var todo = e('.todos')
    todo.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('title')) {
            var com = {
                yes: '已完成',
                no: '未完成',
            }
            var title = self.innerText
            var list = self.closest('.list')
            var id = list.dataset.id
            var complete = com[list.dataset.complete]
            var l = list.querySelector('.l')
            var content = stringformat(l.dataset.content)
            var deadline = l.dataset.dl
            var createdTime = l.dataset.ct
            var addBlock = e('.ab')
            addBlock.dataset.id = id
            addBlock.dataset.complete = complete
            var t = `
                <div class="con-title">${title}</div>
                <div class="con-deadline"><span class='hhh'>截止时间：</span>${deadline}</div>
                <div class="con-createdtime"><span class='hhh'>创建时间：</span>${createdTime}</div>
                <div class="con-complete"><span class='hhh'>完成情况：</span>${complete}</div>
                <div class="con-content">${content}</div>
                `
            var add = e('.add-block')
            add.innerHTML = t
            displayAll('.ab')
            noneAll('.nb')
            var listAll = es('.list')
            removeClassInSelAll('.list', 'bgcolor')
            list.classList.add('bgcolor')
        }
    })
}

loadPage.todoAll = function() {
    api.todoAll(function(data){
        callBack.refreshTodos(data)
    })
}

const setReminderNum = function(num) {
    var rmdNum = document.querySelector('.reminder-num')
    rmdNum.innerHTML = num
    if (num > 0) {
        rmdNum.classList.remove('hide')
    }else {
        rmdNum.classList.add('hide')
    }
    localStorage.reminderNum = num
}
