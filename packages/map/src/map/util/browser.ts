import { createAbortError } from './abort_error';

const now =
  typeof performance !== 'undefined' && performance && performance.now
    ? performance.now.bind(performance)
    : Date.now.bind(Date);

let reducedMotionQuery: MediaQueryList;

/** */
export const browser = {
  /**
   * Provides a function that outputs milliseconds: either performance.now()
   * or a fallback to Date.now()
   */
  now,

  frameAsync(abortController: AbortController): Promise<number> {
    return new Promise((resolve, reject) => {
      const frame = requestAnimationFrame(resolve);
      abortController.signal.addEventListener('abort', () => {
        cancelAnimationFrame(frame);
        reject(createAbortError());
      });
    });
  },

  get prefersReducedMotion(): boolean {
    // In case your test crashes when checking matchMedia, call setMatchMedia from 'src/util/test/util'
    if (!window.matchMedia) return false;
    //Lazily initialize media query
    if (reducedMotionQuery == null) {
      reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    }
    return reducedMotionQuery.matches;
  },
};
