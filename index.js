const scraper = require('website-scraper');
const { JSDOM } = require('jsdom');

const WIKI = 'https://pl.wikipedia.org/'
const INIT_CATEGORY = 'https://pl.wikipedia.org/wiki/Kategoria:Staro%C5%BCytni_matematycy'
const DEST_DIR = './wiki'

function scrapeWebsite(url, destDir) {
  console.log('Scraping: ', url)
  const options = {
    urls: [url],
    directory: destDir,
    sources: []
  }

  return scraper(options)
    .catch(err => {
      console.log(err)
    })
}

function getPagesLinksFromCategory(destDir, title='index.html') {
  return JSDOM.fromFile(`${destDir}/${title}`)
    .then(dom => {
      let pages = dom.window.document.querySelector('#mw-pages');
      if (pages) {
        let links = pages.querySelectorAll('a')
        linksList = Array.prototype.map.call(links, (node) => ({
          link: node.href.replace(/file:\/\/\//, WIKI),
          title: node.title
        }))
      }

      return linksList;
    })
}

function getCategoriesLinksFromCategory(destDir) {
  return JSDOM.fromFile(`${destDir}/index.html`)
    .then(dom => {
      const nodeList = dom.window.document.querySelectorAll('.CategoryTreeItem')
      const linksList = Array.prototype.map.call(nodeList, (node) => ({
        link: node.querySelector('a').href.replace(/file:\/\/\//, WIKI),
        title: node.querySelector('a').innerHTML
      }))
      return linksList;
    })
}

function scrapeCategory(category, destDir) {
  return scrapeWebsite(category, destDir)
    .then(async () => {
      const pages =  await getPagesLinksFromCategory(destDir);
      const categories =  await getCategoriesLinksFromCategory(destDir);
      return {
        pages,
        categories
      }
    })
    .then(({pages, categories}) => {
      pages && pages.forEach(({link, title}) => scrapeWebsite(link, `${destDir}/pages/${title}`))
      categories && categories.forEach(({link, title}) => scrapeCategory(link, `${destDir}/categories/${title}`))
    })
    .catch(err => {
      console.log(err)
      return;
    })
}

(async () => {
  const categoryLink = process.argv[2] || INIT_CATEGORY
  scrapeCategory(categoryLink, DEST_DIR)
})()
