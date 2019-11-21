export default function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}
//# sourceMappingURL=assert.js.map