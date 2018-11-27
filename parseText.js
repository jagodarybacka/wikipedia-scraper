const { JSDOM } = require('jsdom');
const fs = require('fs');
const readdirp = require('readdirp');

const ROOT_DIR = './wiki'

function getTextFromHtml(destDir) {
  return JSDOM.fromFile(`${destDir}/index.html`)
    .then(dom => {
      const content = dom.window.document.querySelector('#content');
      const heading = content.querySelector('#firstHeading');
      const paragraphs = content.querySelectorAll('p');

      const headingText = heading.innerHTML;
      const paragraphsText = Array.prototype.map.call(paragraphs, (a) => a.innerHTML).join(' ')
      const text = `${headingText} ${paragraphsText}`
      fs.writeFileSync(`${destDir}/index.txt`, text)
    })
}

function parse() {
  readdirp({
    root: ROOT_DIR,
    fileFilter: (file) => file.path.split('/').slice(-3, -2)[0] === 'pages'
  })
  .on('data', (entry) => {
    const path = `${entry.fullParentDir}`
    console.log(path)
    getTextFromHtml(path)
  })
}

(async () => {
  parse()
})()
