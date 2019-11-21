const { readFileSync } = require('fs');
const { resolve, join } = require('path');
const requireResolve = require('require-resolve');

function errorBoundary(cssFile, cb) {
  try {
    cb();
  } catch (err) {
    console.error(new Error(`babel-plugin-transform-import-styles: ${ cssFile }: ${ err.message }`));
    throw err;
  }
}

/**
 * Visitor for `import '*.css|less'` babel AST-nodes
 */
module.exports = function cssImport(cb) {
  return (babelData, { file, opts = {} }) => {
    const { node } = babelData;
    errorBoundary(node.source.value, () => {
      if (!node.source.value.endsWith('.css') && !node.source.value.endsWith('.less')) {
        return
      }

      const fileData = requireResolve(node.source.value, resolve(file.opts.filename));
      if (!fileData) {
        // if file doesn't exist than requireResolve returns null
        throw new Error(`Cannot resolve "${node.source.value}" in ${file.opts.filename}`);
      }

      const { src } = fileData;

      let css;

      if (node.source.value.endsWith('.less')) {
        // unfortunately babel is completely sync
        // we need to block while we compile .less
        css = require('child_process').execSync(`node ${join(__dirname, 'compile-less.js')} ${src}`);
      } else {
        css = readFileSync(src, 'utf8');
      }

      cb({ babelData, src, css });
    });
  };
}
