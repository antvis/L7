import { AMapScene, Control } from '@antv/l7-react';
import * as React from 'react';
import ReactDOM from 'react-dom';

const World = React.memo(function Map() {
  const data = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [111.9287109375, 28.22697003891834],
              [115.6640625, 28.22697003891834],
              [115.6640625, 31.015278981711266],
              [111.9287109375, 31.015278981711266],
              [111.9287109375, 28.22697003891834],
            ],
          ],
        },
      },
    ],
  };
  return (
    <AMapScene
      map={{
        center: [0.19382669582967, 50.258134],
        pitch: 0,
        style: 'dark',
        zoom: 6,
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Control type="zoom" position="topleft" />
      <Control type="scale" position="bottomleft" />
    </AMapScene>
  );
});

ReactDOM.render(<World />, document.getElementById('map'));
