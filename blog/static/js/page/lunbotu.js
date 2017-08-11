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

// class Index {
//     constructor(total, offset) {
//         this.total = total
//         this.offset = offset || 1
//     }
//     //直接跳转到对应的index
//     toindex(num) {
//         var n = num % this.total
//         return n
//     }
//     //自动跳转到下一个，正负循环
//     next(now) {
//         var n = (now + this.total + this.offset) % this.total
//         return n
//     }
//
// }
//
// class Lbt {
//     constructor(n, interval) {
//         this.total = n
//         this.interval = interval
//         this.timer = undefined
//     }
//
//     loadImg(selector, srcs) {
//         var n = this.total
//         if (srcs.length == this.total) {
//             for (var i = 0; i < n.length; i++) {
//                 $(selector)[i].attr('src', srcs[i])
//             }
//         }
//     }
//     //当data-index的值是index时就显示，其余的selector全部hide
//     showAtIndex(selecter, index) {
//         $(selecter).hide()
//         for (var i = 0; i < $(selector).length; i++) {
//             if($(selector)[i].dataset('index') == index) {
//                 $(selecter).show()
//                 break
//             }
//         }
//     }
//     //所有图片的seletor,目前的index
//     next(selector, now) {
//         var n = this.total
//         var i = new Index(n, 1)
//         var nextIndex = i.next(now)
//         this.showAtIndex(selecter, nextIndex)
//     }
//     //一个图片
//     last(selector, now) {
//         var n = this.total
//         var i = new Index(n, -1)
//         var nextIndex = i.next(now)
//         this.showAtIndex(selecte, nextIndex)
//     }
//
//     toIndex(selector, new) {
//         var n = this.total
//         var i = new Index(n)
//         var nextIndex = i.toIndex(new)
//         showAtIndex(selecte, nextIndex)    }
//
//     autoPlay(selector, n, this.interval) {
//         return setInterval(function(){
//             // 每 2s 都会调用这个函数
//             next(selector, n)
//         }, this.interval)
//     }
//
//     play() {
//         autoPlay(selector, n)
//     }
//     pause() {
//         clearInterval(this.interval)
//     }
// }

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

// var actionMousrOver = function(timer) {
//     var gua = document.querySelector('.gua-slide')
//     var gua3 = document.querySelector('.gua-3')
//     var slideButton = document.querySelectorAll('.gua-slide-button')
//     gua.addEventListener('mouseover', function(event) {
//         clearInterval(timer.t)
//         for (var i = 0; i < slideButton.length; i++) {
//             var sb = slideButton[i]
//             sb.style.opacity = 0.3
//         }
//         var self = event.target
//         if (self.classList.contains('gua-slide-indi')) {
//             log('over indi')
//             var index = parseInt(self.dataset.index)
//             var slide = self.closest('.gua-slide')
//             addClass2to1All('gua-slide-indi', 'gua-pointer')
//             showImageAtIndex(slide, index)
//         }
//     })
// }
//
// var actionMouseOut = function(timer) {
//     var gua = document.querySelector('.gua-slide')
//     var gua3 = document.querySelector('.gua-3')
//     var slideButton = document.querySelectorAll('.gua-slide-button')
//     gua.addEventListener('mouseout', function(event) {
//         var relatedTarget = event.relatedTarget
//         var self = event.target
//         if (relatedTarget == gua3) {
//             timer.t = autoPlay(2000)
//             for (var i = 0; i < slideButton.length; i++) {
//                 var sb = slideButton[i]
//                 sb.style.opacity = 0
//             }
//             log('timer set', timer, relatedTarget)
//         }
//     })
// }


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
