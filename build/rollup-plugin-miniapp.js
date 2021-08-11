import inject from '@rollup/plugin-inject';
import modify from '@rollup/plugin-modify';

const module = '@oasis-engine/miniprogram-adapter ';

function register(name) {
  return [module, name];
}

function resolveFile(filePath) {
  return path.join(__dirname, '..', filePath);
}

const adapterArray = [
  'window',
  'atob',
  'devicePixelRatio',
  'document',
  'Element',
  'Event',
  'EventTarget',
  'HTMLCanvasElement',
  'HTMLElement',
  'HTMLMediaElement',
  'HTMLVideoElement',
  'Image',
  'navigator',
  'Node',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'screen',
  'XMLHttpRequest',
  'performance',
];
const adapterVars = {};

adapterArray.forEach((name) => {
  adapterVars[name] = register(name);
});

export default [
  inject(adapterVars),
  modify({
    find: /^@antv\/l7-(.*)/,
    replacement: resolveFile('packages/$1/src'),
  }),
];
