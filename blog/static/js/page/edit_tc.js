const insertBlogEdit = function(obj) {
    //非markdown字符串放在左边
    var title = obj.title
    var content = obj.content
    var imgPath = $('#id-blog-cover').attr('src')
    //markdown字符串从页面获取。放在右边。
    var titlePre = $('.blog-title').html()
    var contentPre = $('.blog-content').html()
    let t = `
        <div id='id-blog-add-area'>
            <div id='id-close-add' data-action='close'>×</div>
            <div id='id-blog-add'>
                <div id="id-blog-add-left">
                    <input id="id-blog-title" class='blog-add' placeholder='请输入博客标题' data-action='inputTitle' value='${title}'>
                    <textarea id="id-blog-content" placeholder='请输入博客内容' data-action='inputContent' ></textarea>
                    <div id='left-foot'>
                        <input type='file' accept="image/*" id='id-img-add-button' class='hov' data-action='previewImg'>
                        <div id='id-blog-add-button' class='hov' data-action='confirm'>提交</div>
                    </div>
                </div>
                <div id="id-blog-add-right">
                    <div id='id-rt'>Markdown预览</div>
                    <div id='id-preview'>
                        <h1 class='pre-blog-title'>${titlePre}</h1>
                        <img id='id-cover-pre' class='' data-path='' src='${imgPath}'></img>
                        <div class='pre-blog-content'>${contentPre}</div>
                    </div>
                </div>
            </div>
        </div>
    `
    //afterstart插入内容
    $('body').prepend(t)
    //textarea没有value属性
    $('#id-blog-content').text(content)
}

var showtc = function() {
    sweetalert.input(function(inputValue) {
        let data = {
            input: inputValue
        }
        api.usercodeEnsure(data, function(response) {
            let r = response.result
            if (r) {
                swal.close()
                var id = Number(document.body.dataset.id)
                api.blogDetail(id, function(response) {
                    insertBlogEdit(response)
                })
            }else {
                swal('密码输入错误')
            }
        })
    })
}
//关闭输入框，并清空内部的html代码
callBack.close = function() {
    sweetalert.close(function() {
        $('#id-blog-add-area').remove()
    })
}

//触发新建事件后先上传图片，返回临时地址，然后将临时地址和数据内容一同打包传给后端
//进行数据数组的添加，添加过程中完成临时图片文件的rename
const editBlog = function() {
    uploadImg(function(r) {
        var path = r
        var title = $('#id-blog-title').val()
        var content = $('#id-blog-content').val()
        var id = $('.blog-detail').data('id')
        if (title != '' && content != '') {
            var form = {
                id: id,
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
            log('ajax form ', form)
            swal(swalAddBlog, function() {
                api.blogEdit(form, function(response) {
                    swal('成功编辑博客')
                    log('ajax response', response)
                    callBack.blogDetail(response)
                    $('#id-blog-add-area').remove()
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
        // swal('请选择封面图片')
        // var path = $('#id-blog-cover').attr('src')
        var path = ''
        callback(path)
    }else {
        var fd = new FormData()
        fd.append('blogCover', img)
        api.blogCoverUpload(fd, function(r) {
            //后端返回临时文件地址
            callback(r)
        })
    }
}


var events = {
    close: callBack.close,
    edit: showtc,
    confirm: editBlog,
    inputTitle: inputTitle,
    inputContent: inputContent,
    input_previewImg: previewImg,
}

bindEvents.editBlogBlock = function() {
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
