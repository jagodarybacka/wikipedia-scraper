const { JSDOM } = require('jsdom');
const readdirp = require('readdirp');

function parse() {
  readdirp({
    root: './wiki',
    fileFilter: (file) => file.path.split('/').slice(-3, -2)[0] === 'pages'
  })
  .on('data', (entry) => {
    console.log(entry.path)
  })
}

(async () => {
  parse()
})()
