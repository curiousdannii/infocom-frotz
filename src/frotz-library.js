// Infocom Frotz library functions
// For replacing some functions

const FROTZ_JS = {
    // Handle high pixel densities by faking it...
    emscripten_get_element_css_size(target, width, height) {
        target = findEventTarget(target)
        if (!target) {
            return -4
        }
        if (typeof target.requestedheight === 'number') {
            HEAPF64[((width)>>3)] = target.requestedwidth
            HEAPF64[((height)>>3)] = target.requestedheight
        }
        else {
            var rect = getBoundingClientRect(target)
            HEAPF64[((width)>>3)] = rect.width
            HEAPF64[((height)>>3)] = rect.height
        }
        return 0
    },

    emscripten_set_canvas_element_size(target, width, height){
        var canvas = findCanvasEventTarget(target)
        if (!canvas) {
            return -4
        }
        canvas.width = width
        canvas.height = height
        const screen_width = screen.width
        if (width > screen_width) {
            canvas.requestedwidth = width
            canvas.requestedheight = height
            canvas.style.width = `${screen_width}px`
            canvas.style.height = `${screen_width * (height / width)}px`
        }
        else {
            canvas.requestedwidth = null
            canvas.requestedheight = null
            canvas.style.width = ''
            canvas.style.height = ''
        }
        return 0
    },

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