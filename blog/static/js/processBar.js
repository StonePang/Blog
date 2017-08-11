var log = console.log.bind(console)

//封装的进度条类
//构造函数完成对事件的绑定
//调用最后的函数即创建一个DOM在制定的位置
class ProBar {
    constructor(obj) {
        //进度条块的class名
        this.className = obj.className
        //自定义属性名
        this.dataName = obj.dataName || ''
        //自定义属性值
        this.dataValue = obj.dataValue || ''
        //条长度
        this.width = obj.width || '500px'
        //条高度
        this.height = obj.height || '10px'
        //滑块的直径
        this.d = obj.d || '20px'
        //已完成的颜色
        this.color = obj. color || 'red'
        //未完成的颜色
        this.bgcolor = obj.bgcolor || 'grey'
        //滑动块的颜色
        this.cyclecolor = obj.cyclecolor || 'white'
        //输入量的最大值
        this.totalValue = obj.totalValue
        //需要插入的位置的选择器名
        this.selector = obj.selector
        //是否需要连续输出input/change
        this.continue = obj.continue || false
        //开始的位置比例，用小于1的小数表示
        this.startPercentage = obj.startPercentage || 0
        //回调函数，对获得的值进行处理
        this.callback = obj.callback
        //内部控制mousemove用的变量
        this.dragable = false
        //设置函数
        this.setup()
    }

    setup() {
        //初始化html字符串
        var h = this.creatHtml()
        //插入相应的选择器位置
        var p = document.querySelector(this.selector)
        p.insertAdjacentHTML('beforeend', h)
        var name = this.className
        var fa = document.querySelector(`.${name}`)
        //定义DOM
        this.totalBar = fa.querySelector('.pro-bar-total')
        this.nowBar = fa.querySelector('.pro-bar-now')
        this.cycle = fa.querySelector('.pro-cycle')
        //计算出最大值对应的最大宽度
        this.totalWidth = this.tw()
        //绑定事件
        this.bindEvents(this.callback)
        //设置初始状态的滑块位置
        this.newValue = this.setupnv()
    }

    creatHtml() {
        var html =
            `
            <div class="${this.className}" data-${this.dataName}='${this.dataValue}' style='width:${this.width}; height:${this.d};position:relative;'>
                <div class="pro-bar-now" data-action='progress_' style='width:0; height:${this.height}; background-color:${this.color}; z-index:3;'></div>
                <div class="pro-bar-total" data-action='progress_' style='width:${this.width}; height:${this.height}; background-color:${this.bgcolor};'></div>
                <div class="pro-cycle" data-action='cycle' style='width:${this.d}; height:${this.d}; border-radius:50%; background-color:${this.cyclecolor};z-index:3'></div>
            </div>

            `
        return html
    }

    tw() {
        var cw = this.cycle.style.width
        var tw = this.totalBar.style.width
        var totalWidth = Number(tw.slice(0, -2)) - Number(cw.slice(0, -2))
        return totalWidth
    }

    setupnv() {
        var tw = this.totalWidth
        var per = this.startPercentage
        var startValue = tw * per
        this.newValue = startValue
        this.cycle.style.left = startValue + 'px'
        this.nowBar.style.width = startValue + 'px'
    }


    bindEvents(callback) {
        // var actions = this.actions
        //that绑定为类对象this,在之后的绑定时间中庸that代替this,this代表调用的DOM对象document，
        var that = this
        document.addEventListener('click', function(event) {
            var k = event.target.dataset.action
            if (k == 'progress_') {
                log('~~~~~~~~~~~~~~click')
                that.progress(event, callback)
            }
        })

        document.addEventListener('mousedown', function(event) {
            var k = event.target.dataset.action
            if (k == 'cycle') {
                log('mousedown_cycle', event)
                var cycle = that.cycle
                that.pageX = event.pageX
                that.dragable = true
            }
        })

        document.addEventListener('mouseup', function(event) {
            if (that.dragable) {
                that.dragable = false
                if (!that.continue) {
                    var x = that.cycle.style.left.slice(0, -2)
                    var newValue = that.nv(x)
                    that.newValue = newValue
                    callback(that.newValue)
                }
            }
        })

        document.addEventListener('mousemove', function(event) {
            that.mousemove_cycle(event, callback)
        })

    }

    //计算得到newValue的函数
    nv(x) {
        var cw = this.cycle.style.width
        var tw = this.totalBar.style.width
        var tv = this.totalValue
        var totalWidth = Number(tw.slice(0, -2)) - Number(cw.slice(0, -2))
        var newValue = (x / totalWidth * tv)
        // log('nw, tw, tv, res', x, totalWidth, tv, newValue)
        return newValue
    }

    progress(event, callback) {
        log('pro')
        var x = event.offsetX
        var left = event.target.getBoundingClientRect().left
        log('left', left)
        log('target, offsetX, event', event.target, x, event)
        var bar = this.nowBar
        var cycle = this.cycle
        var totalWidth = this.totalWidth
        var newValue = this.nv(x)
        log('x, tw', x, totalWidth)
        if (x <= totalWidth ) {
            bar.style.width = String(x) + 'px'
            cycle.style.left = String(x) + 'px'
            this.newValue = newValue
        } else {
            bar.style.width = totalWidth + 'px'
            cycle.style.left = totalWidth + 'px'
            this.newValue = this.totalValue
        }
        // log(this.totalValue, this.newValue)
        callback(this.newValue)
     }

    mousemove_cycle(event, callback) {
        if (this.dragable) {
            var cycle = this.cycle
            var parentX = cycle.offsetLeft
            var now = this.nowBar
            var x1 = this.pageX
            var x2 = event.pageX
            var move = x2 - x1
             if (parentX <= 0 && move <= 0) {
                cycle.style.left = 0
                now.style.width = 0
            } else if (parentX >= this.totalWidth && move >= 0) {
                cycle.style.left = this.totalWidth + 'px'
                now.style.width = this.totalWidth + 'px'
            }else {
                var m = String(parentX + move) + 'px'
                cycle.style.left = m
                now.style.width = m
                this.pageX = event.pageX
            }
            if (this.continue) {
                var nw = Number(cycle.style.left.slice(0, -2))
                this.newValue = this.nv(nw)
                callback(this.newValue)
            }
        }
    }
}

var progressBar = function(obj) {
    var d = new ProBar(obj)
}
