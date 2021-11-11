// @ts-nocheck
// tslint:disable
import EventTarget from './EventTarget';

declare let my: any;
const _requestHeader = new Map();
const _responseHeader = new Map();
const _requestTask = new Map();
const contentTypes = {
  json: 'application/json',
  text: 'application/text',
  arraybuffer: 'application/octet-stream',
};

function _triggerEvent(type, event = { target: this }) {
  if (typeof this[`on${type}`] === 'function') {
    this[`on${type}`].call(this, event);
  }
}

function _changeReadyState(readyState, event = { readyState }) {
  this.readyState = readyState;
  _triggerEvent.call(this, 'readystatechange', event);
}

export class $XMLHttpRequest extends EventTarget {
  public static UNSEND: number;
  public static OPENED: number;
  public static HEADERS_RECEIVED: number;
  public static LOADING: number;
  public static DONE: number;
  public onabort: any;
  public onerror: any;
  public onload: any;
  public onloadstart: any;
  public onprogress: any;
  public ontimeout: any;
  public onloadend: any;
  public onreadystatechange: any;
  public readyState: number;
  public response: any;
  public responseText: any;
  public _responseType: string;
  public responseXML: any;
  public status: number;
  public statusText: string;
  public upload: any;
  public withCredentials: boolean;
  public timeout: number;

  public _url: string;
  public _method: string;

  constructor() {
    super();

    this.onabort = null;
    this.onerror = null;
    this.onload = null;
    this.onloadstart = null;
    this.onprogress = null;
    this.ontimeout = null;
    this.onloadend = null;

    this.onreadystatechange = null;
    this.readyState = 0;
    this.response = null;
    this.responseText = null;
    this._responseType = 'text';
    this.responseXML = null;
    this.status = 0;
    this.statusText = '';
    this.upload = {};
    this.withCredentials = false;

    _requestHeader.set('requestHeader', {
      'content-type': 'application/x-www-form-urlencoded',
    });
  }

  set responseType(type: string) {
    this._responseType = type;
  }

  public abort() {
    const myRequestTask = _requestTask.get('requestTask');

    if (myRequestTask) {
      myRequestTask.abort();
    }
  }

  public getAllResponseHeaders() {
    const responseHeader = _responseHeader.get('responseHeader');

    return Object.keys(responseHeader)
      .map((header) => {
        return `${header}: ${responseHeader[header]}`;
      })
      .join('\n');
  }

  public getResponseHeader(header) {
    return _responseHeader.get('responseHeader')[header];
  }

  public open(method, url /* GET/POST*/, flag) {
    this._method = method;
    this._url = url;
    // _changeReadyState.call(this, XMLHttpRequest.OPENED);
  }

  public overrideMimeType() {}

  public send($data = '') {
    // if (this.readyState !== XMLHttpRequest.OPENED) {
    //   throw new Error(
    //     "Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.",
    //   );
    // } else {
    //   const url = this._url;
    //   const header = _requestHeader.get('requestHeader');
    //   const responseType = this._responseType;

    //   if (contentTypes[responseType]) {
    //     header['content-type'] = contentTypes[responseType];
    //   }

    //   delete this.response;
    //   this.response = null;

    //   const onSuccess = ({ data, status, headers }) => {
    //     // status = status === undefined ? 200 : status;

    //     // try {
    //     //   if (
    //     //     data == null ||
    //     //     (data instanceof ArrayBuffer && data.byteLength == 0)
    //     //   ) {
    //     //     status = 404;
    //     //   }
    //     // } catch (e) {}

    //     // this.status = status;
    //     // if (headers) {
    //     //   _responseHeader.set('responseHeader', headers);
    //     // }
    //     // _triggerEvent.call(this, 'loadstart');
    //     // // _changeReadyState.call(this, XMLHttpRequest.HEADERS_RECEIVED);
    //     // // _changeReadyState.call(this, XMLHttpRequest.LOADING);

    //     // this.response = data;

    //     // if (data instanceof ArrayBuffer) {
    //     //   // TODO temporary solution, fix native gc error.
    //     //   this.response = data.slice(0);
    //     //   Object.defineProperty(this, 'responseText', {
    //     //     enumerable: true,
    //     //     configurable: true,
    //     //     get() {
    //     //       throw new Error(
    //     //         'InvalidStateError : responseType is ' + this._responseType,
    //     //       );
    //     //     },
    //     //   });
    //     // } else {
    //     //   this.responseText = data;
    //     // }
    //     // _changeReadyState.call(this, XMLHttpRequest.DONE);
    //     // _triggerEvent.call(this, 'load');
    //     // _triggerEvent.call(this, 'loadend');
    //   };

    //   const onFail = (e) => {
    //     const errMsg = e.message || e.errorMessage;
    //     // TODO 规范错误
    //     if (!errMsg) {
    //       return;
    //     }
    //     if (errMsg.indexOf('abort') !== -1) {
    //       _triggerEvent.call(this, 'abort', {
    //         message: errMsg + this._url,
    //       });
    //     } else {
    //       _triggerEvent.call(this, 'error', {
    //         message: errMsg + this._url,
    //       });
    //     }
    //     _triggerEvent.call(this, 'loadend');
    //   };

    //   const requestTask = my.request({
    //     $data,
    //     url,
    //     method: this._method,
    //     timeout: this.timeout ? this.timeout : 30000,
    //     headers: header,
    //     dataType: responseType,
    //     success: onSuccess,
    //     fail: onFail,
    //   });
    //   _requestTask.set('requestTask', requestTask);
    // }
  }

  public setRequestHeader(header, value) {
    const myHeader = _requestHeader.get('requestHeader');

    myHeader[header] = value;
    _requestHeader.set('requestHeader', myHeader);
  }

  public addEventListener(type, listener) {
    if (typeof listener !== 'function') {
      return;
    }

    this['on' + type] = (event: any = {}) => {
      event.target = event.target || this;
      listener.call(this, event);
    };
  }

  public removeEventListener(type, listener) {
    if (this['on' + type] === listener) {
      this['on' + type] = null;
    }
  }
}

// TODO 没法模拟 HEADERS_RECEIVED 和 LOADING 两个状态
$XMLHttpRequest.UNSEND = 0;
$XMLHttpRequest.OPENED = 1;
$XMLHttpRequest.HEADERS_RECEIVED = 2;
$XMLHttpRequest.LOADING = 3;
$XMLHttpRequest.DONE = 4;
