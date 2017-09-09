class NewIndex {
    //声明类的属性
    constructor(index, total, key) {
        this.index = index
        this.total = total
        this.key = key || 'next'
    }
    //公用的类方法，
    indexAtOffset() {
        var newIndex = (this.total + this.index + this.offset) % this.total
        return newIndex
    }

    //不同的method作为不同的方法函数名
    next() {
        log('next')
        this.offset = 1
        var newIndex = (this.total + this.index + this.offset) % this.total
        return newIndex
    }

    last() {
        log('last')
        this.offset = -1
        var newIndex = (this.total + this.index + this.offset) % this.total
        return newIndex
    }

    cycle() {
        log('cycle')
        return this[this.key]()
    }

    single() {
        return this.index
    }

    shuffle() {
        do {
            this.offset = Math.floor(Math.random() * this.total)
            var newIndex = this.indexAtOffset()
        } while (newIndex == this.index);
        return newIndex
    }
}

class Time {
    constructor(t) {
        this.time = t
    }

    timeAdd0(n) {
        var s = ''
        if (n < 10) {
            s = '0' + String(n)
        }
        else {
            s = n
        }
        return s
    }

    timeString() {
        var timeInt = Math.floor(this.time)
        var m = Math.floor(this.time / 60)
        var min = this.timeAdd0(m)
        var second = this.timeAdd0(timeInt % 60)
        var ts = min+ ':' + second
        return ts
    }

    putTime(selector) {
        var sel = document.querySelector(selector)
        sel.innerText = this.timeString()
    }
}

class Progress {
    constructor(totalWidth, totalValue) {
        this.tw = totalWidth
        this.tv = totalValue
    }
    getValue(offsetWidth, selector) {
        e(selector).style.width = String(offsetWidth) + 'px'
        this.nw = offsetWidth
        var newValue = Math.floor(offsetWidth / this.tw * this.tv)
        this.nv = newValue
        return newValue
    }
    setWidth(offsetValue, selector) {
        this.nv = offsetValue
        var newWidth = Math.floor(offsetValue / this.tv * this.tw)
        this.nw = newWidth
        var wid = String(newWidth) + 'px'
        e(selector).style.width = wid
    }
}

var currentTimer = {}

//带入method参数，不同的method调用不同的类方法，得到返回值
var getNewIndex = function(index, total, method, key) {
    var newIndex = new NewIndex(index, total, key)
    var ni = newIndex[method]()
    return ni
}

loadPage.volumeBar = function() {
    var value = e('audio').volume
    var obj = {
        className: 'pro-1',
        width: '100px',
        height: '5px',
        d: '10px',
        bgcolor: 'white',
        cyclecolor: 'grey',
        selector: '.volume-block',
        continue: true,
        startPercentage: 0.2,
        totalValue: value,
        callback: function(n) {
            var music = e('audio')
            music.volume = n
            if (music.volume == 0) {
                noneAll('.img-volume')
                displayAll('.img-mute')
            }
            else {
                noneAll('.img-mute')
                displayAll('.img-volume')
            }
        }
    }
    progressBar(obj)
    var h = document.documentElement.clientHeight
    e('body').style.height = h + 'px'
}


const changeMusicSrc = function(key) {
    coverPause()
    var music = e('audio')
    var index = Number(e('.playlist').dataset.active)
    var total = Number(e('#id-body').dataset.number)
    var method = e('.loop').dataset.mode
    var newIndex = getNewIndex(index, total, method, key)
    e('.playlist').dataset.active = String(newIndex)
    music.src = path(newIndex)
    clearTimer()
    e('.progress-bar-now').style.width = 0
    e('.current-time').innerText = '00:00'
}

bindEvents.ended = function() {
    var music = e('audio')
    music.addEventListener('ended', function() {
        changeMusicSrc()
    })
}

bindEvents.clickEvents = function() {
    var music = e('audio')
    var control = e('#id-body')
    control.addEventListener('click', function(event) {
        var action = event.target.dataset.action
        //绑定点击外窗取消音量窗口的事件
        // if (action != 'volume_none' && action != 'toggle_volume') {
        //     volumeNone()
        // }
        //其他点击事件
        if (action != 'volume_none' && clickActions[action] != undefined) {
            clickActions[action](event)
        }
    })
}

bindEvents.canplay = function() {
    var music = e('audio')
    music.addEventListener('canplay', function() {
        var t = showCurrentTime()
        currentTimer.timer = t
        var playList = e('.playlist')
        var index = playList.dataset.active
        showInfo(index)
        var totalTime = music.duration
        var time = new Time(totalTime)
        time.putTime('.total-time')
        music.volume = 0.2
        var l = es('.each-music')
        for (var i = 0; i < l.length; i++) {
            if(l[i].dataset.index == index) {
                removeClassInSelAll('.each-music', 'play-background')
                l[i].classList.add('play-background')
            }
        }
        playMusic()
    })
}

bindEvents.seeked = function() {
    var music = e('audio')
    music.addEventListener('seeked', function() {
        clearTimer()
    })
}

bindEvents.inputchange = function() {
    var volumeBar = e('.volume-bar')
    var music = e('audio')
    volumeBar.addEventListener('input', function(event) {
        music.volume = event.target.value / 100
        if (music.volume == 0) {
            noneAll('.img-volume')
            displayAll('.img-mute')
        }
        else {
            noneAll('.img-mute')
            displayAll('.img-volume')
        }
    })
}

