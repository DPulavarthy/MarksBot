$$('tbody tr').forEach(elem => {
    elem.onclick = _ => {
        elem.classList.add('green')
        navigator.clipboard.writeText($('td', elem).innerHTML)
        new Notification('Copied', `<code>${$('td', elem).innerHTML}</code>`, 5000, false);
        setTimeout(_ => elem.classList.remove('green'), 200)
    }
})