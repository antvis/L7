import { createFilter } from 'rollup-pluginutils';

export default function inlineWorker(include) {
  const filter = createFilter(include);
  return {
    name: 'inline-worker',
    transform(code, id) {
      if (!filter(id)) return;

      return {
        code: `export default ${JSON.stringify(code)};`,
        map: { mappings: '' },
      };
    },
  };
}
