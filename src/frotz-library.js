// Infocom Frotz library functions
// For replacing some functions

const FROTZ_JS = {
    // emscripten_set_main_loop_timing just errors because it's called at the wrong time
    emscripten_set_main_loop_timing() {},

    // We've already set the title
    emscripten_set_window_title() {},

    // Sync IDBFS after saving a savefile
    fd_close(fd) {
        try {
            const stream = SYSCALLS.getStreamFromFD(fd)
            const flags = stream.flags
            const path = stream.path
            FS.close(stream)
            // Don't run if we're currently syncing (because syncing will run this code)
            if (FS.syncFSRequests === 0) {
                // Then check that we're saving a savefile
                if (path.startsWith('/saves/') && flags & 3) {
                    FS.syncfs(err => {
                        if (err) {
                            console.log(err)
                        }
                    })
                }
            }
            return 0
        } catch (e) {
            if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e
            return e.errno
        }
    },
}

addToLibrary(FROTZ_JS)