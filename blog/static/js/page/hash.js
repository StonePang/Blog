bindEvents.hash = function() {
    var a = e('#id-hash')
    a.addEventListener('click', function() {
        log('hash')
        scrollTo(0, 0)
    })

    window.onscroll = function() {
        var a = e('#id-hash')
        var t = window.pageYOffset
        if (t > 100) {
            a.classList.remove('none')
        } else {
            a.classList.add('none')
        }
    }
}
