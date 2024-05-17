import { PointLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'light',
      center: [120.100535, 30.041909],
      zoom: 14.83,
    }),
  });

  fetch(
    'https://mdn.alipayobjects.com/afts/file/A*bcirT44OXmcAAAAAAAAAAAAADrd2AQ/new-housing-data-in-jzh.json',
  )
    .then((res) => res.json())
    .then((data) => {
      const layer = new PointLayer({
        autoFit: false,
      })
        .source(data, {
          parser: {
            type: 'json',
            x: '经度',
            y: '纬度',
          },
        })
        .scale('均价(元/平米)', { type: 'quantile' })
        .shape('circle')
        .active(false)
        .size('参考总价(万元)', [8, 16])
        .color('均价(元/平米)', ['#ffffcc', '#d9f0a3', '#addd8e', '#78c679', '#31a354', '#006837'])
        .style({
          opacity: 0.8,
        });

      const highlightStrokeLayer = new PointLayer({
        autoFit: false,
      })
        .source([], {
          parser: {
            type: 'json',
            x: '经度',
            y: '纬度',
          },
        })
        .shape('circle')
        .size(16)
        .color('red')
        .style({
          opacity: 0,
          stroke: 'yellow',
          strokeOpacity: 1,
          strokeWidth: 2,
        });

      layer.once('inited', () => {
        layer.fitBounds({ animate: false });
      });

      scene.addLayer(layer);
      scene.addLayer(highlightStrokeLayer);

      layer.on('mousemove', (event: any) => {
        const { feature, featureId } = event;
        const data = [feature];

        const encodedData = layer.getEncodedData();
        const encodedFeature = encodedData.find((item) => item.id === featureId);
        const featureSize = encodedFeature?.size as number;
        highlightStrokeLayer.setData(data);
        highlightStrokeLayer.size(featureSize);
      });
      layer.on('mouseout', (event: any) => {
        highlightStrokeLayer.setData([]);
      });
    });
}
