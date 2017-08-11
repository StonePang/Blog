// var log = console.log.bind(console)
//
// var ajax = function(request) {
//     var r = new XMLHttpRequest()
//     r.open(request.method, request.url, true)
//     if (request.contentType !== undefined) {
//         r.setRequestHeader('Content-Type', request.contentType)
//     }
//     r.onreadystatechange = function(event) {
//         if(r.readyState === 4) {
//             //在ajax中就将r.response转为对象
//             var response = JSON.parse(r.response)
//             request.callback(response)
//         }
//     }
//     if (request.method === 'GET') {
//         r.send()
//     } else {
//         var data = JSON.stringify(request.data)
//         r.send(data)
//     }
// }
//
// var apiMovie = {}

api.movieGet = function(callback) {
    var request = {
        method: 'GET',
        url: '/api/movie/get',
        contentType: 'application/json',
        callback: function(response) {
            // 不考虑错误情况(断网/服务器返回错误等等)
            callback(response)
        }
    }
    ajax(request)
}
