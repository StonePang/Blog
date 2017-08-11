//定义blog相关的api函数，他们都作为对象的成员函数调用，看起来更清晰

api.blogAll = function(callback) {
    var request = {
        method: 'GET',
        url: '/api/blog/all',
        contentType: 'application/json',
        callback: function(response) {
            // 不考虑错误情况(断网/服务器返回错误等等)
            callback(response)
        }
    }
    ajax(request)
}

api.blogAdd = function(data, callback) {
    var request = {
        method: 'POST',
        url: '/api/blog/add',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            callback(response)
        }
    }
    ajax(request)
}

api.blogEdit = function(data, callback) {
    var request = {
        method: 'POST',
        url: '/api/blog/edit',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            callback(response)
        }
    }
    ajax(request)
}

api.blogDetail = function (id, callback) {
    var request = {
        method: 'GET',
        url: '/api/blog/' + id,
        contentType: 'application/json',
        callback: function(response) {
            // 不考虑错误情况(断网/服务器返回错误等等)
            callback(response)
        }
    }
    ajax(request)
}

api.blogDelete = function (data, callback) {
    // var d = JSON.stringify(data)
    var request = {
        method : 'POST',
        url : '/api/blog/delete',
        data : data,
        contentType : 'application/json',
        callback : function(response) {
            // 不考虑错误情况(断网/服务器返回错误等等)
            // log('result', response)
            callback(response)
        }
    }
    ajax(request)
}

api.blogCoverUpload = function(fd, callback) {
    var url = '/uploadBlogCover'
    var request = {
        url: url,
        method: 'post',
        data: fd,
        contentType: false,
        processData: false,
        success: function(r) {
            callback(r)
        },
        error: function(e) {
            log('上传失败', e)
        }
    }
    $.ajax(request)
}
