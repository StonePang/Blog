var request = require('sync-request')
var cheerio = require('cheerio')

class Movie {
    constructor() {
        this.ranking = 0
        this.name = ''
        this.nameEng = ''
        this.date = 0
        this.quote = ''
        this.director = ''
        this.staring = ''
        this.type = ''
        this.score = 0
        this.voted = 0
        this.coverUrl = ''
    }
}

var log = console.log.bind(console)

var cachedUrl = url => {
    var url2 = url
    if (url2 =='http://www.mtime.com/top/movie/top100/') {
        url2 += 'index-1.html'
    }
    var fileName = url2.split('top100/')[1].split('-')[1].split('.')[0]

    var cacheFile = './db/cached_html/' + fileName + '.html'

    var fs = require('fs')
    var exists = fs.existsSync(cacheFile)
    if (exists) {
        var data = fs.readFileSync(cacheFile)
        // log('data', data)
        return data
    } else {
        // 用 GET 方法获取 url 链接的内容
        // 相当于你在浏览器地址栏输入 url 按回车后得到的 HTML 内容
        var r = request('GET', url)
        // utf-8 是网页文件的文本编码
        var body = r.getBody('utf-8')
        // 写入缓存
        fs.writeFileSync(cacheFile, body)
        return body
    }
}

//不用缓存文件，直接从url取得数据并存入
var getFrommUrl = url => {
    var url2 = url
    if (url2 =='http://www.mtime.com/top/movie/top100/') {
        url2 += 'index-1.html'
    }
    var fileName = url2.split('top100/')[1].split('-')[1].split('.')[0]
    var cacheFile = './db/cached_html/' + fileName + '.html'
    var fs = require('fs')
    var r = request('GET', url)
    // utf-8 是网页文件的文本编码
    var body = r.getBody('utf-8')
    // 写入缓存
    fs.writeFileSync(cacheFile, body)
    return body
}

var getNDfromPb6 = function(movie, content) {
    var contentText = content.text()
    var s = contentText.split(' ')
    //取出电影中文名
    var name = s[0]
    //剩余部分是英文名和日期组成的字符串
    var rest = s[1]
    var r = rest.split(' ')
    var other = []
    //r除了最后一个元素都是英文名的单词
    for (var i = 0; i < r.length - 1; i++) {
        var word = r[i]
        other.push(word)
    }
    //将单词重新组合成英文名字符串
    var otherName = other.join(' ')
    //最后一个元素是日期，但是要去掉首尾两个括号字符
    var d = r[r.length - 1]
    var date = ''
    for (var i = 1; i < d.length - 1; i++) {
        var letter = d[i]
        date += letter
    }
    movie.name = name
    movie.nameEng = otherName
    movie.date = Number(date)
}

var getName = function(pa) {
    var a = []
    for(var j = 0; j < pa.length; j++) {
        var ele = pa[j]
        //重新包装
        var element = cheerio.load(ele)
        //取得text
        var eleText = element.text()
        //text存在数组中
        a.push(eleText)
    }
    return a
}

var getDSTfromMovcon = function(movie, p) {
    var pArray = []
    for(var i = 0; i < p.length - 1; i++) {
        var part = p[i]
        //用下标取的，需要重新包装一次
        var partDom = cheerio.load(part)
        //需要的信息都在标签a中，提取出标签a的元素组成的数组
        var partArray = partDom('a')
        //partArray是个数组，对数组的每个元素进行处理
        var nameArray = getName(partArray)
        //将得到的数组再放进总的数组中
        pArray.push(nameArray)
    }
    //每个值都是总数组的一个元素，，此元素本身又是一个数组
    movie.director = pArray[0]
    movie.staring = pArray[1]
    movie.type = pArray[2]
}

//把不是数字的字符过滤
var getnumber = function(str) {
    var num = '0123456789'
    var s = ''
    for(var i = 0; i< str.length; i++) {
        var c = str[i]
        if(num.includes(c)) {
            s += c
        }
    }
    return Number(s)
}

var getSVfromPoint = function(movie, point) {
    var score1 = point.find('.total').text()
    var score2 = point.find('.total2').text()
    var voted = point.find('p').text()
    var score = score1 + score2
    movie.score = Number(score).toFixed(1)
    movie.voted = getnumber(voted)
}

var movieFromDiv = function(div) {
    var e = cheerio.load(div)
    var movie = new Movie()

    var content = e('a', '.pb6')
    //从content中得到name,nameEng,date
    getNDfromPb6(movie, content)

    var movcon = e('.mov_con').find('p')
    //从movcon中得到director,staring,type
    getDSTfromMovcon(movie, movcon)

    movie.ranking = Number(e('em', '.number').text())
    movie.quote = e('.mt3').text()

    var pic = e('.mov_pic')
    movie.coverUrl = pic.find('img').attr('src')

    var point = e('.mov_point')
    //从point中得到score,voted
    getSVfromPoint(movie, point)
    return movie
}

var moviesFromUrl = function(url) {
    // var body = cachedUrl(url)
    var body  = getFrommUrl(url)
    var e = cheerio.load(body)

    var movieDivs = e('li', '#asyncRatingRegion')
    var movies = []
    for (var i = 0; i < movieDivs.length; i++) {
        var div = movieDivs[i]
        // log(div)
        // 扔给 movieFromDiv 函数来获取到一个 movie 对象
        var m = movieFromDiv(div)
        movies.push(m)
    }
    return movies
}

var saveMovie = function(movies) {
    var s = JSON.stringify(movies, null, 2)
    var fs = require('fs')
    var path = './db/mtime.json'
    fs.writeFileSync(path, s)
}

var downloadCovers = movies => {
    // 使用 request 库来下载图片
    var request = require('request')
    var fs = require('fs')
    for (var i = 0; i < movies.length; i++) {
        var m = movies[i]
        var url = m.coverUrl
        // 保存图片的路径
        var path = './db/covers/' + m.name + '.jpg'
        // 下载并保存图片的套路
        request(url).pipe(fs.createWriteStream(path))
    }
}

var m = {}

m.getMovies = function() {
    // 主函数
    var movies = []
    for (var i = 1; i <= 10; i++) {
        var url = `http://www.mtime.com/top/movie/top100/`
        if (i != 1) {
            url += `index-${i}.html`
        }
        log(`url # ${i}`,url)
        var moviesInPage = moviesFromUrl(url)
        // 注意这个 ES6 的语法
        movies = [...movies, ...moviesInPage]
    }
    saveMovie(movies)
    // download covers
    downloadCovers(movies)
    return movies
}

// m.getMovies = function() {
//     return '后端返回数据'
// }

module.exports = m
