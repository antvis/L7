import { SceneConifg } from './config';
export const getProtocolAction = (url: string) =>
  SceneConifg.REGISTERED_PROTOCOLS[url.substring(0, url.indexOf('://'))];

export interface ITileBand {
  url: string;
  bands: number[];
}
export type Cancelable = {
  cancel: () => void;
};

export type RequestParameters = {
  url: string | string[] | ITileBand[];
  headers?: any;
  method?: 'GET' | 'POST' | 'PUT';
  body?: string;
  type?: 'string' | 'json' | 'arrayBuffer';
  credentials?: 'same-origin' | 'include';
  collectResourceTiming?: boolean;
  signal?: AbortSignal;
};

export type ResponseCallback<T> = (
  error?: Error | Error[] | null,
  data?: T | null,
  cacheControl?: string | null,
  expires?: string | null,
  xhr?: any,
) => void;

export class AJAXError extends Error {
  /**
   * The response's HTTP status code.
   */
  public status: number;

  /**
   * The response's HTTP status text.
   */
  public statusText: string;

  /**
   * The request's URL.
   */
  public url: string;

  /**
   * The response's body.
   */
  public body: Blob;

  constructor(status: number, statusText: string, url: string, body: Blob) {
    super(`AJAXError: ${statusText} (${status}): ${url}`);
    this.status = status;
    this.statusText = statusText;
    this.url = url;
    this.body = body;
  }
}

function makeXMLHttpRequest(requestParameters: RequestParameters, callback: ResponseCallback<any>) {
  const xhr = new XMLHttpRequest();

  const url = Array.isArray(requestParameters.url)
    ? requestParameters.url[0]
    : requestParameters.url;
  xhr.open(requestParameters.method || 'GET', url as string, true);
  if (requestParameters.type === 'arrayBuffer') {
    xhr.responseType = 'arraybuffer';
  }
  for (const k in requestParameters.headers) {
    if (requestParameters.headers.hasOwnProperty(k)) {
      xhr.setRequestHeader(k, requestParameters.headers[k]);
    }
  }
  if (requestParameters.type === 'json') {
    xhr.responseType = 'text';
    xhr.setRequestHeader('Accept', 'application/json');
  }
  xhr.withCredentials = requestParameters.credentials === 'include';
  xhr.onerror = () => {
    callback(new Error(xhr.statusText));
  };
  xhr.onload = () => {
    if (((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) && xhr.response !== null) {
      let data: unknown = xhr.response;

      if (requestParameters.type === 'json') {
        // We're manually parsing JSON here to get better error messages.
        try {
          data = JSON.parse(xhr.response);
        } catch (err) {
          return callback(err as Error);
        }
      }
      callback(
        null,
        data,
        xhr.getResponseHeader('Cache-Control'),
        xhr.getResponseHeader('Expires'),
        xhr,
      );
    } else {
      const body = new Blob([xhr.response], {
        type: xhr.getResponseHeader('Content-Type') as string,
      });
      callback(new AJAXError(xhr.status, xhr.statusText, url.toString(), body));
    }
  };
  // @ts-ignore
  xhr.cancel = xhr.abort;
  xhr.send(requestParameters.body);

  return xhr;
}

export interface IXhrRequestResult {
  err?: Error | Error[] | null;
  data?: any | null;
  cacheControl?: string | null;
  expires?: string | null;
  xhr?: any;
}
export function makeXMLHttpRequestPromise(
  requestParameters: RequestParameters,
): Promise<IXhrRequestResult> {
  return new Promise((resolve, reject) => {
    makeXMLHttpRequest(requestParameters, (error, data, cacheControl, expires, xhr) => {
      if (error) {
        reject({
          err: error,
          data: null,
          xhr,
        });
      } else {
        resolve({
          err: null,
          data,
          cacheControl,
          expires,
          xhr,
        });
      }
    });
  });
}

function makeRequest(requestParameters: RequestParameters, callback: ResponseCallback<any>) {
  // TODO: isWorker
  // makeFetchRequest

  return makeXMLHttpRequest(requestParameters, callback);
}

export const getJSON = (requestParameters: RequestParameters, callback: ResponseCallback<any>) => {
  const action = getProtocolAction(requestParameters.url as string) || makeRequest;
  return action({ ...requestParameters, type: 'json' }, callback);
};

export const getArrayBuffer = (
  requestParameters: RequestParameters,
  callback: ResponseCallback<ArrayBuffer>,
) => {
  const action = getProtocolAction(requestParameters.url as string) || makeRequest;
  return action({ ...requestParameters, type: 'arrayBuffer' }, callback);
};

export const postData = (
  requestParameters: RequestParameters,
  callback: ResponseCallback<string>,
) => {
  return makeRequest({ ...requestParameters, method: 'POST' }, callback);
};

export const getData = (
  requestParameters: RequestParameters,
  callback: ResponseCallback<string>,
) => {
  return makeRequest({ ...requestParameters, method: 'GET' }, callback);
};

export function sameOrigin(url: string) {
  const a = window.document.createElement('a');
  a.href = url;
  return (
    a.protocol === window.document.location.protocol && a.host === window.document.location.host
  );
}

const transparentPngUrl =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=';

function arrayBufferToImage(
  data: ArrayBuffer,
  callback: (err?: Error | null, image?: HTMLImageElement | null) => void,
) {
  const img: HTMLImageElement = new window.Image();
  const URL = window.URL || window.webkitURL;
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    callback(null, img);
    URL.revokeObjectURL(img.src);
    // prevent image dataURI memory leak in Safari;
    // but don't free the image immediately because it might be uploaded in the next frame
    // https://github.com/mapbox/mapbox-gl-js/issues/10226
    img.onload = null;
    window.requestAnimationFrame(() => {
      img.src = transparentPngUrl;
    });
  };
  img.onerror = () =>
    callback(
      new Error(
        'Could not load image. Please make sure to use a supported image type such as PNG or JPEG. Note that SVGs are not supported.',
      ),
    );
  const blob: Blob = new Blob([new Uint8Array(data)], { type: 'image/png' });
  img.src = data.byteLength ? URL.createObjectURL(blob) : transparentPngUrl;
}

