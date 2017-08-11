//blog详情页面的执行函数，包括载入页面后的加载函数和事件绑定
//页面路径为/blog/:id
class Time {
    constructor(t) {
        this.time = t
        this.currentTime = this.current()
    }
    add0(num) {
        var str = String(num)
        while(str.length < 2) {
            str = '0' + str
        }
        return str
    }

    format(d) {
        var year = d.getFullYear()
        var month = this.add0(d.getMonth() + 1)
        var day = this.add0(d.getDate())
        var hour = this.add0(d.getHours())
        var min = this.add0(d.getMinutes())
        return `${year}/${month}/${day} ${hour}:${min}`
    }

    //返回当前时间
    current(){
        var d = new Date()
        return this.format(d)
    }
    //处理传入的unix时间
    anyTime() {
        var d = new Date(this.time * 1000)
        return this.format(d)
    }

}


//以markdown的方式处理博客的content
const stringInHTML = function(str) {
    // //将原文本中的所有回车'\n'替换成'<br>'，在HTML中能显示换行
    // let html = str.replace(/\n/g, '<br>')
    //使用markdown
    let md = new Remarkable()
    let text = md.render(str)
    return text
}

//博客的html
const blogDetailTemplate = obj => {
    let author = obj.author
    let title = obj.title
    let contentOrigin = obj.content
    //处理content，可以通过调用markdown库使用其语法改造字符串，也可以手动把'\n'换为'<br>'实现换行
    let content = stringInHTML(contentOrigin)
    let id = obj.id
    let ti = new Time(obj.created_time)
    let time = ti.anyTime()
    //去掉开头的static
    let path = obj.path.slice(6)
    let t = `
    <div class="blog-detail" data-id="${id}">
        <h1 class="blog-title">
            ${title}
        </h1>
        <div class="a-t">
            <span class='author'>作者：${author}</span>  <time>发布时间：${time}</time>
        </div>
        <img id='id-blog-cover' src='${path}'>
        <div class="blog-content">
            ${content}
        </div>
        <div class="blog-foot">
            <img id='id-a' class='icon' src="/images/评论.png" alt="">
            <img id='id-e' class='icon' data-action='edit' src="/images/编辑.png" alt="">
            <img id='id-delete-blog' class='icon' src="/images/删除.png" alt="">
        </div>
    </div>
    <div class='blog-comments none'>
        <div class='pinglun'>评论</div>

        <div class='new-comment' data-reply_comment_id='-1'>
            <input class='comment-author' placeholder='请输入用户名'>
            <textarea class='comment-content' placeholder='请输入评论'></textarea>
            <img class='comment-add icon' src="/images/回复.png" alt="">

        </div>
    </div>
    <ul class='comments'>
    </ul>
    `
    return t
}

//显示博客详情的AJAX回调函数
callBack.blogDetail = blog => {
    var blogDetailHTML = blogDetailTemplate(blog)
    var blogDom = document.querySelector('#id-blog')
    blogDom.innerHTML = blogDetailHTML
    var comments = blog.comments
    callBack.commentRefreshAll(comments)
    log('HTML加载完成')
}

//通过id作为动态id拿到对应的博客数据
loadPage.blogDetail = function() {
    var id = Number(document.body.dataset.id)
    api.blogDetail(id, function(response) {
        callBack.blogDetail(response)
    })
}

//删除博客事件的AJAX回调函数
callBack.blogDelete = function(response) {
    log(response)
    if(response.success) {
        //弹窗显示成功并跳回主页
        //跳转回某页面
        window.location.href='/'
    }
    else {
        log('删除失败')
    }
}

//点击删除博客后的事件
bindEvents.deleteBlog = function() {
    var blog = document.querySelector('#id-blog')
    blog.addEventListener('click', function(event) {
        let self = event.target
        if (self.id == 'id-delete-blog') {
            sweetalert.delete(function() {
                let id = Number(document.body.dataset.id)
                let form = {
                    id : id
                }
                api.blogDelete(form, function(response) {
                    swal("删除！", "数据删除成功", "success")
                    callBack.blogDelete(response)
                })
            })
        }
    })
}
