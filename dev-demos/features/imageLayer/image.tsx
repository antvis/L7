import { ImageLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      pickBufferScale: 1.0,
      map: new GaodeMap({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'normal',
        zoom: 10,
      }),
    });

    const layer = new ImageLayer({});
    layer.source(
      //   'https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg',
      // 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*0TVXSbkyKvsAAAAAAAAAAAAAARQnAQ',
      'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*4k6vT6rUsk4AAAAAAAAAAAAAARQnAQ',
      {
        parser: {
          type: 'image',
          extent: [121.168, 30.2828, 121.384, 30.4219],
        },
      },
    );

    scene.on('loaded', () => {
      scene.addLayer(layer);
    });
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
