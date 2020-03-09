import { AMapScene, LineLayer, MapboxScene, PolygonLayer } from '@antv/l7-react';
import * as React from 'react';
import ReactDOM from 'react-dom';

const World = React.memo(function Map() {
  const [ data, setData ] = React.useState();
  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://gw.alipayobjects.com/os/basement_prod/68dc6756-627b-4e9e-a5ba-e834f6ba48f8.json'
      );
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, []);
  return (
    <MapboxScene
      map={{
        center: [ 0.19382669582967, 50.258134 ],
        pitch: 0,
        style: 'blank',
        zoom: 6
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {data && [
        <PolygonLayer
          key={'2'}
          options={{
            autoFit: true
          }}
          source={{
            data
          }}
          color={{
            field: 'name',
            values: [
              '#2E8AE6',
              '#69D1AB',
              '#DAF291',
              '#FFD591',
              '#FF7A45',
              '#CF1D49'
            ]
          }}
          shape={{
            values: 'fill'
          }}
          style={{
            opacity: 1
          }}
          select={{
            option: { color: '#FFD591' }
          }}
        />,
        <LineLayer
          key={'21'}
          source={{
            data
          }}
          color={{
            values: '#fff'
          }}
          shape={{
            values: 'line'
          }}
          style={{
            opacity: 1
          }}
        />
      ]}
    </MapboxScene>
  );
});

ReactDOM.render(<World/>, document.getElementById('map'));
