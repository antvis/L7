const postcss = require('postcss');
const colors = require('./data.json');

/**
 * PostCSS plugin that replaces specific football club names for colors
 */
module.exports = postcss.plugin('fpf-color', options => {
    return function(css) {
        options = options || {};

        // Processing code will be added here
        // Go through rules and declarations
        css.walkRules(function (rule) {
            rule.walkDecls(function (decl, i) {
              for (let color of Object.keys(colors)) {
                decl.value = decl.value.replace(new RegExp(`(^|\\s+|\\()${color}(\\s*|\\))`,"g"), `$1${colors[color]}$2`);
              }
            });
        });
    }
});
