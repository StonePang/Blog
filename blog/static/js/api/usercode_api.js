
api.usercodeEnsure = function(data, callback) {
    var request = {
        method: 'POST',
        url: '/api/usercode/ensure',
        data: data,
        contentType: 'application/json',
        callback: function(response) {
            callback(response)
        }
    }
    ajax(request)
}
