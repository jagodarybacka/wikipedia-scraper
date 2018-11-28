var inquirer = require('inquirer');
const readdirp = require('readdirp');
const fs = require('fs');
const figlet = require('figlet')
const ROOT_DIR = './wiki'

function writeDirectories(path) {
  return new Promise(function(resolve, reject) {
    readdirp({
        root: path,
        depth: 0,
        entryType: 'all'
      })
      .on('data', (entry) => {
        console.log(path + '/' + entry.path)
      })
      .on('end', () => resolve())
  });
}

var questions = [{
  type: 'input',
  name: 'choice',
  message: "Enter directory or file path:"
}];

async function ask(path) {
  if (/.*\.txt/.test(path)) {
    fs.readFile(path, 'utf8', (err, data) => {
      console.log(data)
    })
  } else {
    writeDirectories(path)
      .then((res) => {
        inquirer.prompt(questions)
          .then(answers => {
            ask(answers.choice);
          })
      });
  }
}


(async () => {
  figlet('Wikipedia Scraper!!', function(err, data) {
      if (err) {
          console.log('Something went wrong...');
          console.dir(err);
          return;
      }
      console.log(data)
  });  ask(ROOT_DIR)
})()
