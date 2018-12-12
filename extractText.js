const { JSDOM } = require('jsdom');
const fs = require('fs');
const readdirp = require('readdirp');

const ROOT_DIR = './wiki'

function getTextFromHtml(destDir) {
  return JSDOM.fromFile(`${destDir}/index.html`)
    .then(dom => {
      debugger;
      const content = dom.window.document
        .querySelector('#content')
        .querySelectorAll('h1, h2, p, li');
      const textArray =  Array.prototype.map.call(content, (node) => node.innerHTML)
      const text = textArray.join(':====:')
      fs.writeFileSync(`${destDir}/index.txt`, text)
    })
}

function extract() {
  readdirp({
    root: ROOT_DIR,
    fileFilter: (file) => file.path.split('/').slice(-3, -2)[0] === 'pages'
  })
  .on('data', (entry) => {
    console.log('Extracting text from: ', entry.parentDir)
    const path = `${entry.fullParentDir}`
    getTextFromHtml(path)
  })
}

(async () => {
  extract()
})()
