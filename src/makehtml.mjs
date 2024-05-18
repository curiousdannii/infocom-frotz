#!/usr/bin/env node
// Make the HTML files

import fs from 'fs'

const storyfiles = [
    {
        blorb: 'Arthur.blb',
        id: 'arthur',
        short_title: 'Arthur',
        storyfile: 'arthur-r74-s890714.z6',
        title: 'Arthur: The Quest for Excalibur',
    },
    {
        blorb: 'Journey.blb',
        id: 'journey',
        short_title: 'Journey',
        storyfile: 'journey-r83-s890706.z6',
        title: 'Journey: The Quest Begins',
    },
    {
        blorb: 'Shogun.blb',
        id: 'shogun',
        short_title: 'Shōgun',
        storyfile: 'shogun-r322-s890706.z6',
        title: `James Clavell's Shōgun`,
    },
    {
        blorb: 'ZorkZero.blb',
        id: 'zorkzero',
        short_title: 'Zork Zero',
        storyfile: 'zork0-r393-s890714.z6',
        title: 'Zork Zero: The Revenge of Megaboz',
    },
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
    <h1>SHORTTITLE</h1>
    <canvas id="canvas"></canvas>
    <textarea id="textinput" autocapitalize="off" rows="1"></textarea>
    <p><a href="index.html">Other games on Infocom Frotz</a></p>
    <script>window.files = ["STORYFILE", "BLORB"]</script>
    <script async type="text/javascript" src="sfrotz.js"></script>
  </body>
</html>`

for (const story of storyfiles) {
    const html = template
        .replace('BLORB', story.blorb)
        .replace('SHORTTITLE', story.short_title)
        .replace('STORYFILE', story.storyfile)
        .replace('TITLE', story.title)
    fs.writeFileSync(`dist/${story.id}.html`, html)
}