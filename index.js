const scraper = require('website-scraper');
const { JSDOM } = require('jsdom');

const WIKI = 'https://pl.wikipedia.org/'
const INIT_CATEGORY = 'https://pl.wikipedia.org/wiki/Kategoria:Kosmiczny_Teleskop_Hubble%E2%80%99a'
// const INIT_CATEGORY = 'https://pl.wikipedia.org/wiki/Kategoria:Misje_serwisowe_do_Kosmicznego_Teleskopu_Hubble%E2%80%99a'
const DEST_DIR = './wiki'

function scrapeWebsite(url, destDir) {
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
  return JSDOM.fromFile(`${DEST_DIR}/${title}`)
    .then(dom => {
      const nodeList = dom.window.document.querySelectorAll('.mw-category-group')
      const linksList = Array.prototype.map.call(nodeList, (node) => ({
        link: node.querySelector('a').href.replace(/file:\/\/\//, WIKI),
        title: node.querySelector('a').title
      }))
      return linksList;
    })
}

function getCategoriesLinksFromCategory(destDir) {
  return JSDOM.fromFile(`${DEST_DIR}/index.html`)
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
  console.log(category, destDir)
  return scrapeWebsite(category, destDir)
    .then(async () => {
      return {
        pages: await getPagesLinksFromCategory(destDir),
        categories: await getCategoriesLinksFromCategory(destDir)
      }
    })
}

(async () => {

  const {categories, pages} = await scrapeCategory(INIT_CATEGORY, DEST_DIR);
  pages && pages.forEach(({link, title}) => scrapeWebsite(link, `${DEST_DIR}/pages/${title}`))
  categories && categories.forEach(({link, title}) => scrapeCategory(link, `${DEST_DIR}/categories/${title}`))
})()
