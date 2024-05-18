// Infocom Frotz Emscripten preamble

const files = window.files
const textinput_elem = document.getElementById('textinput')
Module.arguments = ['/' + files[0], '/' + files[1]]
Module.canvas = document.getElementById('canvas')

Module.preRun = () => {
    // Load storyfile and blorb
    FS.createPreloadedFile('/', files[0], files[0], true, false)
    FS.createPreloadedFile('/', files[1], files[1], true, false)

    // Set up the saves folder with IDBFS
    FS.mkdir('/saves')
    FS.mount(IDBFS, {}, '/saves')
    FS.chdir('/saves')
    FS.syncfs(true, err => {
        if (err) {
            console.log(err)
        }
    })
}

// Mobile input event handlers
Module.canvas.addEventListener('touchstart', ev => {
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
        const options = {
            code: 'Backspace',
            key: 'Backspace',
            keyCode: 8,
            which: 8,
        }
        window.dispatchEvent(new KeyboardEvent('keydown', options))
        window.dispatchEvent(new KeyboardEvent('keyup', options))
        ev.preventDefault()
        ev.stopPropagation()
    }
    if (ev.which === 13) {
        const options = {
            charCode: 13,
            code: 'Enter',
            key: 'Enter',
            keyCode: 13,
            which: 13,
        }
        window.dispatchEvent(new KeyboardEvent('keydown', options))
        window.dispatchEvent(new KeyboardEvent('keypress', options))
        window.dispatchEvent(new KeyboardEvent('keyup', options))
        ev.preventDefault()
        ev.stopPropagation()
    }
    if (ev.which === 229) {
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