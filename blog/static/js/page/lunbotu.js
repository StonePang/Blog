var nextIndex = function(slide, offset) {
    var activeIndex = parseInt(slide.dataset.active)
    var numberOfImgs = parseInt(slide.dataset.imgs)
    var index_new = (numberOfImgs + activeIndex + offset) % numberOfImgs
    return index_new
}


var showImageAtIndex = function(slide, index) {
    var new_img_id = '#id-guaimage-' + String(index)
    var new_indi_id = '#id-indi-' + String(index)
    removeClassAll('gua-active')
    e(new_img_id).classList.add('gua-active')
    removeClassAll('gua-white')
    e(new_indi_id).classList.add('gua-white')
    slide.dataset.active = String(index)
    showTextAtIndex(index)
}

var showTextAtIndex = function(index) {
    noneAll('.blog-text')
    var a
    var blogId
    var d = $('.blog-text')
    for (var i = 0; i < d.length; i++) {
        var ele = d[i]
        if (ele.dataset.index == index) {
            a = ele
            blogId = ele.dataset.blogId
            break
        }
    }
    e('.gua-3').dataset.blogId = blogId
    e('.enter-button').href = '/blog/' + blogId
    a.classList.remove('none')
}
var moveCurrentImg = function(slide, index) {
    var current_img_id = '#id-guaimage-' + String(index)
    removeClassAll('gua-old')
    e(current_img_id).classList.add('gua-old')
}

var playNextImage = function() {
    var slide = e('.gua-slide')
    var next_index = nextIndex(slide, 1)
    showImageAtIndex(slide, next_index)
}

var autoPlay = function(time) {
    return setInterval(function(){
        // 每 2s 都会调用这个函数
        playNextImage()
    }, time)
}

bindEvents.LbtClick = function() {
    var gua = document.querySelector('.gua-3')
    gua.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('gua-slide-button')) {
            var slide = e('.gua-slide')
            log(slide)
            var offset = parseInt(self.dataset.offset)
            var index_new = nextIndex(slide, offset)
            showImageAtIndex(slide, index_new)
        }else if (self.classList.contains('gua-slide-indi')) {
            log('click indi')
            var index = parseInt(self.dataset.index)
            var slide = self.closest('.gua-slide')
            addClass2to1All('gua-slide-indi', 'gua-pointer')
            showImageAtIndex(slide, index)
        }
    })
}

var actionMouseOver = function(timer) {
    $('.gua-3').mouseenter(function(event) {
        $('.gua-slide-button').css('opacity', '0.3')
        clearInterval(timer.t)
        log('timer clear', timer)
    })
}

var actionMouseOut = function(timer) {
    $('.gua-3').mouseleave(function(event) {
        $('.gua-slide-button').css('opacity', '0')
        timer.t = autoPlay(3000)
        log('timer set', timer)
    })
}


bindEvents.LbtMouse = function() {
    var timer = {}
    timer.t = autoPlay(3000)
    actionMouseOver(timer)
    actionMouseOut(timer)
}
