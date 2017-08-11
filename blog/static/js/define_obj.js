//所有载入页面的函数
const loadPage = {}

//所有绑定事件的函数
const bindEvents = {}

//所有定义ajax函数的api函数
const api = {}

//所有对应api函数的回调函数
const callBack = {}

var log = console.log.bind(console)

var e = function(selector) {
    return document.querySelector(selector)
}

var es = function(selector) {
    return document.querySelectorAll(selector)
}

var appendHTML = function(element, html) {
	element.insertAdjacentHTML('beforeend', html)
}

var bindEvent = function(element, eventName, callback) {
    element.addEventListener(eventName, callback)
}

var toggleClass = function(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

var removeClassAll = function(className) {
    var selector = '.' + className
    var elements = document.querySelectorAll(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        e.classList.remove(className)
    }
}

var addClass2to1All = function(className1, className2) {
    var selector = '.' + className1
    var elements = document.querySelectorAll(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        if (!e.classList.contains(className2)) {
            e.classList.add(className2)
        }
    }
}

var removeClass2from1All = function(className1, className2) {
    var selector = '.' + className1
    var elements = document.querySelectorAll(selector)
    for (var i = 0; i < elements.length; i++) {
        var e = elements[i]
        if (e.classList.contains(className2)) {
            e.classList.remove(className2)
        }
    }
}


var bindAll = function(selector, eventName, callback) {
    var elements = document.querySelectorAll(selector)
    for(var i = 0; i < elements.length; i++) {
        var e = elements[i]
        bindEvent(e, eventName, callback)
    }
}

// find 函数可以查找 element 的所有子元素
var find = function(element, selector) {
    return element.querySelector(selector)
}

var findAll = function(element, selector) {
    return element.querySelectorAll(selector)
}

const addClassInSelAll = function (selector, className) {
    var doms = es(selector)
    for (var i = 0; i < doms.length; i++) {
        var dom = doms[i]
        if (!dom.classList.contains(className)) {
            dom.classList.add(className)
        }
    }
}

const removeClassInSelAll = function (selector, className) {
    var doms = es(selector)
    for (var i = 0; i < doms.length; i++) {
        var dom = doms[i]
        if (dom.classList.contains(className)) {
            dom.classList.remove(className)
        }
    }
}

const displayAll = function(selector) {
    removeClassInSelAll(selector, 'none')
}

const noneAll = function(selector) {
    addClassInSelAll(selector, 'none')
}


//封装原生ajax函数，传输数据的JSON过程均在AJAX中完成
var ajax = function(request) {
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType !== undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function(event) {
        if(r.readyState === 4) {
            var response = JSON.parse(r.response)
            request.callback(response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        var data = JSON.stringify(request.data)
        r.send(data)
    }
}


//封装swal库中的按钮函数
const sweetalert = {}

sweetalert.delete = function(callback) {
    let o = {
        title: "确定删除？",
        text: "无法恢复删除内容！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定删除！",
        closeOnConfirm: false,
        showLoaderOnConfirm: false,
    }
    swal(o, function() {
        callback()
    })
}

sweetalert.complete = function(str, callback) {
    let o = {
        title: `确定${str}？`,
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定",
        closeOnConfirm: false,
        showLoaderOnConfirm: false,
    }
    swal(o, function() {
        callback()
    })
}

sweetalert.close = function(callback) {
    let o = {
        title: "确定关闭吗？",
        text: "数据无法恢复！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定关闭",
        closeOnConfirm: true,
    }
    swal(o, function() {
        callback()
    })
}

sweetalert.input = function(callback) {
    let o = {
        title: "输入",
        text: "输入主人密码",
        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-bottom",
        // inputPlaceholder: "输入一些话"
    }
    swal(o, function(inputValue) {
        if (inputValue == '') {
            swal.showInputError("输入不能为空")
            return false
        }else {
            callback(inputValue)
        }
    })
}
