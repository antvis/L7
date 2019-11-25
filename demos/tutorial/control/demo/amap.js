import { PointLayer, Scale, Scene, Layers, Zoom } from '@antv/l7';
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'amap',
  style: 'dark',
  center: [121.40, 31.258134],
  zoom: 14,
});

fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
  .then((res) => res.json())
  .then((data) => {
    const pointLayer =
      new PointLayer({
      })
        .source(data, {
          parser: {
            type: 'json',
            x: 'longitude',
            y: 'latitude'
          }
        }).shape('circle')
        .size('unit_price', [5, 25])
        .color('name',['#49B5AD', "#5B8FF9"])
        .style({
          opacity: 0.3,
          strokeWidth: 1,
        })

      scene.addLayer(pointLayer);
      var overlayers = {
        "围栏填充": pointLayer,
      };
      var baseLayers = {
        "基础地图": pointLayer,
      };
      const layersControl = new Layers({
        overlayers: overlayers,
      });
      
      scene.addControl(layersControl);

  });




  const zoomControl = new Zoom();
  const scaleControl = new Scale({
    position:"bottomright"
  });

  scene.addControl(zoomControl);
  scene.addControl(scaleControl);
 
