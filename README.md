Infocom Frotz: play Infocom's Z6 games online
=============================================

Infocom Frotz builds [Frotz](https://gitlab.com/DavidGriffith/frotz) with [Emscripten](https://emscripten.org/) so that Infocom's Z6 games can be played online.

Infocom Frotz is GPL-2.0 licensed.

The game files were obtained from [The Obsessively Complete Infocom Catalog](https://eblong.com/infocom/), the media files from the [IF Archive](https://ifarchive.org/indexes/if-archive/infocom/media/blorb/), and the manuals from the [Infocom Documentation Project](https://infodoc.plover.net/manuals/index.html). They are proprietary documents whose copyright belongs to Activision.

Infocom's non-Z6 games should be played with [Parchment](https://iplayif.com/) instead.

Building
--------

Run `./build.sh` to build Infocom Frotz. However, because of an [obscure Emscripten bug](https://github.com/emscripten-core/emscripten/issues/21930), the build will often not work. Run `rm frotz/sfrotz.js && ./build.sh` to rebuild it, until it works. This is for the moment preventing automatic builds and deployments.