// Infocom Frotz Emscripten preamble

const files = window.files
Module.arguments = ['/' + files[0], '/' + files[1]]
Module.canvas = document.getElementById('canvas')

Module.preRun = () => {
    // Load storyfile and blorb
    FS.createPreloadedFile('/', files[0], files[0], true, false)
    FS.createPreloadedFile('/', files[1], files[1], true, false)

    // Set up the saves folder with IDBFS
    FS.mkdir('/saves')
    FS.mount(IDBFS, {autoPersist: true}, '/saves')
    FS.chdir('/saves')
    FS.syncfs(true, err => {
        if (err) {
            console.log(err)
        }
    })
}