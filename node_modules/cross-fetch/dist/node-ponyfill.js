var realFetch = require('node-fetch');

var fetch = function (url, options) {
  // Support schemaless URIs on the server for parity with the browser.
  // Ex: //github.com/ -> https://github.com/
  if (/^\/\//.test(url)) {
    url = 'https:' + url;
  }
  return realFetch.call(this, url, options);
};

fetch.fetch = fetch;
fetch.Response = realFetch.Response,
fetch.Headers = realFetch.Headers,
fetch.Request = realFetch.Request,
fetch.polyfill = false;

module.exports = fetch;
