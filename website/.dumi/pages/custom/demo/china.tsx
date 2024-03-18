// https://unpkg.com/xinzhengqu@1.0.0/data/2023_xian.pbf

// @ts-ignore
import { LineLayer, Scene } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import { useEffect } from 'react';

export default () => {
  // @ts-ignore
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [121.4, 31.258134],
        zoom: 2,
        pitch: 0,
        maxZoom: 4,
        style: 'normal',
        doubleClickZoom: false,
      }),
    });

    const fetchData = () => {
      fetch(
        'https://mdn.alipayobjects.com/afts/file/A*zMVuS7mKBI4AAAAAAAAAAAAADrd2AQ/%E5%85%A8%E5%9B%BD%E8%BE%B9%E7%95%8C.json',
      )
        .then((response) => response.json())
        .then((data) => {
          const line = new LineLayer({})
            .source(data)
            .size(1)
            .shape('line')
            .color('type', [
              '#e41a1c',
              '#ff7f00',
              '#4daf4a',
              '#377eb8',
              '#984ea3',
              '#377eb8',
            ])
            .scale('type', {
              type: 'cat',
              domain: [
                'haishangshengjie',
                'xianggangjie',
                'haianxian',
                'guojiexian',
              ],
            })
            .style({ opacity: 1.0 });

          scene.addLayer(line);
        });
    };
    fetchData();
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
