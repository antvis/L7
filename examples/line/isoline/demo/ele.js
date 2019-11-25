import { Scene, LineLayer } from '@antv/l7';
const scene = new Scene({
  id: 'map',
  pitch: 53.6305,
  type: 'amap',
  style: 'light',
  center: [ 102.600579, 23.114887 ],
  zoom: 14.66
});

fetch('https://gw.alipayobjects.com/os/rmsportal/ZVfOvhVCzwBkISNsuKCc.json')
  .then(res => res.json())
  .then(data => {
    const layer = new LineLayer({})
      .source(data)
      .size('ELEV', h => {
        return [ h % 50 === 0 ? 1.0 : 0.5, (h - 1300) * 20 ];
      })
      .shape('line')
      .scale('ELEV', {
        type: 'quantize'
      })
      .color(
        'ELEV',
        [
          '#E4682F',
          '#FF8752',
          '#FFA783',
          '#FFBEA8',
          '#FFDCD6',
          '#EEF3FF',
          '#C8D7F5',
          '#A5C1FC',
          '#7FA7F9',
          '#5F8AE5'
        ].reverse()
      );
    scene.addLayer(layer);
  });
