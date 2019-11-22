"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPreviewEntry = createPreviewEntry;

async function createPreviewEntry(options) {
  const {
    configDir,
    presets
  } = options;
  const entries = [require.resolve('../common/polyfills'), require.resolve('./globals')];
  const configs = await presets.apply('config', [], options);

  if (!configs || !configs.length) {
    throw new Error(`=> Create a storybook config file in "${configDir}/config.{ext}".`);
  }

  entries.push(...configs);
  return entries;
}