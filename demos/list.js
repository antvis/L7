process.env.DEBUG = 'app:*';
const path = require('path');
const extname = path.extname;
const basename = path.basename;
const join = path.join;
const fs = require('fs');
const statSync = fs.statSync;
const lstatSync = fs.lstatSync;
const readdirSync = fs.readdirSync;
const readFileSync = fs.readFileSync;
const mkdirSync = fs.mkdirSync;
const nunjucks = require('nunjucks');
const renderString = nunjucks.renderString;

function isFile(source) {
  return lstatSync(source).isFile();
}

function getFiles(source) {
  return readdirSync(source).map(function(name) {
    return join(source, name);
  }).filter(isFile);
}

const screenshotsPath = join(process.cwd(), './demos/assets/screenshots');
try {
  statSync(screenshotsPath);
} catch (e) {
  mkdirSync(screenshotsPath);
}
const demoFiles = getFiles(__dirname)
  .filter(filename => {
    const bn = basename(filename, '.html');
    return extname(filename) === '.html' && bn !== 'index';
  })
  .map(filename => {
    const bn = basename(filename, '.html');
    const file = {
      screenshot: `/datavis/L7/demos/assets/screenshots/${bn}.png`,
      basename: bn,
      content: readFileSync(filename),
      filename
    };
    return file;
  });
const template = readFileSync(join(__dirname, './index.njk'), 'utf8');
const html = renderString(template, {
  demoFiles
});
fs.writeFileSync(join(__dirname, 'index.html'), html);
