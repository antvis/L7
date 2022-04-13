import {
  AMapScene,
  AMapSceneV2,
  LayerContext,
  LayerEvent,
  LineLayer,
  MapboxScene,
  Marker,
  PolygonLayer,
  Popup,
  SceneContext,
  SceneEvent,
} from '@antv/l7-react';
import * as React from 'react';

export default React.memo(function Map() {
  const [data, setData] = React.useState();
  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://gw.alipayobjects.com/os/basement_prod/32e1f3ab-8588-46cb-8a47-75afb692117d.json',
      );
      const raw = await response.json();
      setData(raw);
    };
    fetchData();
  }, []);
  const popupClick = (e: any) => {
    console.log(e);
    // e.stopPropagation();
    alert('11333');
  };

  const markerClick = (e: any) => {
    console.log(e);
    // e.stopPropagation();
    alert('marker');
  };
  return (
    <>
      <AMapSceneV2
        map={{
          center: [110.19382669582967, 50.258134],
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
        {/* <Popup
          option={{
            closeOnClick: false,
            stopPropagation: false,
          }}
          lnglat={[115, 30.25] as number[]}
        >
          <p onClick={popupClick}>122224</p>
        </Popup> */}
        <Marker lnglat={[100.1938, 27.25] as number[]}>
          <div
            style={{
              border: '1px solid #fff',
              background: '#FFF',
              fontSize: '24px',
              width: '50px',
              height: '150px',
            }}
            // onClick={markerClick}
            onTouchStart={markerClick}
          >
            1
          </div>
        </Marker>
        <PolygonLayer
          key={'2'}
          source={{
            data,
          }}
          size={{
            values: 1,
          }}
          color={{
            field: 'name',
            values: [
              '#2E8AE6',
              '#69D1AB',
              '#DAF291',
              '#FFD591',
              '#FF7A45',
              '#CF1D49',
            ],
          }}
          shape={{
            values: 'fill',
          }}
          style={{
            opacity: 1,
          }}
        >
          <LayerEvent
            type="click"
            handler={(e) => {
              console.log('LayerEvent', e);
            }}
          />
        </PolygonLayer>
      </AMapSceneV2>
    </>
  );
});
