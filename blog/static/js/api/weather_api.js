api.weather = function(city, callback) {
    var request = {
        method: 'GET',
        url: '/api/weather/' + city,
        contentType: 'application/json',
        callback: function(response) {
            // 不考虑错误情况(断网/服务器返回错误等等)
            callback(response)
        }
    }
    ajax(request)
}
