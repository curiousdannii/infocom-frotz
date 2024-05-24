// Infocom Frotz interface hacks

const canvas_elem = document.getElementById('canvas')
const textinput_elem = document.getElementById('textinput')

// Prevent iOS from zooming in when focusing input, but allow Android to still pinch zoom
// As they handle the maximum-scale viewport meta option differently, we will conditionally add it only in iOS
// Idea from https://stackoverflow.com/a/62750441/2854284
if (/iPhone OS/i.test(navigator.userAgent)) {
    document.head.querySelector('meta[name="viewport"]').content = 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1'
}

visualViewport.addEventListener('resize', () => {
    const height = visualViewport.height
    document.documentElement.style.height = `${height}px`

    // Safari might have scrolled weirdly, so try to put it right
    window.scrollTo(0, 0)
    setTimeout(() => window.scrollTo(0, 0), 500)
})

// Mobile input event handlers
canvas_elem.addEventListener('touchstart', ev => {
    textinput_elem.focus()
})
textinput_elem.addEventListener('input', ev => {
    const char = ev.data
    if (char) {
        const char_keycode = char.codePointAt(0)
        const upper_key = char.toUpperCase()
        const upper_keycode = upper_key.codePointAt(0)
        const down_up_options = {
            code: 'Key' + upper_key,
            key: char,
            keyCode: upper_keycode,
            which: upper_keycode,
        }
        window.dispatchEvent(new KeyboardEvent('keydown', down_up_options))
        window.dispatchEvent(new KeyboardEvent('keypress', {
            charCode: char_keycode,
            code: 'Key' + upper_key,
            key: char,
            keyCode: char_keycode,
            which: char_keycode,
        }))
        window.dispatchEvent(new KeyboardEvent('keyup', down_up_options))
    }

    // To fully reset we have to clear the value then blur and refocus, otherwise Android will keep trying to do its IME magic, which we don't want.
    textinput_elem.value = ''
    textinput_elem.blur()
    textinput_elem.focus()

    ev.preventDefault()
    ev.stopPropagation()
})
textinput_elem.addEventListener('keydown', ev => {
    if (ev.which === 8) {
        send_fake_keydown(8)
    }
    if (ev.which === 13) {
        send_fake_keydown(13)
    }
    if (ev.which === 8 || ev.which === 13 || ev.which === 229) {
        ev.preventDefault()
        ev.stopPropagation()
    }
})
textinput_elem.addEventListener('keyup', ev => {
    if (ev.which === 8 || ev.which === 13 || ev.which === 229) {
        ev.preventDefault()
        ev.stopPropagation()
    }
})

// Arthur buttons
const arthurmodes = document.getElementById('arthurmodes')
if (arthurmodes) {
    arthurmodes.addEventListener('click', ev => {
        let target = ev.target
        if (target.tagName === 'SPAN') {
            target = target.parentNode
        }
        if (target.tagName === 'P') {
            send_fake_keydown(parseInt(target.dataset.keycode, 10))
        }
        textinput_elem.focus()
    })
}

// Send a fake keydown/keyup
const named_codes = {
    8: 'Backspace',
    13: 'Enter',
}
function send_fake_keydown(code) {
    const name = named_codes[code] || `F${code - 111}`
    const data = {
        code: name,
        key: name,
        keyCode: code,
        which: code,
    }
    if (code === 13) {
        data.charCode = 13
    }
    window.dispatchEvent(new KeyboardEvent('keydown', data))
    if (code === 13) {
        window.dispatchEvent(new KeyboardEvent('keypress', data))
    }
    window.dispatchEvent(new KeyboardEvent('keyup', data))
}