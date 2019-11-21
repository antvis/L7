// node >= 8
// babel 6 plugin
const { join } = require('path');
const { existsSync } = require('fs');
const babelTemplate = require('babel-template');
const cssImport = require('./css-import-visitor');
const postcss = require('./postcss');

// read package name from package.json for annotation comments in <style> blocks
let packageName;
const packageFile = join(process.cwd(), 'package.json');
if (existsSync(packageFile)) {
  packageName = require(packageFile).name;
}

const jsStringToAst = jsString => babelTemplate(jsString)({});

const putStyleIntoHeadAst = ({ code }) => {
  return jsStringToAst(`require('load-styles')(\`${ code }\`)`);
}

module.exports = function() {
  return {
    manipulateOptions(options) {
      return options;
    },

    visitor: {
      ImportDeclaration: {
        exit: cssImport(({ src, css, babelData }) => {
          const { code } = postcss.process(css, src);
          babelData.replaceWith(putStyleIntoHeadAst({
            code: packageName ?
              `/* ${packageName} */\n${code}` :
              code
          }));
        }),
      },
    }
  };
};
