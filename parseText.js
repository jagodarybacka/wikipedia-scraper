const { JSDOM } = require('jsdom');
const fs = require('fs');
const readdirp = require('readdirp');

const ROOT_DIR = './wiki'

function parseHTML(destDir) {
  fs.readFile(`${destDir}/index.txt`, 'utf8', (err, data) => {
    data = data.replace(/<[^>]*>/g, '');
    fs.writeFileSync(`${destDir}/index.txt`, data)
  })
}

function parse() {
  readdirp({
    root: ROOT_DIR
  })
  .on('data', (entry) => {
    console.log('Parsing HTML from: ', entry.parentDir)
    const path = `${entry.fullParentDir}`
    parseHTML(path)
  })
}

(async () => {
  parse()
})()
