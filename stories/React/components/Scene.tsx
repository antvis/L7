import { GaodeMap, Mapbox } from '@antv/l7-maps';
import { LineLayer, Scene } from '@antv/l7-react';
import * as React from 'react';

export default React.memo(function Map() {
  // @ts-ignore
  const amap = new GaodeMap({
    center: [110.19382669582967, 50.258134],
    pitch: 0,
    style: 'dark',
    zoom: 3,
  });
  const [data, setData] = React.useState();
  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://gw.alipayobjects.com/os/basement_prod/32e1f3ab-8588-46cb-8a47-75afb692117d.json',
      );
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, []);
  return (
    <>
      <Scene
        map={amap}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {data && (
          <LineLayer
            key={'2'}
            source={{
              data,
            }}
            size={{
              value: 1,
            }}
            color={{
              value: '#fff',
            }}
            shape={{
              value: 'line',
            }}
            style={{
              opacity: 1,
            }}
          />
        )}
      </Scene>
      />
    </>
  );
});
