import { AMapScene, LoadImage, PointLayer } from '@antv/l7-react';
import * as React from 'react';
import ReactDOM from 'react-dom';

const World = React.memo(function Map() {
  const [data, setData] = React.useState();
  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
      );
      const data = await response.json();



      setData(data);
    };
    fetchData();
  }, []);
  return (
    <AMapScene
      map={{
        center: [0.19382669582967, 50.258134],
        pitch: 0,
        style: 'light',
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
      <LoadImage name="00" url="https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg"/>
      <LoadImage name="01" url="https://gw.alipayobjects.com/zos/basement_prod/30580bc9-506f-4438-8c1a-744e082054ec.svg"/>
      <LoadImage name="02" url="https://gw.alipayobjects.com/zos/basement_prod/7aa1f460-9f9f-499f-afdf-13424aa26bbf.svg"/>
      {data && (
        <PointLayer
          key={'2'}
          options={{
            autoFit: true,
          }}
         
          source={{
            data,
             // @ts-ignore
            parser: {
              type: 'json',
              x: 'longitude',
              y: 'latitude',
            } 
          }}
          shape={{
            field: 'name',
            values: ['00', '01', '02'],
          }}
          size={{
            values: 20,
          }}
          style={{
            opacity: 1,
          }}
        />
      )}
    </AMapScene>
  );
});

ReactDOM.render(<World />, document.getElementById('map'));
