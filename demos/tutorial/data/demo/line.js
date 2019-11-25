import { LineLayer, Scene } from '@antv/l7';
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'mapbox',
  style: 'light',
  center: [102.602992, 23.107329],
  zoom: 13,
});

fetch('https://gw.alipayobjects.com/os/rmsportal/ZVfOvhVCzwBkISNsuKCc.json')
  .then((res) => res.json())
  .then((data) => {
    const layer =
      new LineLayer({
      })
        .source(data)
        .size(1)
        .shape('line')
        .color(
          'ELEV',
          [
            '#E8FCFF',
            '#CFF6FF',
            '#A1E9ff',
            '#65CEF7',
            '#3CB1F0',
            '#2894E0',
            '#1772c2',
            '#105CB3',
            '#0D408C',
            '#002466',
          ].reverse(),
        )
    scene.addLayer(layer);
    console.log(layer);

  });
