class Notification {
    constructor(title, message, timeout, initial) {
        this.id = initial ? 'welcome' : random()
        this.element = document.createElement('div')
        this.element.id = this.id
        this.show(...arguments)
    }

    show(title, message, timeout, initial) {
        this.element.innerHTML = `<div remove onclick="hide('${this.id}')">x</div><h1>${title}</h1><hr /><p>${message}</p>`
        initial ? this.element.setAttribute('welcome', '') : void 0
        $('[notifications]').insertAdjacentHTML('afterbegin', this.element.outerHTML)
        timeout && setTimeout(_ => hide(this.id), timeout)
    }
}

function hide(id) {
    if (id === 'welcome') {
        cache.notif = 'hide'
        build()
    }
    let element = document.getElementById(id)
    if (element) {
        element.classList.add('hide')
        setTimeout(_ => element.remove(), 400)
    }
}