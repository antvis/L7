const extrude = require('geometry-extrude');
// import { geoJsonSourceWorker } from './geojsonSourceWorker';
/**
 * workerOption
 * {
 *  type:
 *  data:
 *
 * }
 */
self.addEventListener('message', e => {
  const res = e.data;
  // res = {
  //   command : 'POLYGON-EXTRUDE',
  //   data : {data:geojson,options:{}}
  // }
  let result;
  switch (res.command) {
    case 'geojson':
      result = extrude.extrudeGeoJSON(res.data.data, res.data.options).polygon;
      self.postMessage(result, [ result.indices.buffer, result.normal.buffer, result.position.buffer, result.uv.buffer ]);
      break;
    case 'POLYLINE-EXTRUDE':
      result = extrude.extrudeGeoJSON(res.data.data, res.data.options).polyline;
      self.postMessage(result, [ result.indices.buffer, result.normal.buffer, result.position.buffer, result.uv.buffer ]);
      break;
    default:
      self.postMessage(result);
      break;
  }
});
self.addEventListener('error', function(e) {
  console.error('filename:' + e.filename + '\nmessage:' + e.message + '\nline:' + e.lineno);
});
