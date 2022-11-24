window.onLoad  = function(err){ 
  console.log('完成',err)
}
var url = 'https://webapi.amap.com/maps?v=2.0&key=ff533602d57df6f8ab3b0fea226ae52f&callback=onLoad';
var jsapi = document.createElement('script');
jsapi.charset = 'utf-8';
jsapi.src = url;
document.head.appendChild(jsapi);
// const scene = new Scene({
//   id: 'map',
//   map: new GaodeMapV2({
//     style: 'dark',
//     version:'2.1.0',
//     center: [ 112, 23.69 ],
//     zoom: 2.5
//   })
// });
// scene.on('loaded', () => {
//   fetch(
//     'https://gw.alipayobjects.com/os/basement_prod/9078fd36-ce8d-4ee2-91bc-605db8315fdf.csv'
//   )
//     .then(res => res.text())
//     .then(data => {
//       const pointLayer = new PointLayer({})
//         .source(data, {
//           parser: {
//             type: 'csv',
//             x: 'Longitude',
//             y: 'Latitude'
//           }
//         })
//         .shape('circle')
//         .active(true)
//         .animate(true)
//         .size(56)
//         .color('#4cfd47');

//       scene.addLayer(pointLayer);
//     });
// });
