// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// This function is needed in initialization stages,
// make sure it can be imported in isolation

import {window} from './globals';
import isBrowser from './is-browser';
import isElectron from './is-electron';

export function isMobile() {
  return typeof window.orientation !== 'undefined';
}

// Simple browser detection
// `mockUserAgent` parameter allows user agent to be overridden for testing
/* eslint-disable complexity */
export default function getBrowser(mockUserAgent) {
  if (!mockUserAgent && !isBrowser()) {
    return 'Node';
  }

  if (isElectron(mockUserAgent)) {
    return 'Electron';
  }

  /* global navigator */
  const navigator_ = typeof navigator !== 'undefined' ? navigator : {};
  const userAgent = mockUserAgent || navigator_.userAgent || '';
  // const appVersion = navigator_.appVersion || '';

  // NOTE: Order of tests matter, as many agents list Chrome etc.
  if (userAgent.indexOf('Edge') > -1) {
    return 'Edge';
  }
  const isMSIE = userAgent.indexOf('MSIE ') !== -1;
  const isTrident = userAgent.indexOf('Trident/') !== -1;
  if (isMSIE || isTrident) {
    return 'IE';
  }
  if (window.chrome) {
    return 'Chrome';
  }
  if (window.safari) {
    return 'Safari';
  }
  if (window.mozInnerScreenX) {
    return 'Firefox';
  }
  return 'Unknown';
}
