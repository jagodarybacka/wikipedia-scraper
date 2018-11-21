const scraper = require('website-scraper');

function scrapeWebsite(url, destDir) {
  const options = {
    urls: [url],
    directory: destDir,
    sources: []
  }

  scraper(options)
    .catch(err => {
      console.log(err)
    })
}


scrapeWebsite('https://pl.wikipedia.org/wiki/Grodzisko_(archeologia)', './wiki')
