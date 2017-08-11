api.todoAll = callback => {
    var request = {
        method: 'GET',
        url: '/api/todo/all',
        contentType: 'application/json',
        callback: function(response) {
            callback(response)
        }
    }
    ajax(request)
}

api.todoAdd = (data, callback) => {
    var request = {
        method: 'POST',
        url: '/api/todo/add',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            callback(response)
        }
    }
    ajax(request)
}

api.todoDelete = (id, callback) => {
    var request = {
        method: 'GET',
        url: `/api/todo/delete/${id}`,
        contentType: 'application/json',
        callback: function(response) {
            callback(response)
        }
    }
    ajax(request)
}

api.todoComplete = (id, callback) => {
    var request = {
        method: 'GET',
        url: `/api/todo/complete/${id}`,
        contentType: 'application/json',
        callback: function(response) {
            callback(response)
        }
    }
    ajax(request)
}
