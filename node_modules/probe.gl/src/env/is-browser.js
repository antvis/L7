// This function is needed in initialization stages,
// make sure it can be imported in isolation
/* global process */

import isElectron from './is-electron';

export default function isBrowser() {
  // Check if in browser by duck-typing Node context
  const isNode =
    typeof process === 'object' && String(process) === '[object process]' && !process.browser;

  return !isNode || isElectron();
}

// document does not exist on worker thread
export function isBrowserMainThread() {
  return isBrowser() && typeof document !== 'undefined';
}
