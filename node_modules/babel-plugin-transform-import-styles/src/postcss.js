const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

function printWarnings(lazyResult) {
  if (lazyResult.error) {
    console.error(lazyResult.error)
  }
  // https://github.com/postcss/postcss/blob/master/docs/api.md#lazywarnings
  lazyResult.warnings().forEach(message => console.warn(message.text));
}

const browsers = ["last 2 versions", "ie >= 11", "safari >= 7", "Firefox ESR"];

module.exports = {
  process(css, src) {
    const runner = postcss([autoprefixer({ browsers })]);
    const lazyResult = runner.process(css, { map: false, from: src });
    printWarnings(lazyResult);
    return { code: lazyResult.css };
  },
};
