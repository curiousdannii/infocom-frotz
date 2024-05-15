// Infocom-frotz Emscripten preamble

const storyfiles = {
    arthur: ['arthur-r74-s890714.z6', 'Arthur.blb'],
    journey: ['journey-r83-s890706.z6', 'Journey.blb'],
    shogun: ['shogun-r322-s890706.z6', 'Shogun.blb'],
    zork0: ['zork0-r393-s890714.z6', 'ZorkZero.blb'],
}

const query = new URLSearchParams(document.location.search)
const story = query.get('story')

if (story && storyfiles[story]) {
    const files = storyfiles[story]
    Module.arguments = ['/' + files[0], '/' + files[1]]
    Module.preRun = () => {
        // Patch some API functions

        // emscripten_set_main_loop_timing just errors because it's called at the wrong time
        _emscripten_set_main_loop_timing = () => {}

        // Sync IDBFS after saving a savefile
        const old_FS_close = FS.close
        FS.close = stream => {
            const flags = stream.flags
            const path = stream.path
            old_FS_close(stream)
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
}