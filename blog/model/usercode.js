var fs = require('fs')

var usercodeFilePath = 'db/usercode.json'

const loadUsercode = function() {
    // 确保文件有内容, 这里就不用处理文件不存在或者内容错误的情况了
    // 注意, 一般都是这样不处理的
    var content = fs.readFileSync(usercodeFilePath, 'utf8')
    var usercode = JSON.parse(content)
    return usercode
}

var u = {
    data: loadUsercode()
}

u.ensure = function(d) {
    var code = this.data
    // console.log('后端model得到的结果', code, d)
    return code == d
}

module.exports = u
