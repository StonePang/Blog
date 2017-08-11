loadPage.showReminderNum = function() {
    setInterval(function() {
        let reminderNum = Number(localStorage.reminderNum)
        var rmdNum = document.querySelector('.reminder-num')
        if (reminderNum > 0) {
            rmdNum.classList.remove('hide')
            rmdNum.innerHTML = reminderNum
        }else {
            rmdNum.classList.add('hide')
        }
    }, 2000)
}

loadPage.changeTitle = function() {
    var title = e('title')
    var t = title.innerText
    title.dataset.name = t
    // log(title, t)
    setInterval(function(t) {
        let reminderNum = Number(localStorage.reminderNum)
        var title = e('title')
        var titleName = title.dataset.name
        if (reminderNum > 0) {
            title.innerHTML = titleName + `(${reminderNum}条未完成记录)`
        }else {
            title.innerHTML = titleName
        }
    }, 2000)
}
