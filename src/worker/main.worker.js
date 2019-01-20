
self.addEventListener('message', e => {
  const res = e.data;
  // res = {
  //   command : 'POLYGON-EXTRUDE',
  //   data : {data:geojson,options:{}}
  // }
  let result;
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
self.addEventListener('error', function(e) {
  /* eslint-disable */
  console.log('filename:' + e.filename + '\nmessage:' + e.message + '\nline:' + e.lineno);
});