function arrayBufferToImageBitmap(
  data: ArrayBuffer,
  callback: (err?: Error | null, image?: ImageBitmap | null) => void,
) {
  const blob: Blob = new Blob([new Uint8Array(data)], { type: 'image/png' });
  createImageBitmap(blob)
    .then((imgBitmap) => {
      callback(null, imgBitmap);
    })
    .catch((e) => {
      callback(
        new Error(
          `Could not load image because of ${e.message}. Please make sure to use a supported image type such as PNG or JPEG. Note that SVGs are not supported.`,
        ),
      );
    });
}

export const getImage = (
  requestParameters: RequestParameters,
  callback: ResponseCallback<HTMLImageElement | ImageBitmap | null>,
  transformResponse?: (response: object) => any,
) => {
  // request the image with XHR to work around caching issues
  // see https://github.com/mapbox/mapbox-gl-js/issues/1470
  const optionFunc = (err?: Error | Error[] | null, imgData?: ArrayBuffer | null) => {
    if (err) {
      callback(err);
    } else if (imgData) {
      const imageBitmapSupported = typeof createImageBitmap === 'function';
      const transformImgData = transformResponse ? transformResponse(imgData) : imgData;
      if (imageBitmapSupported) {
        arrayBufferToImageBitmap(transformImgData, callback);
      } else {
        arrayBufferToImage(transformImgData, callback);
      }
    }
  };

  if (requestParameters.type === 'json') {
    return getJSON(requestParameters, optionFunc);
  } else {
    return getArrayBuffer(requestParameters, optionFunc);
  }
};

export const formatImage = (
  imgData: ArrayBuffer,
  callback: ResponseCallback<HTMLImageElement | ImageBitmap | null>,
) => {
  const imageBitmapSupported = typeof createImageBitmap === 'function';
  if (imageBitmapSupported) {
    arrayBufferToImageBitmap(imgData, callback);
  } else {
    arrayBufferToImage(imgData, callback);
  }
};
