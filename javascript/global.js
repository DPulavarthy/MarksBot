const $ = (query, parent) => (parent || document).querySelector(query)
const $$ = (query, parent) => (parent || document).querySelectorAll(query)
const { style } = document.documentElement
let mode = !window.matchMedia("(prefers-color-scheme: dark)").matches ? 'light' : 'dark'

const handler = {
    set(data, prop, receiver) {
        Reflect.set(...arguments);
        build()
        return true
    },
};

let cache = { scroll: null, mode: null, notif: null, perspective: null, full: null, animations: null }

const ext = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 194.818 194.818"><g><path d="M185.818,2.161h-57.04c-4.971,0-9,4.029-9,9s4.029,9,9,9h35.312l-86.3,86.3c-3.515,3.515-3.515,9.213,0,12.728c1.758,1.757,4.061,2.636,6.364,2.636s4.606-0.879,6.364-2.636l86.3-86.3v35.313c0,4.971,4.029,9,9,9s9-4.029,9-9v-57.04C194.818,6.19,190.789,2.161,185.818,2.161z"/></g></svg>'
$$("[external]").forEach(elem => {
    elem.setAttribute('target', '_blank')
    elem.insertAdjacentHTML("beforeend", ext)
});

$('[view]').onscroll = _ => {
    $('[top]').style.opacity = $('[view]').scrollTop < 10 || $('[view]').innerWidth < 1100 ? 0 : 1
    $('[top]').style.pointerEvents = $('[view]').scrollTop < 10 || $('[view]').innerWidth < 1100 ? 'none' : 'auto'
}

window.onbeforeunload = _ => window.scrollTo(0, 0);

window.onload = _ => {
    parse()
    build()

    if (cache.mode && cache.mode !== mode) toggle()

    if (cache.perspective || cache.full) {
        $('[mount]').style.transform = 'none';
        $('[mount]').style.height = '100vh';
        $('[home]').style.transform = 'none';
        $('[home]').style.height = '100vh';
        $('[view]').style.height = '100vh';
        $('[home]').style.width = '100%';
        $('[mount]').style.transitionDuration = '0';
        $('[home]').style.transitionDuration = '0';
        style.setProperty('--perspective', 'none')
    }

    if (cache.full) {
        style.setProperty('--flow', 'block')
        $('nav').style.display = 'none';
    }

    if (cache.animations) $('[animations]').checked = false

    $('[top]').onclick = _ => $('[view]').scrollTo({ top: 0, behavior: 'smooth' });

    const result = []
    if (cache.mode === (window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light')) delete cache.mode
    for (const key in cache) if (cache[key]) result.push(`${key}=${cache[key]}`)
    $$('a').forEach(elem => {
        if (!elem.hasAttribute('external')) elem.href = `${elem.href.split('#')[0]}#${result.join('&')}`
    })
    time()
    setInterval(time, 500)
    function time() {
        style.setProperty('--time', `'${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} | ${new Date().toLocaleTimeString()}'`)
    }

    window.innerWidth > 1100 && !cache.notif ? new Notification('Hello There!<p>&#x1F44B;</p>', `Looking for help? Join the <a href="https://discord.gg/yPDxEDu" external target="_blank">support server${ext}</a>!<br /><br />We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies. <a href="http://wikipedia.org/wiki/HTTP_cookie" external target="_blank">More info${ext}</a>`, null, true) : void 0

    setTimeout(_ => {
        $('[preloader] svg .cls-1').style.fill = 'var(--background)';
        setTimeout(_ => {
            $('[preloader] svg .cls-2').style.fill = 'var(--background)';
            setTimeout(_ => {
                $('[preloader] svg').style.fill = 'var(--background)';
                $('[preloader]').classList.add('hide')
                setTimeout(_ => $('[preloader]').remove(), 400)
            }, 250)
        }, 200)
    }, 400)
    style.setProperty('--load', `'Page generated in ${((new Date().getTime() - init) / 1000).toFixed(4).toLocaleString()} seconds.'`)
}


function toggle(force) {
    mode = mode === 'dark' ? 'light' : 'dark'
    style.setProperty('--background', mode === 'light' ? '#eeeeee' : '#111111')
    style.setProperty('--color', mode === 'light' ? '#111111' : '#eeeeee')
    style.setProperty('--elements', mode === 'light' ? '#dddddd' : '#222222')
    style.setProperty('--hover', mode === 'light' ? '#0000001a' : '#ffffff1a')
    style.setProperty('--shadow', mode === 'light' ? '#808080' : '#000000')
    if ($('[view] div iframe')) $('[view] div iframe').src = mode === 'light' ? 'https://discordapp.com/widget?id=552142180098244619&theme=light' : 'https://discordapp.com/widget?id=552142180098244619&theme=dark'
    cache.mode = mode
    build()
}

function animations() {
    cache.animations = cache.animations ? null : true
    build()
    $('[mount]').style.transitionDuration = !cache.animations ? '200ms' : '0ms';
    $('[home]').style.transitionDuration = !cache.animations ? '200ms' : '0ms';
}

function perspective() {
    if (window.innerWidth < 1200) return
    let anim = parse() ? parse().animations : false
    const nav = $('[mount]').style.transform === 'none'
    $('[mount]').style.transitionDuration = !anim ? '200ms' : '0ms';
    $('[home]').style.transitionDuration = !anim ? '200ms' : '0ms';
    $('[mount]').style.transform = nav ? 'perspective(100vw) rotateY(30deg)' : 'none';
    $('[mount]').style.height = nav ? '70vh' : '100vh';
    $('[home]').style.transform = nav ? 'perspective(100vw) rotateY(-10deg)' : 'none';
    $('[home]').style.height = nav ? '90vh' : '100vh';
    $('[view]').style.height = nav ? '90vh' : '100vh';
    $('[home]').style.width = nav ? '95%' : '100%';
    $('[mount]').style.transitionDuration = '0';
    $('[home]').style.transitionDuration = '0';
    style.setProperty('--perspective', nav ? 'auto' : 'none');
    cache.perspective = cache.perspective ? null : true;
    build()
}

const random = (sections = 5, phrase = 5, join = '-') => {
    const list = [...[...Array(26)].map((_, i) => String.fromCharCode(i + 65)), ...[...Array(26)].map((_, i) => String.fromCharCode(i + 65).toLowerCase()), ...[...Array(10).keys()]]
    const pick = _ => list[Math.floor(Math.random() * list.length)]
    return [...Array(sections)].map(_ => [...Array(phrase)].map(pick).join('')).join(join);
};

function parse() {
    const args = localStorage.getItem('marksbot-cache') ? localStorage.getItem('marksbot-cache').split('&') : []
    if (!args.length) return
    const obj = []
    args.map(e => e.split('=')).map(([key, value]) => obj[key] = value)
    const result = { ...cache, ...obj }
    cache = result
    return result
}

function build() {
    const result = []
    if (cache.mode === (window.matchMedia("(prefers-color-scheme: dark)").matches ? 'dark' : 'light')) delete cache.mode
    for (const key in cache) if (cache[key]) result.push(`${key}=${cache[key]}`)
    localStorage.setItem('marksbot-cache', result.length ? result.join('&') : '')
}