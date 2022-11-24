// @ts-ignore
import {
  Scene,
  Source,
  PolygonLayer,
  TileDebugLayer,
} from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
     
      map: new Map({
        center: [121.268, 30.3628],
        // zoom: 12,
        zoom: 4,
      }),
    });

    const url =
      'https://minedata.cn/service/data/mvt-layer?datasource=merge2&z={z}&x={x}&y={y}&request=GetTile&appKey=ca78282dfff148e3be5390ce027068f5&solu=12612';
       const source = new Source(url, {
      parser: {
        type: 'mvt',
        tileSize: 256,
        // extent: [-180, -85.051129, 179, 85.051129],
      },
    });
    /**
     * admin
     * country_label
     * marine_label
     * place_label
     * state_label
     * water
     * road
     * road_label
     * landuse
     * landuse_overlay
     * waterway
     * tunnel
     */

    scene.on('loaded', () => {
      // 绿地
      const water_surface = new PolygonLayer({
        sourceLayer: 'water_surface',

      })
        .source(source)
        .shape('fill')
        .color('#9fd7fc');
        // const landuse = new PolygonLayer({
        //   sourceLayer: 'Landuse',
  
        // })
        //   .source(source)
        //   .shape('fill')
        //   .color('#f0f2f5')
        //   .style({
        //     opacity: 0.25
        //   });

      scene.addLayer(water_surface);
      // scene.addLayer(landuse);

      // const road = new LineLayer({
      //   sourceLayer: 'road',
      // })
      //   .source(source)
      //   .shape('simple')
      //   .color('#FFA500');
      // scene.addLayer(road);

      // const landuse_overlay = new PolygonLayer({
      //   sourceLayer: 'landuse_overlay',
      // })
      //   .source(source)
      //   .color('#f00');
      // scene.addLayer(landuse_overlay);

      // const waterway = new LineLayer({
      //   sourceLayer: 'waterway',
      // })
      //   .source(source)
      //   .shape('simple')
      //   .color('#87CEFA');
      // scene.addLayer(waterway);

      // const tunnel = new LineLayer({
      //   sourceLayer: 'tunnel',
      // })
      //   .source(source)
      //   .shape('simple')
      //   // .color('#A9A9A9');
      //   .color('#f00');
      // scene.addLayer(tunnel);

      // const landuse = new PolygonLayer({
      //   sourceLayer: 'landuse',
      // })
      //   .source(source)
      //   .color('#90EE90');
      // scene.addLayer(landuse);

      // const state_label = new PointLayer({
      //   sourceLayer: 'state_label',
      //   zIndex: 1,
      // })
      //   .source(source)
      //   .shape('name', 'text')
      //   .color('#000')
      //   .size(10);
      // scene.addLayer(state_label);

      // const placeLabel = new PointLayer({
      //   sourceLayer: 'place_label',
      //   zIndex: 1,
      // })
      //   .source(source)
      //   .shape('name', 'text')
      //   .color('#000')
      //   .size(8);
      // scene.addLayer(placeLabel);

      // const marineLabel = new PointLayer({
      //   sourceColor: 'marine_label',
      //   zIndex: 1,
      // })
      //   .source(source)
      //   .shape('name', 'text')
      //   .color('#0ff')
      //   .size(15);
      // scene.addLayer(marineLabel);

      // const countryLabel = new PointLayer({
      //   sourceLayer: 'country_label',
      //   zIndex: 2,
      // })
      //   .source(source)
      //   .shape('name', 'text')
      //   .color('#f00')
      //   .size(15);
      // scene.addLayer(countryLabel);

      // const water = new PolygonLayer({
      //   sourceLayer: 'water',
      // })
      //   .source(source)
      //   .color('#87CEFA');
      // scene.addLayer(water);

      const debugerLayer = new TileDebugLayer();
      scene.addLayer(debugerLayer);

      // scene.on('zoom', () => {
      //   console.log(scene.getLayers().length)
      // })
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
