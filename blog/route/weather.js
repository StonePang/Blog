const weather = require('../model/weather')

var weatherData = {
    path: '/api/weather/:city',
    method: 'get',
    func: function(request, response) {
        var city = request.params.city
        var d = weather.data(city)
        var r = JSON.stringify(d)
        response.send(r)
    }
}

var routes = [
    weatherData,
]

module.exports.routes = routes
