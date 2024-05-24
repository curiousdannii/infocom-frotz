// Infocom Frotz Emscripten preamble

const files = window.files
Module.arguments = ['/' + files[0], '/' + files[1]]
Module.canvas = document.getElementById('canvas')

Module.preRun = () => {
    // Prevent iOS from zooming in when focusing input, but allow Android to still pinch zoom
    // As they handle the maximum-scale viewport meta option differently, we will conditionally add it only in iOS
    // Idea from https://stackoverflow.com/a/62750441/2854284
    if (/iPhone OS/i.test(navigator.userAgent)) {
        document.head.querySelector('meta[name="viewport"]').content = 'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1'
    }

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