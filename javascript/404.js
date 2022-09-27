const $ = (query, parent) => (parent || document).querySelector(query)
const $$ = (query, parent) => (parent || document).querySelectorAll(query)

setInterval(_ => {
    setTimeout(_ => {
        $('[preloader] svg .cls-1').style.fill = 'var(--background)';
        setTimeout(_ => {
            $('[preloader] svg .cls-2').style.fill = 'var(--background)';
            setTimeout(_ => {
                $('[preloader] svg').style.fill = 'var(--background)';
            }, 250)
        }, 200)
    }, 400)

    setTimeout(_ => {
        $('[preloader] svg .cls-1').style.fill = '#fff';
        $('[preloader] svg .cls-2').style.fill = '#f33';
        $('[preloader] svg').style.fill = 'var(--shadow)';
    }, 900)
}, 1100)