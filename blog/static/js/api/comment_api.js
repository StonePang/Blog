//定义comment相关的api函数，他们都作为对象的成员函数调用，看起来更清晰

api.commentAdd = function(data, callback) {
    // var d = JSON.stringify(data)
    var request = {
        method: 'POST',
        url: '/api/comment/add',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            // log('shoudaohouduan', response)
            callback(response)
        }
    }
    ajax(request)
}

api.commentDelete = function(data, callback) {
    var request = {
        method: 'POST',
        url: '/api/comment/delete',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            callback(response)
        }
    }
    ajax(request)
}
