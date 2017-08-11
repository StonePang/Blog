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

//返回单个blog数据组成的HTML块的模板字符串
var blogTemplate = function(blog) {
    var id = blog.id
    var title = blog.title
    var author = blog.author
    var at = new Time(blog.created_time)
    var time = at.anyTime()
    var content = blog.content
    let path = blog.path.slice(6)
    var t = `
    <div class="gua-blog-cell">
        <a class="blog-head" href='/blog/${id}' >
        <img class='blog-cover' src='${path}'>
        </a>
        <a class="blog-title" href="/blog/${id}" data-id="${id}">
            ${title}
        </a>
        <div class="blog-a-t">
            <span>${author}</span> @ <time>${time}</time>
        </div>
    </div>
    `
    return t
}

const stringInHTML = function(str) {
    //使用markdown
    let md = new Remarkable()
    let text = md.render(str)
    return text
}
//插入一条blog
callBack.blogAdd = blog => {
    let html = blogTemplate(blog)
    let div = $('.gua-blogs')
    div.append(html)
    $('#id-blog-add-area').remove()
}

//加载所有blog数组，替换'.gua-blogs'中的HTML
callBack.blogAll = function(blogs) {
    var html = ''
    for (var i = 0; i < blogs.length; i++) {
        var b = blogs[i]
        var t = blogTemplate(b)
        html += t
    }
    // 把数据写入 .gua-blogs 中, 直接用覆盖式写入
    var div = document.querySelector('.gua-blogs')
    div.innerHTML = html
    log('HTML加载完成')
}

//关闭输入框，并清空内部的html代码
callBack.close = function() {
    sweetalert.close(function() {
        $('#id-blog-add-area').remove()
    })
}

//触发新建事件后先上传图片，返回临时地址，然后将临时地址和数据内容一同打包传给后端
//进行数据数组的添加，添加过程中完成临时图片文件的rename
const addNewBlog = function() {
    uploadImg(function(r) {
        var path = r
        var title = $('#id-blog-title').val()
        var content = $('#id-blog-content').val()
        if (title != '' && content != '') {
            var form = {
                title: title,
                content: content,
                temp_path: path
            }
            let swalAddBlog = {
                title: "确定添加博客?",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            }
            swal(swalAddBlog, function() {
                api.blogAdd(form, function(response) {
                    swal('成功添加博客')
                    callBack.blogAdd(response)
                })
            })

        } else if(title == ''){
            $('#id-blog-title').attr('placeholder','输入不能为空')
        } else {
            $('#id-blog-content').attr('placeholder','输入不能为空')
        }
    })
}

const inputTitle = function(event) {
    var s = event.target.value
    $('.pre-blog-title').text(s)
}

//实时以markdown方式预览输入的content
const inputContent = function(event) {
    var s = event.target.value
    var ss = stringInHTML(s)
    $('.pre-blog-content').html(ss)
}

//预览图片，没有图片上传过程
const previewImg = function(event) {
    if (typeof FileReader == undefined) {
        return
    }
    var file = event.target.files[0]
    //可执行的格式
    var acceptedTypes = {
        'image/png': true,
        'image/jpeg': true,
        'image/gif': true,
    }
    //格式正确时
    if (acceptedTypes[file.type] == true) {
        //用FileReader实现预览
        var reader = new FileReader()
        //当文件加载完成后的函数
        reader.onload = function(event) {
            var img = new Image()
            //取得路径的套路
            img.src = event.target.result
            $('#id-cover-pre').attr('src', img.src)
            $('#id-cover-pre').removeClass('none')
        }
        reader.readAsDataURL(file)
    }
}

//上传图片，回调参数是临时图片文件的path
const uploadImg = function(callback) {
    //获得input文件的套路
    var img = $('#id-img-add-button')[0].files[0]
    if (img == undefined) {
        swal('请选择封面图片')
    }else {
        var fd = new FormData()
        fd.append('blogCover', img)
        api.blogCoverUpload(fd, function(r) {
            //后端返回临时文件地址
            // var p = r.slice(7)
            callback(r)
        })
    }
}

const pathArr = function(arr) {
    var srcs = []
    for (var i = 0; i < arr.length; i++) {
        var o = {}
        var s = arr[i].path
        var src = s.slice(6)
        o.path = src
        o.title = arr[i].title
        o.content = arr[i].content
        o.id = arr[i].id
        srcs.push(o)
    }
    var total = $('.gua-slide').data('imgs')
    var res = srcs.slice(0, total)
    return res
}

callBack.lbt = function(r) {
    var l = pathArr(r)
    for (var j = 0; j < l.length; j++) {
        var ele = l[j]
        var name = '#id-guaimage-' + String(j)
        $(name).attr('src', ele.path)
        var domTitle = $('.blog-text-title')[j]
        var domContent = $('.blog-text-content')[j]
        var domText = $('.blog-text')[j]
        domTitle.innerText = ele.title
        domContent.innerText = ele.content
        domText.dataset.blogId = ele.id
    }
}

loadPage.blogAll = function() {
    api.blogAll(function(response) {
        callBack.blogAll(response)
        callBack.lbt(response)
    })
}

var events = {
    close: callBack.close,
    confirm: addNewBlog,
    inputTitle: inputTitle,
    inputContent: inputContent,
    input_previewImg: previewImg,
}

bindEvents.newBlogBlock = function() {
    //点击发布的触发事件
    $('body').click(function(event) {
        var self = event.target
        var action = event.target.dataset.action
        if (events[action] != undefined) {
            events[action](event)
        }
    })

    //输入title和content触发事件
    $('body').bind('input', function(event) {
        var action = event.target.dataset.action
        if (events[action] != undefined) {
            events[action](event)
        }
    })

    //选择完成封面图片后的触发事件
    $('body').bind('change', function(event) {
        var action = event.target.dataset.action
        var ac = 'input_' + action
        if (events[ac] != undefined) {
            events[ac](event)
        }
    })
}

const insertBlogAdd = function() {
    let t = `
        <div id='id-blog-add-area'>
            <div id='id-close-add' data-action='close'>×</div>
            <div id='id-blog-add'>
                <div id="id-blog-add-left">
                    <input id="id-blog-title" class='blog-add' placeholder='请输入博客标题' data-action='inputTitle'>
                    <textarea id="id-blog-content" placeholder='请输入博客内容' data-action='inputContent'></textarea>
                    <div id='left-foot'>
                        <input type='file' accept="image/*" id='id-img-add-button' class='hov' data-action='previewImg'>
                        <div id='id-blog-add-button' class='hov' data-action='confirm'>提交</div>
                    </div>
                </div>
                <div id="id-blog-add-right">
                    <div id='id-rt'>Markdown预览</div>
                    <div id='id-preview'>
                        <h1 class='pre-blog-title'></h1>
                        <img id='id-cover-pre' class='none' data-path='' src=''></img>
                        <div class='pre-blog-content'></div>
                    </div>
                </div>
            </div>
        </div>
    `
    //afterstart插入内容
    $('body').prepend(t)
}

bindEvents.addBlog = function() {
    $('#id-add-icon').on('click', function() {
        sweetalert.input(function(inputValue) {
            let data = {
                input: inputValue
            }
            api.usercodeEnsure(data, function(response) {
                let r = response.result
                if (r) {
                    swal.close()
                    insertBlogAdd()
                }else {
                    swal('密码输入错误')
                }
            })
        })
    })
}
