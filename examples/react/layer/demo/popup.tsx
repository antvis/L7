import {
  AMapScene,
  LayerEvent,
  LineLayer,
  MapboxScene,
  PolygonLayer,
  Popup,
} from '@antv/l7-react';
import * as React from 'react';
import ReactDOM from 'react-dom';

const World = React.memo(function Map() {
  const [popupInfo, setPopInfo] = React.useState();
  const hoverHandle = (e) => {
    console.log(e);
    setPopInfo(e);
  };
  const hoverOutHandle = () => {
    setPopInfo(undefined);
  };
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
        center: [111.9287109375, 28.22697003891834],
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
      {data && [
        <PolygonLayer
          key={'2'}
          options={{
            autoFit: false,
          }}
          source={{
            data,
          }}
          color={{
            values: '#2E8AE6',
          }}
          shape={{
            values: 'fill',
          }}
          style={{
            opacity: 0.5,
          }}
        >
          <LayerEvent type="mousemove" handler={hoverHandle} />
          <LayerEvent type="mouseout" handler={hoverOutHandle} />
        </PolygonLayer>,
        <LineLayer
          key={'21'}
          source={{
            data,
          }}
          color={{
            values: '#2E8AE6',
          }}
          shape={{
            values: 'line',
          }}
          style={{
            opacity: 1,
          }}
        />,
      ]}
      {popupInfo && (
        <Popup
          key="popup"
          // @ts-ignore
          lnglat={popupInfo.lngLat}
          option={{ closeButton: false, offsets: [0, 10] }}
        >
          <span>这是个信息框</span>
        </Popup>
      )}
    </AMapScene>
  );
});

ReactDOM.render(<World />, document.getElementById('map'));
