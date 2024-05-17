#!/usr/bin/env node
// Make the HTML files

import fs from 'fs'

const storyfiles = [
    ['arthur', 'Arthur: The Quest for Excalibur', 'arthur-r74-s890714.z6', 'Arthur.blb'],
    ['journey', 'Journey: The Quest Begins', 'journey-r83-s890706.z6', 'Journey.blb'],
    ['shogun', `James Clavell's Shōgun`, 'shogun-r322-s890706.z6', 'Shogun.blb'],
    ['zorkzero', 'Zork Zero: The Revenge of Megaboz', 'zork0-r393-s890714.z6', 'ZorkZero.blb'],
]

const template = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>TITLE</title>
    <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>TITLE</h1>
    <canvas id="canvas"></canvas>
    <p><a href="index.html">Other games on Infocom Frotz</a></p>
    <script>window.files = ["STORYFILE", "BLORB"]</script>
    <script async type="text/javascript" src="sfrotz.js"></script>
  </body>
</html>`

for (const story of storyfiles) {
    const [name, title, storyfile, data] = story
    const html = template.replaceAll('TITLE', title)
        .replace('STORYFILE', storyfile)
        .replace('BLORB', data)
    fs.writeFileSync(`dist/${name}.html`, html)
}