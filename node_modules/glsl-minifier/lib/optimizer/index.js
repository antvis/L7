// Emscripten module
const Module = require('./glsl-optimizer-asm');

// Emscripten exported functions
module.exports = Module.cwrap('optimize_glsl', 'string', ['string', 'number', 'number']);
