// Infocom Frotz Emscripten preamble

const files = window.files
Module.arguments = ['-C', '/sfrotz.rc', '/' + files[0], '/' + files[1]]
Module.canvas = document.getElementById('canvas')

Module.preRun = () => {
    // Load files
    for (const file of files) {
        FS.createPreloadedFile('/', file, file, true, false)
    }

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