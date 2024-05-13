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
        FS.createPreloadedFile('/', files[0], files[0], true, false)
        FS.createPreloadedFile('/', files[1], files[1], true, false)
    }
}