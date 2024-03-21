import { createFilter } from 'rollup-pluginutils';

// borrow from https://github.com/uber/luma.gl/blob/master/dev-modules/babel-plugin-remove-glsl-comments/index.js#L4-L5
const INLINE_COMMENT_REGEX = /\s*\/\/.*[\n\r]/g;
const BLOCK_COMMENT_REGEX = /\s*\/\*(\*(?!\/)|[^*])*\*\//g;

// 生产环境压缩 GLSL
export default function glsl(include, minify) {
  const filter = createFilter(include);
  return {
    name: 'glsl',
    transform(code, id) {
      if (!filter(id)) return;

      if (minify) {
        code = code
          .trim() // strip whitespace at the start/end
          .replace(/\n+/g, '\n') // collapse multi line breaks
          // remove comments
          .replace(INLINE_COMMENT_REGEX, '\n')
          .replace(BLOCK_COMMENT_REGEX, '')
          .replace(/\n\s+/g, '\n') // strip identation
          // .replace(/\s?([+-\/*=,])\s?/g, '$1') // strip whitespace around operators
          // .replace(/([;\(\),\{\}])\n(?=[^#])/g, '$1'); // strip more line breaks
      }

      return {
        code: `export default ${JSON.stringify(code)};`,
        map: { mappings: '' }
      };
    }
  };
}
