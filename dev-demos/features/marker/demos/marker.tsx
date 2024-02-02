// @ts-ignore
import { Popup,PointLayer, Marker,Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap, Mapbox,TencentMap} from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
    useEffect( () => {
      const scene = new Scene({
  id: 'map',
  map: new TencentMap({
    style: 'normal',
    center: [ 120.104446,30.261081 ],
    zoom: 19.056
  })
});
scene.on('loaded', () => {
// 创建默认 marker
  const popup = new Popup({
    offsets: [ 0, 20 ]
  }).setText('Hello World 1024');

  const marker = new Marker()
    .setLnglat([ 120.1047383116185,30.261127905299425 ])
    .setPopup(popup);
  const marker1 = new Marker()
  .setLnglat([ 120.1147383116185,30.261127905299425 ])
  .setPopup(popup);
    const pointLayer = new PointLayer({})
    .source([{
        x:120.1047383116185,
        y:120.1047383116185
    }
    ],{
        parser: {
            type: 'json',
            x: 'x',
            y: 'y',
        },
    })
    .shape('circle')
    .size(5)
    .color('red')
    .style({
        opacity: 1,
        strokeWidth: 0,
        stroke: '#fff',
    });
    scene.on('click',(e)=>{
        console.log(e);
    })
scene.addLayer(pointLayer);
  scene.addMarker(marker);
  scene.addMarker(marker1);
  marker.togglePopup();
  marker1.togglePopup();
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
