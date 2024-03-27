import { LayerSwitch, PointLayer, Scale, Scene, Zoom } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [121.4316962, 31.26082325],
    zoom: 15.056,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
    .then((res) => res.json())
    .then((data) => {
      const pointLayer = new PointLayer({})
        .source(data, {
          parser: {
            type: 'json',
            x: 'longitude',
            y: 'latitude',
          },
        })
        .shape('circle')
        .size('unit_price', [5, 25])
        .color('name', ['#49B5AD', '#5B8FF9'])
        .style({
          opacity: 0.3,
          strokeWidth: 1,
        });

      scene.addLayer(pointLayer);
    });

  const layerSwitch = new LayerSwitch({
    position: 'rightcenter',
  });
  scene.addControl(layerSwitch);

  const zoomControl = new Zoom({
    position: 'rightcenter',
  });

  const scaleControl = new Scale({
    position: 'bottomright',
  });
  scene.addControl(zoomControl);
  scene.addControl(scaleControl);
});
