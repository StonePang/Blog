const movie = require('../model/movie')

var getMovies = {
    path: '/api/movie/get',
    method: 'get',
    func: function(request, response) {
        console.log('准备开始爬虫')
        var movies = movie.getMovies()
        var r = JSON.stringify(movies, null, 2)
        response.send(r)
    }
}


var routes = [
getMovies,
]

module.exports.routes = routes
