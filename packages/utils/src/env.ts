export function isImageBitmap(image: any): image is ImageBitmap {
  return typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap;
}

export function isWorker(): boolean {
  // @ts-ignore
  return typeof importScripts === 'function';
}

// Ensure that we're sending the correct referrer from blob URL worker bundles.
// For files loaded from the local file system, `location.origin` will be set
// to the string(!) "null" (Firefox), or "file://" (Chrome, Safari, Edge, IE),
// and we will set an empty referrer. Otherwise, we're using the document's URL.
/* global self */
export const getReferrer = isWorker()
  ? () => (self as any).worker && (self as any).worker.referrer
  : () =>
      (window.location.protocol === 'blob:' ? window.parent : window).location
        .href;
