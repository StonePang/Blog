const usercode = require('../model/usercode')

var ensure = {
    path: '/api/usercode/ensure',
    method: 'post',
    func: function(request, response) {
        var data = request.body
        // console.log(data)
        var d = data.input
        var result = usercode.ensure(d)
        var res = {
            result: result
        }
        // console.log('后端model返回的结果包装的对象', res)
        var r = JSON.stringify(res)
        response.send(r)
    }
}


var routes = [
    ensure,
]

module.exports.routes = routes
