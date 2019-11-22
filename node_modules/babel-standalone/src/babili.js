import {
  registerPlugins,
  registerPreset,
  transform as babelTransform,
} from 'babel-standalone';

registerPlugins({
  'minify-constant-folding': require('babel-plugin-minify-constant-folding'),
  'minify-dead-code-elimination': require('babel-plugin-minify-dead-code-elimination'),
  'minify-empty-function': require('babel-plugin-minify-empty-function'),
  'minify-flip-comparisons': require('babel-plugin-minify-flip-comparisons'),
  'minify-guarded-expressions': require('babel-plugin-minify-guarded-expressions'),
  'minify-infinity': require('babel-plugin-minify-infinity'),
  'minify-mangle-names': require('babel-plugin-minify-mangle-names'),
  'minify-replace': require('babel-plugin-minify-replace'),
  'minify-simplify': require('babel-plugin-minify-simplify'),
  'minify-type-constructors': require('babel-plugin-minify-type-constructors'),
  'transform-inline-environment-variables': require('babel-plugin-transform-inline-environment-variables'),
  'transform-member-expression-literals': require('babel-plugin-transform-member-expression-literals'),
  'transform-merge-sibling-variables': require('babel-plugin-transform-merge-sibling-variables'),
  'transform-minify-booleans': require('babel-plugin-transform-minify-booleans'),
  'transform-node-env-inline': require('babel-plugin-transform-node-env-inline'),
  'transform-property-literals': require('babel-plugin-transform-property-literals'),
  'transform-remove-console': require('babel-plugin-transform-remove-console'),
  'transform-remove-debugger': require('babel-plugin-transform-remove-debugger'),
  'transform-simplify-comparison-operators': require('babel-plugin-transform-simplify-comparison-operators'),
  'transform-undefined-to-void': require('babel-plugin-transform-undefined-to-void'),
});
registerPreset('babili', require('babel-preset-babili'));

export function transform(code, options = {}) {
  return babelTransform(code, {
    ...options,
    presets: [
      ...(options.presets || []),
      'babili',
    ]
  });
}

export const version = VERSION;
