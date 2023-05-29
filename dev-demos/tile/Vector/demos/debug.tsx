// @ts-ignore
import { Scene, TileDebugLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
     
      map: new Map({
        center: [120, 30],
        // zoom: 12,
        zoom: 12,
      }),
    });

    scene.addImage(
      'marker',
      'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*BJ6cTpDcuLcAAAAAAAAAAABkARQnAQ'
    ).then(()=>{
      console.log(1111)
    })

    const debugerLayer = new TileDebugLayer();
    scene.addLayer(debugerLayer);
  }, []);
  return (
    <div
      id="map"
      style={{
        backgroundColor: 'rgba(175,200,253)',
        height: '60vh',
        position: 'relative',
      }}
    />
  );
};
