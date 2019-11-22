import isElectron from './is-electron';
export default function isBrowser() {
  const isNode = typeof process === 'object' && String(process) === '[object process]' && !process.browser;
  return !isNode || isElectron();
}
export function isBrowserMainThread() {
  return isBrowser() && typeof document !== 'undefined';
}
//# sourceMappingURL=is-browser.js.map