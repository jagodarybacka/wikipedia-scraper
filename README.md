# Wikipedia Scraper - extract articles from Wikipedia category

University project. Made with Node.js

## Install app dependencies

Note: requires Node.js and NPM

```bash
  npm i
```

## Example usage

To see how it works - extract articles from example category

```bash
  ./demo
```

To extract from your category pass category link as first argument (NOTE: you have to link to category not an article!)

```bash
  ./demo https://pl.wikipedia.org/wiki/Kategoria:Staro%C5%BCytni_matematycy
```

To run app in interactive mode and go through category tree

```bash
  ./demo -i https://pl.wikipedia.org/wiki/Kategoria:Staro%C5%BCytni_matematycy
```
