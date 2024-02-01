import { HeatmapLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';

export function MapRender(option: {
    map: string
   renderer: 'regl' | 'device'
}) {

    const scene = new Scene({
        id: 'map',
      renderer: option.renderer,
        map: new allMap[option.map || 'Map']({
            style: 'light',
            center: [121.434765, 31.256735],
            zoom: 14.83
        })
    });
    scene.on('loaded', () => {
        fetch(
          'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
        )
          .then((res) => res.json())
          .then((data) => {
            const layer = new HeatmapLayer({autoFit:true})
              .source(data)
              .shape('heatmap')
              .size('mag', [0, 1.0]) // weight映射通道
              .style({
                intensity: 2,
                radius: 20,
                opacity: 1.0,
                rampColors: {
                  colors: [
                    '#FF4818',
                    '#F7B74A',
                    '#FFF598',
                    '#91EABC',
                    '#2EA9A1',
                    '#206C7C',
                  ].reverse(),
                  positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
                },
              });
            scene.addLayer(layer);
            if (window['screenshot']) {
              window['screenshot']();
            }
          });
      });
}
