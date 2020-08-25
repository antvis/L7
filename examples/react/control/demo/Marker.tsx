import { AMapScene, Marker } from '@antv/l7-react';
import * as React from 'react';
import ReactDOM from 'react-dom';
function creatMarkers() {
  const markers = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      markers.push(<Marker key={i + '-' + j} lnglat={[112 + i, 30 + j]} />);
    }
  }
  return markers;
}
const MapScene = React.memo(function Map() {
  return (
    <AMapScene
      map={{
        center: [114, 32],
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
      {creatMarkers()}
    </AMapScene>
  );
});

ReactDOM.render(<MapScene />, document.getElementById('map'));
