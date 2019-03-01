import Source from '../core//source';
this.addEventListener('message', e => {
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
this.addEventListener('error', function(e) {
  console.error(
    'filename:' + e.filename + '\nmessage:' + e.message + '\nline:' + e.lineno
  );
});
