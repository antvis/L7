// @ts-ignore
import { Scene, Source, PolygonLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'geojsonvt',
     
      map: new Map({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'blank',
        zoom: 4,
      }),
    });

    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/2b7aae6e-5f40-437f-8047-100e9a0d2808.json',
    )
      .then((d) => d.json())
      .then((data) => {
        const source = new Source(data, {
          parser: {
            type: 'geojsonvt',
            tileSize: 256,
            zoomOffset: 0,
            maxZoom: 9,
            // extent: [-180, -85.051129, 179, 85.051129],
          },
        });

        const polygon = new PolygonLayer({
          featureId: 'COLOR',
        })
          .source(source)
          .color('COLOR')
          .shape('fill')
          // .active(true)
          .select(true)
          .style({
            opacity: 1,
          });
        scene.addLayer(polygon);
        polygon.on('mousemove',(e)=>{
          console.log(e)
        })
      });
  }, []);
  return (
    <div
      id="geojsonvt"
      style={{
        height: '60vh',
        position: 'relative',
      }}
    />
  );
};
