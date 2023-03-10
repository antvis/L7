// @ts-ignore
import { RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [113.270854, 23.141717],
        zoom: 5,
        style: 'blank',
        pitch: 60,
      }),
    });

    const url1 =
      'https://tiles{1-3}.geovisearth.com/base/v1/vec/{z}/{x}/{y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';

    const layer1 = new RasterLayer({
      zIndex: 1,
    }).source(url1, {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        zoomOffset: 0,
      },
    });

    scene.on('loaded', () => {
      scene.addLayer(layer1);
      setTimeout(() => {
        layer1.setData(
          'https://tiles{1-3}.geovisearth.com/base/v1/ter/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788',
        );
        console.log('update');
      }, 2000);
    });
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '60vh',
        position: 'relative',
      }}
    />
  );
};
