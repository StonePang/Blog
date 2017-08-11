var fs = require('fs')


var blogFilePath = 'db/blog.json'


// 这是一个用来存储 Blog 数据的对象
const ModelBlog = function(form) {
    // || 是一种新的写法, 在 js 圈子里太过流行, 所以记住即可
    // a = b || c 意思是如果 b 是 undefined 或者 null
    // 就把 c 赋值给 a
    this.id = form.id || ''
    this.title = form.title || ''
    this.author = form.author || 'Stone'
    this.content = form.content || ''
    // 生成一个 unix 时间, unix 时间是什么, 上课会说
    this.created_time = Math.floor(new Date() / 1000)
    this.edit_time = ''
    this.temp_path = form.temp_path || ''
}

const loadBlogs = function() {
    // 确保文件有内容, 这里就不用处理文件不存在或者内容错误的情况了
    // 注意, 一般都是这样不处理的
    var content = fs.readFileSync(blogFilePath, 'utf8')
    var blogs = JSON.parse(content)
    return blogs
}

/*
b 这个对象是我们要导出给别的代码用的对象
它有一个 data 属性用来存储所有的 blogs 对象
它有 all 方法返回一个包含所有 blog 的数组
它有 new 方法来在数据中插入一个新的 blog 并且返回
他有 save 方法来保存更改到文件中
*/
var b = {
    data: loadBlogs()
}

//获取id对应的blog的所有comment后作为comments成员添加进此blog对象，返回此blog对象
b.get = function(id) {
    const comment = require('./comment')
    var comments = comment.all()
    //
    var blogs = this.data
    for(var i = 0; i < blogs.length; i++){
        var blog = blogs[i]
        if(blog.id == id) {
            var cs = []
            for (var j = 0; j < comments.length; j++) {
                var c = comments[j]
                if (blog.id == c.blog_id) {
                    cs.push(c)
                }
            }
            blog.comments = cs
            return blog
        }
    }
    // 循环结束都没有找到, 说明出错了, 那就返回一个空对象好了
    return {}
}

//遍历 blog，插入 comments，返回所有blogs对象数组
b.all = function() {
    var blogs = this.data
    // 遍历 blog，插入 comments
    const comment = require('./comment')
    var comments = comment.all()
    for (var i = 0; i < blogs.length; i++) {
        var blog = blogs[i]
        var cs = []
        for (var j = 0; j < comments.length; j++) {
            var c = comments[j]
            if (blog.id == c.blog_id) {
                cs.push(c)
            }
        }
        blog.comments = cs
    }
    return blogs
}

//新建一个blog实例，定义id
b.new = function(form) {
    var m = new ModelBlog(form)
    // console.log('new blog', form, m)
    // 设置新数据的 id
    var d = this.data[this.data.length-1]
    if (d == undefined) {
        m.id = 1
    } else {
        m.id = d.id + 1
    }
    //处理path
    var s = 'static/images/blog_cover/'
    m.path = s + m.id + '.' + m.temp_path.split('.')[1]
    //rename封面图片,完成后临时文件消失
    fs.renameSync(m.temp_path, m.path)
    // 把 数据 加入 this.data 数组
    this.data.push(m)
    // 把 最新数据 保存到文件中
    this.save()
    // 返回新建的数据
    return m
}

b.commentsById = function(id) {
    const comment = require('./comment')
    var comments = comment.all()
    var cs = []
    for (var j = 0; j < comments.length; j++) {
        var c = comments[j]
        if (id == c.blog_id) {
            cs.push(c)
        }
    }
    return cs
}

b.edit = function(form) {
    var m = new ModelBlog(form)
    var index = -1
    var blogs = this.data
    for (var i = 0; i < blogs.length; i++) {
        var blog = blogs[i]
        if (blog.id == m.id) {
            index = i
            break
        }
    }
    if (index != -1) {
        var d = blogs[index]
        // console.log('old data', d)
        var comments = this.commentsById(m.id)
        m.comments = comments
        m.created_time = d.created_time
        m.edit_time = Math.floor(new Date() / 1000)
        if (m.temp_path == '') {
            //没有上传图片，则直接赋值path
            m.path = d.path
        }
        else{
            var s = 'static/images/blog_cover/'
            //将编辑的unix时间放在path中，防止path不变的情况下浏览器不会加载新的图片
            m.path = s + String(m.edit_time) + '_' + m.id + '.' + m.temp_path.split('.')[1]
            //图片改名并移动
            fs.renameSync(m.temp_path, m.path)
            //删除原图片
            fs.unlinkSync(d.path)
        }
        //删除并替代
        blogs.splice(index, 1, m)
        // 把 最新数据 保存到文件中
        this.save()
    }
    // 返回新建的数据
    return m
}


/*
它能够删除指定 id 的数据
删除后保存修改到文件中
*/
b.delete = function(id) {
    const comment = require('./comment')
    var blogs = this.data
    var path
    var found = false
    for (var i = 0; i < blogs.length; i++) {
        var blog = blogs[i]
        if (blog.id == id) {
            found = true
            path = blog.path
            break
        }
    }
    // 用 splice 函数删除数组中的一个元素
    // 如果没找到, i 的值就是无用值, 删除也不会报错
    // 所以不用判断也可以
    blogs.splice(i, 1)
    //删除封面img文件
    fs.unlinkSync(path)
    this.save()
    //删除相关评论返回bool值
    var deleteComments = comment.deleteByBlogid(id)
    // 不返回数据也行, 但是还是返回一下好了
    var result = found && deleteComments
    return result
}
//异步
// b.save = function() {
//     var s = JSON.stringify(this.data, null, 2)
//     fs.writeFile(blogFilePath, s, (err) => {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log('保存成功')
//         }
//     })
// }

//同步
b.save = function() {
    var s = JSON.stringify(this.data, null, 2)
    fs.writeFileSync(blogFilePath, s)
    console.log('保存成功')
}

// 导出一个对象的时候用 module.exports = 对象 的方式
// 这样引用的时候就可以直接把模块当这个对象来用了(具体看使用方法)
module.exports = b
