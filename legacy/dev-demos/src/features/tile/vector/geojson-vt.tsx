// @ts-ignore
import { Scene, Source, PolygonLayer } from '@antv/l7';
// @ts-ignore
import { Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'geojsonvt',
     
      map: new Mapbox({
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

        // const line = new LineLayer({
        //   featureId: 'COLOR',
        //   sourceLayer: 'testName', // woods hillshade contour ecoregions ecoregions2 city
        // }).source(source)
        // .color('COLOR')
        // .size(2)
        // scene.addLayer(line);

        const polygon = new PolygonLayer({
          featureId: 'COLOR',
          // sourceLayer: 'testName', // woods hillshade contour ecoregions ecoregions2 city
        })
          .source(source)
          .color('COLOR')
          // .active(true)
          .select(true)
          .style({
            opacity: 0.6,
          });
        scene.addLayer(polygon);

        // scene.on('zoom', (e) => console.log(scene.getZoom()));

        // const point = new PointLayer({
        //   featureId: 'COLOR',
        //   sourceLayer: 'testName', // woods hillshade contour ecoregions ecoregions2 city
        // })
        // .source(source)
        // // .color('COLOR')
        // .color('#f00')
        // .size(20)
        // scene.addLayer(point);
      });
  }, []);
  return (
    <div
      id="geojsonvt"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
