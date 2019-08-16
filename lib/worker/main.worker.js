"use strict";

(void 0).addEventListener('message', function (e) {
  var res = e.data; // res = {
  //   command : 'POLYGON-EXTRUDE',
  //   data : {data:geojson,options:{}}
  // }

  var result;

  switch (res.command) {
    case 'geojson':
      result = res;
      self.postMessage(result);
      break;

    default:
      self.postMessage(result);
      break;
  }
});
(void 0).addEventListener('error', function (e) {
  console.error('filename:' + e.filename + '\nmessage:' + e.message + '\nline:' + e.lineno);
});