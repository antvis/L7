const fs = require('fs');
const Path = require('path');
const dirpath = Path.join(__dirname, '../src/geom/shader/');
// const shaderdir = fs.readdirSync(dirpath);
readDirSync(dirpath);

function readDirSync(path) {
  const pa = fs.readdirSync(path);
  let dir = '../lib/geom/shader/';
  pa.forEach(function(ele) {
    const info = fs.statSync(path + '/' + ele);
    if (info.isDirectory()) {
      dir += (ele + '/');
      readDirSync(path + '/' + ele);
    } else {
      if (Path.extname(path + ele) === '.glsl') {
        if (!fs.existsSync(Path.join(__dirname, dir + '/'))) {
          fs.mkdirSync(Path.join(__dirname, dir + '/'));
        }
        const newpath = Path.join(__dirname, dir + '/' + ele + '.js');
        const shaderContent = fs.readFileSync(path + '/' + ele).toString();
        const res = `export default /* glsl */\` \n${shaderContent};\``;
        fs.writeFileSync(newpath, res);

      }

    }
  });
}

