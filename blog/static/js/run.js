const run = function(obj) {
    for(var ele in obj) {
        obj[ele]()
    }
}

const main = function() {
    run(loadPage)
    run(bindEvents)
}

window.onload = main
