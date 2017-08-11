//点击添加评论按钮后的AJAX回调函数，将返回的评论对象添加到对应的div插入html
callBack.commentAdd = function(obj) {
    let replyCommentId = obj.replyCommentId
    let t = commentTemplate(obj)
    //当该评论不是对评论的回复时
    if(replyCommentId == -1) {
        let comments = document.querySelector('.comments')
        comments.innerHTML += t
        let inputBox = e('.blog-comments')
        inputBox.classList.add('none')
    }else {
        //当评论是对其他评论的回复时
        let re = es('.comment')
        for (var i = 0; i < re.length; i++) {
            if (re[i].dataset.id == replyCommentId) {
                re[i].insertAdjacentHTML('afterend',t)
                break
            }
        }
        hideInputBox(replyCommentId)
    }
    document.querySelector('.comment-author').value = ''
    document.querySelector('.comment-content').value = ''
    swal('评论成功', '你添加了一条评论', 'success')
}

var getComments = function(data) {
    var a1 = []
    var a2 = []
    for (var i = 0; i < data.length; i++) {
        var d = data[i]
        if (d.replyFatherExist) {
            //缩进的
            a1.push(d)
        }else {
            //顶格的
            a2.push(d)
        }
    }
    var obj = {
        gua1: a1,
        gua2:a2,
    }
    return obj
}

var commentsDg = function(data) {
    let comments = document.querySelector('.comments')
    for (var i = 0; i < data.length; i++) {
        let replyCommentId = data[i].replyCommentId
        let t = commentTemplate(data[i])
        comments.innerHTML += t
    }
}

var commentsSj = function(data) {
    let comments = e('.comments')
    for (var i = 0; i < data.length; i++) {
        var replyCommentId = data[i].replyCommentId
        var comment = es('.comment')
        for (var j = 0; j < comment.length; j++) {
            var c = comment[j]
            if (c.dataset.id == replyCommentId) {
                // let t = commentReplyTemplate(data[i])
                let t = commentTemplate(data[i])
                c.insertAdjacentHTML('afterend', t)
                break
            }
        }
    }
}

callBack.commentRefreshAll = function(data) {
    var d = getComments(data)
    var dg = d.gua2
    var sj = d.gua1
    e('.comments').innerHTML = ''
    commentsDg(dg)
    commentsSj(sj)
}

//点击添加评论按钮后的事件
bindEvents.commentAdd = function() {
    document.body.addEventListener('click', function (event) {
        var self = event.target
        if(self.classList.contains('comment-add')){
            var form = self.closest('.new-comment')
            var blogId = document.querySelector('body').dataset.id
            var author = form.querySelector('.comment-author').value
            var content = form.querySelector('.comment-content').value
            var replyCommentId = form.dataset.reply_comment_id
            var form = {
                blog_id: blogId,
                author: author,
                replyCommentId: replyCommentId,
                content: content,
            }
            if (form.content == '') {
                log('输入为空，请重新输入')
            } else {
                api.commentAdd(form, function(response) {
                    callBack.commentAdd(response)
                })
            }
        }
    })
}

//删除评论的事件
bindEvents.commentDelete = function() {
    var blog = document.querySelector('#id-blog')
    blog.addEventListener('click', function(event) {
        let self = event.target
        if (self.classList.contains('delete-comment')) {
            sweetalert.delete(function() {
                let comment = self.closest('.comment')
                let id = Number(comment.dataset.id)
                let form = {
                    id : id
                }
                api.commentDelete(form, function(response) {
                    swal("删除！", "数据删除成功", "success")
                    callBack.commentRefreshAll(response)
                })
            })
        }
    })
}

//开关回复评论框功能
const toggleInputBox = function(parent) {
    var replyCommentId = parent.dataset.id
    var t =
        `
        <div class='new-comment reply' data-reply_comment_id='${replyCommentId}'>
            <input class='comment-author' placeholder='请输入用户名'>
            <textarea class='comment-content' placeholder='请输入评论'></textarea>
            <img class='comment-add icon' src="/images/回复.png" alt="">
        </div>
        `
    var r = e('.reply')
    if (r == undefined) {
        parent.insertAdjacentHTML('afterend', t)
    }
    else {
        var rcid = r.dataset.reply_comment_id
        r.remove()
        if (rcid != replyCommentId) {
            parent.insertAdjacentHTML('afterend', t)
        }
    }
}

//恢复评论后关闭回复输入框
const hideInputBox = function(replyCommentId) {
    let p = document.querySelectorAll('.comment')
    for (var i = 0; i < p.length; i++) {
        let pp = p[i]
        if (pp.dataset.id == replyCommentId) {
            toggleInputBox(pp)
            break
        }
    }
}

callBack.commentReply = function(event) {
    var self = event.target
    if(self.classList.contains('reply-comment')){
        var parent = self.closest('.comment')
        toggleInputBox(parent)
    }else if (self.id == 'id-a') {
        var inputBox = e('.blog-comments')
        inputBox.classList.toggle('none')
    }
}

//点击回复评论后的事件
bindEvents.commentReply = function() {
    document.body.addEventListener('click', function (event) {
        callBack.commentReply(event)
    })
}

//评论的div处理函数
const commentTemplate = obj => {
    let author = obj.author
    let content = obj.content
    let id = obj.id
    let blog_id = obj.blog_id
    let replyCommentId = obj.replyCommentId
    let huifu = replyCommentId == -1 ? 'none' : 'huifu'
    let replyCommentAuthor = obj.replyCommentAuthor
    let ti = new Time(obj.created_time)
    let time = ti.anyTime()
    let exist = {
        true:'ex',
        false:'',
    }
    let exi = exist[obj.replyFatherExist]
    let t = `
            <li class='comment ${exi}' data-id='${id}' data-blog-id='${blog_id}' data-reply_comment_id='${replyCommentId}'>
                <div class="comment-content">
                <span class='c-author'>${author}</span><span class='${huifu}'> 回复 </span><span class='rca'>${replyCommentAuthor}</span> ：<span class='c-content'>${content}</span>
                </div>
                <time>${time}</time>
                <span class='delete-comment hov'>×</span>
                <span class='reply-comment hov'>回复</span>
            </li>
    `
    return t
}
