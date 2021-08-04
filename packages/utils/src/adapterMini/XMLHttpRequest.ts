import EventTarget from './EventTarget';

declare let my: any;
const requestHeader = new Map();
const responseHeader = new Map();
const requestTask = new Map();

function _triggerEvent(type, event = { target: this }) {
  if (typeof this[`on${type}`] === 'function') {
    this[`on${type}`].call(this, event);
  }
}

function _changeReadyState(readyState, event = { readyState }) {
  this.readyState = readyState;
  _triggerEvent.call(this, 'readystatechange', event);
}

export default class XMLHttpRequest extends EventTarget {
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
  public myresponseType: string;
  public responseXML: any;
  public status: number;
  public statusText: string;
  public upload: any;
  public withCredentials: boolean;

  public myurl: string;
  public mymethod: string;

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
    this.myresponseType = 'text';
    this.responseXML = null;
    this.status = 0;
    this.statusText = '';
    this.upload = {};
    this.withCredentials = false;

    requestHeader.set('requestHeader', {
      'content-type': 'application/x-www-form-urlencoded',
    });
  }

  set responseType(type: string) {
    this.myresponseType = type;
  }

  public abort() {
    const myRequestTask = requestTask.get('requestTask');

    if (myRequestTask) {
      myRequestTask.abort();
    }
  }

  public getAllResponseHeaders() {
    const responseHeader2 = responseHeader.get('responseHeader');

    return Object.keys(responseHeader2)
      .map((header) => {
        return `${header}: ${responseHeader2[header]}`;
      })
      .join('\n');
  }

  public getResponseHeader(header) {
    return responseHeader.get('responseHeader')[header];
  }

  public open(method, url /* GET/POST*/) {
    this.mymethod = method;
    this.myurl = url;
    _changeReadyState.call(this, XMLHttpRequest.OPENED);
  }

  public overrideMimeType() {
    return '';
  }

  public send(data = '') {
    if (this.readyState !== XMLHttpRequest.OPENED) {
      throw new Error(
        "Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.",
      );
    } else {
      const url = this.myurl;
      const header = requestHeader.get('requestHeader');
      const responseType = this.myresponseType;

      let encoding;

      if (responseType === 'arraybuffer') {
        // encoding = 'binary'
      } else {
        encoding = 'utf8';
      }

      delete this.response;
      this.response = null;

      const onSuccess = ({ data: sdata, status, headers }) => {
        status = status === undefined ? 200 : status;
        this.status = status;
        if (headers) {
          responseHeader.set('responseHeader', headers);
        }
        _triggerEvent.call(this, 'loadstart');
        _changeReadyState.call(this, XMLHttpRequest.HEADERS_RECEIVED);
        _changeReadyState.call(this, XMLHttpRequest.LOADING);

        this.response = sdata;

        if (sdata instanceof ArrayBuffer) {
          Object.defineProperty(this, 'responseText', {
            enumerable: true,
            configurable: true,
            get() {
              throw new Error(
                'InvalidStateError : responseType is ' + this.myresponseType,
              );
            },
          });
        } else {
          this.responseText = sdata;
        }
        _changeReadyState.call(this, XMLHttpRequest.DONE);
        _triggerEvent.call(this, 'load');
        _triggerEvent.call(this, 'loadend');
      };

      const onFail = ({ message: errMsg }) => {
        // TODO 规范错误
        if (!errMsg) {
          return;
        }
        if (errMsg.indexOf('abort') !== -1) {
          _triggerEvent.call(this, 'abort');
        } else {
          _triggerEvent.call(this, 'error', {
            message: errMsg,
          });
        }
        _triggerEvent.call(this, 'loadend');
      };

      const requestFailTask = my.request({
        data,
        url,
        method: this.mymethod,
        headers: header,
        dataType: responseType,
        success: onSuccess,
        fail: onFail,
      });
      requestFailTask.set('requestTask', requestTask);
    }
  }

  public setRequestHeader(header, value) {
    const myHeader = requestHeader.get('requestHeader');

    myHeader[header] = value;
    requestHeader.set('requestHeader', myHeader);
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
XMLHttpRequest.UNSEND = 0;
XMLHttpRequest.OPENED = 1;
XMLHttpRequest.HEADERS_RECEIVED = 2;
XMLHttpRequest.LOADING = 3;
XMLHttpRequest.DONE = 4;
