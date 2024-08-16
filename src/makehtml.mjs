#!/usr/bin/env node
// Make the HTML files

import fs from 'fs'

const storyfiles = [
    {
        blorb: 'Arthur.blb',
        id: 'arthur',
        manual: 'arthur.pdf',
        short_title: 'Arthur',
        storyfile: 'arthur-r74-s890714.z6',
        title: 'Arthur: The Quest for Excalibur',
    },
    {
        blorb: 'Journey.blb',
        id: 'journey',
        manual: 'journey.pdf',
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
        manual: 'zork0.pdf',
        short_title: 'Zork Zero',
        storyfile: 'zork0-r393-s890714.z6',
        title: 'Zork Zero: The Revenge of Megaboz',
    },
    {
        blorb: 'Sherlock.blb',
        id: 'sherlock',
        manual: 'sherlock.pdf',
        short_title: 'Sherlock',
        storyfile: 'sherlock-r26-s880127.z5',
        title: 'Sherlock: The Riddle of the Crown Jewels',
    },
    {
        blorb: 'Lurking.blb',
        id: 'lurkinghorror',
        manual: 'lurking.pdf',
        short_title: 'The Lurking Horror',
        storyfile: 'lurkinghorror-r221-s870918.z3',
        title: 'The Lurking Horror',
    },
]

const template = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>TITLE</title>
    <meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,interactive-widget=resizes-content">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="col">
        <div id="heading">
            <h1>SHORTTITLE</h1>
            MANUAL
            <p><a href="index.html" target="_blank">Other games</a></p>
        </div>
        <div id="inner">
            <div id="game">ARTHURMODES
                <canvas id="canvas" height="800"></canvas>
                <textarea id="textinput" autocapitalize="off" rows="1"></textarea>
            </div>
        </div>
    </div>
    <script>window.files = [
        "STORYFILE", "BLORB", "sfrotz.rc",
        "Roboto-Regular.ttf",
        "Roboto-Bold.ttf",
        "Roboto-Italic.ttf",
        "Roboto-BoldItalic.ttf",
        "RobotoMono-Regular.ttf",
        "RobotoMono-Bold.ttf",
        "RobotoMono-Italic.ttf",
        "RobotoMono-BoldItalic.ttf",
    ]</script>
    <script type="text/javascript" src="interface.js"></script>
    <script async type="text/javascript" src="sfrotz.js"></script>
  </body>
</html>`

const arthurmodes = `
                <div id="arthurmodes">
                    <p data-keycode="112"><span class="arthurfull">Graphics</span><span class="arthurshort">Graph</span></p>
                    <p data-keycode="113">Map</p>
                    <p data-keycode="114"><span class="arthurfull">Inventory</span><span class="arthurshort">Inv</span></p>
                    <p data-keycode="115">Score</p>
                    <p data-keycode="116">Room</p>
                    <p data-keycode="117"><span class="arthurfull">Text only</span><span class="arthurshort">Text</span></p>
                </div>`

for (const story of storyfiles) {
    const html = template
        .replace('ARTHURMODES', story.id === 'arthur' ? arthurmodes : '')
        .replace('BLORB', story.blorb)
        .replace('MANUAL', story.manual ? `<p><a href="${story.manual}" target="_blank">Manual</a></p>` : '')
        .replace('SHORTTITLE', story.short_title)
        .replace('STORYFILE', story.storyfile)
        .replace('TITLE', story.title)
    fs.writeFileSync(`dist/${story.id}.html`, html)
}