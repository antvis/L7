import { AMapScene, Control } from '@antv/l7-react';
import * as React from 'react';
import ReactDOM from 'react-dom';
const MapScene = React.memo(function Map() {
  return (
    <AMapScene
      map={{
        center: [110.19382669582967, 30.258134],
        pitch: 0,
        style: 'dark',
        zoom: 1,
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Control type="scale" />
      <Control type="zoom" />
    </AMapScene>
  );
});

ReactDOM.render(<MapScene />, document.getElementById('map'));
