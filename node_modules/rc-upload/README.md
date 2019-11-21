# rc-upload
---

React Upload

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/rc-upload.svg?style=flat-square
[npm-url]: http://npmjs.org/package/rc-upload
[download-image]: https://img.shields.io/npm/dm/rc-upload.svg?style=flat-square
[download-url]: https://npmjs.org/package/rc-upload
[travis-image]: https://img.shields.io/travis/react-component/upload.svg?style=flat-square
[travis-url]: https://travis-ci.org/react-component/upload
[coveralls-image]: https://img.shields.io/coveralls/react-component/upload.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/react-component/upload?branch=master

## Development

```
npm install
npm start
```

## Example

http://localhost:8020/examples/

online example: http://react-component.github.io/upload/examples/simple.html


## Feature

* support ie8,ie8+,chrome,firefox,safari

## install

[![rc-upload](https://nodei.co/npm/rc-upload.png)](https://npmjs.org/package/rc-upload)

## Usage

```js
var Upload = require('rc-upload');
var React = require('react');
React.render(<Upload />, container);
```

## API

### props

|name|type|default| description|
|-----|---|--------|----|
|name | string | file| file param post to server |
|style | object | {}| root component inline style |
|className | string | - | root component className |
|disabled | boolean | false | whether disabled |
|component | "div"|"span" | "span"| wrap component name |
|supportServerRender | boolean | false| whether to support server render |
|onReady | function | | only call when supportServerRender is true, upload is rendered completely |
|action| string &#124; function(file): string &#124; Promise&lt;string&gt; | | form action url |
|method | string | post | request method |
|directory| boolean | false | support upload whole directory |
|data| object/function(file) | | other data object to post or a function which returns a data object |
|headers| object | {} | http headers to post, available in modern browsers |
|accept | string | | input accept attribute |
|multiple | boolean | false | only support ie10+|
|onStart | function| | start upload file |
|onError| function| | error callback |
|onSuccess | function | | success callback |
|onProgress | function || progress callback, only for modern browsers|
|beforeUpload| function |null| before upload check, return false or a rejected Promise will stop upload, only for modern browsers|
|customRequest | function | null | provide an override for the default xhr behavior for additional customization|
|withCredentials | boolean | false | ajax upload with cookie send |
|openFileDialogOnClick | boolean | true | useful for drag only upload as it does not trigger on enter key or click event |
|transformFile | function(file): Promise&lt;blob&gt; |  | transform file before request |

#### onError arguments

1. `err`: request error message
2. `response`: request response, not support on iframeUpload
3. `file`: upload file

### onSuccess arguments

1. `result`: response body
2. `file`: upload file
3. `xhr`: xhr header, only for modern browsers which support AJAX upload. since
   2.4.0


### customRequest

Allows for advanced customization by overriding default behavior in AjaxUploader. Provide your own XMLHttpRequest calls to interface with custom backend processes or interact with AWS S3 service through the aws-sdk-js package.

customRequest callback is passed an object with:

* `onProgress: (event: { percent: number }): void`
* `onError: (event: Error, body?: Object): void`
* `onSuccess: (body: Object): void`
* `data: Object`
* `filename: String`
* `file: File`
* `withCredentials: Boolean`
* `action: String`
* `headers: Object`


### methods

abort(file?: File) => void: abort the uploading file


### IE8/9 Note

#### Download Popup Problem

In iframe uploader way, the content-type of response should be `text/plain` or `text/html`. [See more about
Content-Type Negotiation](https://github.com/blueimp/jQuery-File-Upload/wiki/Setup#content-type-negotiation)

What's more, in iframe mode, the response's status should always be `200 OK`, otherwise you might get an `Access is denied` error in IE 8/9.

#### Domain Problem

If the Page set document.domain, then server should output document.domain according to _documentDomain parameter.

```js
var ret = '';
if (postData._documentDomain) {
  ret += '<script>document.domain="'+postData._documentDomain+'";</script>';
}
this.body = ret + '{"url":"xx.jpq"}';
```

## License

rc-upload is released under the MIT license.
