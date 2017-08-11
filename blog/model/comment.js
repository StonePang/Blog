var fs = require('fs')


var filePath = 'db/comment.json'


// 这是一个用来存储 comment 数据的对象
const ModelComment = function(form) {
    // || 是一种新的写法, 在 js 圈子里太过流行, 所以记住即可
    // a = b || c 意思是如果 b 是 undefined 或者 null 就把 c 赋值给 a
    this.author = form.author || ''
    this.content = form.content || ''
    this.blog_id = Number(form.blog_id || 0)
    this.replyCommentId = Number(form.replyCommentId)
    this.replyFatherExist = false
    // 生成一个 unix 时间, unix 时间是什么, 上课会说
    this.created_time = Math.floor(new Date() / 1000)
}

const loadData = function() {
    // 确保文件有内容, 这里就不用处理文件不存在或者内容错误的情况了
    // 注意, 一般都是这样不处理的
    var content = fs.readFileSync(filePath, 'utf8')
    var data = JSON.parse(content)
    return data
}


var c = {
    data: loadData()
}

c.all = function() {
    return this.data
}

c.getAuthorById = function(id) {
    var data = this.data
    for (var i = 0; i < data.length; i++) {
        var ele = data[i]
        if (ele.id == id) {
            return ele.author
        }
    }
    return ''
}

c.findChildrenById = function(data, id) {
    var ch = []
    for (var i = 0; i < data.length; i++) {
        var d = data[i]
        if (d.replyCommentId == id) {
            ch.push(d)
        }
    }
    return ch
}

c.getByBlogId = function(data, id) {
    var ch = []
    for (var i = 0; i < data.length; i++) {
        var d = data[i]
        if (d.blog_id == id) {
            ch.push(d)
        }
    }
    return ch
}

c.getBlogId = function(data, id) {
    var ch = []
    for (var i = 0; i < data.length; i++) {
        var d = data[i]
        if (d.id == id) {
            var blogId = d.blog_id
            break
        }
    }
    return blogId
}

c.new = function(form) {
    var m = new ModelComment(form)
    // 设置新数据的 id
    var d = this.data[this.data.length-1]
    if (d == undefined) {
        m.id = 1
    } else {
        m.id = d.id + 1
    }
    var replyCommentId = m.replyCommentId
    var replyCommentAuthor = this.getAuthorById(replyCommentId)
    m.replyCommentAuthor = replyCommentAuthor
    if (replyCommentId != -1) {
        m.replyFatherExist = true
    }
    // 把 数据 加入 this.data 数组
    this.data.push(m)
    // 把 最新数据 保存到文件中
    this.save()
    // 返回新建的数据
    return m
}

c.save = function() {
    var s = JSON.stringify(this.data, null, 2)
    fs.writeFileSync(filePath, s, (err) => {
      if (err) {
          console.log(err)
      } else {
          console.log('保存成功')
      }
    })
}

c.deleteById = function(id) {
    var comments = this.data
    var blogId = this.getBlogId(comments, id)
    var found = -1
    for (var i = 0; i < comments.length; i++) {
        var comment = comments[i]
        if (comment.id == id) {
            found = comment.id
            break
        }
    }
    // 用 splice 函数删除数组中的一个元素
    // 如果没找到, i 的值就是无用值, 删除也不会报错
    // 所以不用判断也可以
    var children = this.findChildrenById(comments, id)
    for (var j = 0; j < children.length; j++) {
        children[j].replyFatherExist = false
    }
    comments.splice(i, 1)
    var d = this.getByBlogId(comments, blogId)
    this.save()
    // 返回blogid下的所有评论数据
    return d
}

c.deleteByBlogid = function(blog_id) {
    var comments = this.data
    var found = false
    var result = []
    for (var i = 0; i < comments.length; i++) {
        var comment = comments[i]
        if (comment.blog_id != blog_id) {
            result.push(comment)
        }
    }
    //用新的数组替代this.data数组
    this.data = result
    this.save()
    found = true
    // console.log('删除博客评论后的新comment数据', this.data)
    return found
}


// 导出一个对象的时候用 module.exports = 对象 的方式
// 这样引用的时候就可以直接把模块当这个对象来用了(具体看使用方法)
module.exports = c