const likeToogle = function(event) {
    var self = event.target
    var likeBlock = self.closest('.icon-like')
    var ele = findAll(likeBlock, 'img')
    for (var i = 0; i < ele.length; i++) {
        ele[i].classList.toggle('none')
    }
    likeBlock.dataset.value = self.dataset.action
}

const chooseMusic = function(event) {
    var music = e('audio')
    var self = event.target
    var each = self.closest('.each-music')
    var playList = each.closest('.playlist')
    var index = each.dataset.index
    music.src = path(index)
    e('.playlist').dataset.active = String(index)
    clearTimer()
    e('.progress-bar-now').style.width = 0
    e('.current-time').innerText = '00:00'
}

const changeMusic = function(event) {
    var self = event.target
    var key = self.dataset.action
    changeMusicSrc(key)
}

const pauseMusic = function(event) {
    var music = e('audio')
    noneAll('.img-pause')
    displayAll('.img-play')
    coverPause()
    music.pause()
}

const playMusic = function(event) {
    var music = e('audio')
    noneAll('.img-play')
    displayAll('.img-pause')
    coverRotete()
    music.play()
}

const changLoop = function(event) {
    var self = event.target
    var loop = self.closest('.loop')
    var index = Number(self.dataset.index)
    var total = Number(loop.dataset.num)
    var next = getNewIndex(index, total, 'cycle')
    var nextLc = DOMatIndex('.lc', next)
    if (nextLc != null) {
        noneAll('.lc')
        nextLc.classList.remove('none')
        loop.dataset.mode = nextLc.dataset.mode
        loop.dataset.active = nextLc.dataset.index
    }
}

const progressClick = function(event) {
    var music = e('audio')
    var bar = e('.progress-bar-total')
    var totalTime = e('audio').duration
    var offset = event.offsetX
    var totalWidth = bar.offsetWidth
    var p = new Progress(totalWidth, totalTime)
    var newTime = p.getValue(offset, '.progress-bar-now')
    var ctime = new Time(newTime)
    ctime.putTime('.current-time')
    music.currentTime = String(newTime)
}

const toggleVolume = function(event) {
    var music = e('audio')
    var volumeBar = e('.volume-bar')
    var self = event.target
    var volume = e('.volume-block')
    volume.classList.toggle('none')
    var musicVolume = music.volume
    volumeBar.value = musicVolume * 100
}

const volumeNone = function() {
    noneAll('.volume-block')
}

const clickActions = {
    like: likeToogle,
    unlike: likeToogle,
    choose: chooseMusic,
    last: changeMusic,
    next: changeMusic,
    pause: pauseMusic,
    play: playMusic,
    loop: changLoop,
    toggle_volume: toggleVolume,
    progress: progressClick,
}

const path = function(index) {
    var s = `/audio/music/${index}.mp3`
    return s
}

const DOMatIndex = function(selector, index) {
    var doms = es(selector)
    for (var i = 0; i < doms.length; i++) {
        var dom = doms[i]
        if (dom.dataset.index == index) {
            return dom
        }
    }
    return null
}

const coverRotete = function() {
    var cl = e('.cover-list')
    if (cl.classList.contains('rotate-pause')) {
        cl.classList.remove('rotate-pause')
    }
    cl.classList.add('rotate-on')
}

const coverPause = function() {
    var cl = e('.cover-list')
    if (cl.classList.contains('rotate-on')) {
        cl.classList.remove('rotate-on')
    }
    cl.classList.add('rotate-pause')
}

const setPlayBackground = function(dom) {
    // removeClassInSelAll('.each-music', 'play-background')
    // music.classList.add('play-background')
    var like = find(dom, '.icon-like')
    removeClassInSelAll('.icon-like', 'play-border')
    like.classList.add('play-border')

}

const showInfo = function(index) {
    var infoName = e('.info-name')
    var infoArtist = e('.info-artist')
    var infoAlbum = e('.info-album')
    var music = DOMatIndex('.each-music', index)
    if (music != null) {
        infoName.innerText = find(music, '.music-name').innerText
        infoArtist.innerText = find(music, '.music-artist').innerText
        infoAlbum.innerText = find(music, '.music-album').innerText
        setPlayBackground(music)
    }
    noneAll('.each-cover')
    var cover = DOMatIndex('.each-cover', index)
    if (cover != null) {
        cover.classList.remove('none')
    }
    e('.cover-list').dataset.active = index
}

const showCurrentTime = function() {
    var music = e('audio')
    var bar = e('.progress-bar-total')
    var timer = setInterval(function() {
        var music = e('audio')
        var currentTime = music.currentTime
        var totalTime = music.duration
        var ctime = new Time(currentTime)
        ctime.putTime('.current-time')
        var totalWidth = bar.offsetWidth
        var p = new Progress(totalWidth, totalTime)
        p.setWidth(currentTime, '.progress-bar-now')
    }, 1000)
    return timer
}

const getNewValue = function(selector, offsetWidth, totalWidth, totalValue) {
    var wid = String(offsetWidth) + 'px'
    e(selector).style.width = wid
    var newValue = Math.floor(offsetWidth / totalWidth * totalValue)
    return newValue
}

const setNewWidth = function(selector, offsetValue, totalValue, totalWidth) {
    var newWidth = String(offsetValue / totalValue * totalWidth) + 'px'
    e(selector).style.width = newWidth
}

const clearTimer = function() {
    clearInterval(currentTimer.timer)
}
