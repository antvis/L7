
export default function getRegExp(prefix) {
  var prefixArray = Array.isArray(prefix) ? prefix : [prefix];
  var prefixToken = prefixArray.join('').replace(/(\$|\^)/g, '\\$1');

  if (prefixArray.length > 1) {
    prefixToken = '[' + prefixToken + ']';
  }

  return new RegExp('(\\s|^)(' + prefixToken + ')[^\\s]*', 'g');
}