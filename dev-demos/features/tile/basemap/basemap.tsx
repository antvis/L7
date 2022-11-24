// @ts-ignore
import {
  Scene,
  LineLayer,
  Source,
  PolygonLayer,
  PointLayer,
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
        center: [121.268, 29],
        // zoom: 12,
        // zoom: 7,
        zoom: 6,
      }),
    });

    const url =
      'https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token=';
    const token =
      // 'pk.eyJ1IjoiMTg5Njk5NDg2MTkiLCJhIjoiY2s5OXVzdHlzMDVneDNscDVjdzVmeXl0dyJ9.81SQ5qaJS0xExYLbDZAGpQ';
      // 'pk.eyJ1IjoiMTg5Njk5NDg2MTkiLCJhIjoiY2w3dHk3dnN4MDYzaDNycDkyMDl2bzh6NiJ9.YIrG9kwUpayLj01f6W23Gw';
      'pk.eyJ1IjoiMTg5Njk5NDg2MTkiLCJhIjoiY2w4bXNyeHgzMGl0cjNvbXlmeHFjeDBwZCJ9.05W7JfyT6BVkpu12dYL58w';
    const source = new Source(url + token, {
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
      const admin = new LineLayer({
        sourceLayer: 'admin',
        usage: 'basemap',
      })
        .source(source)
        .shape('simple')
        .color('#696969');

      scene.addLayer(admin);

      const road = new LineLayer({
        sourceLayer: 'road',
        usage: 'basemap',
      })
        .source(source)
        .shape('simple')
        .color('#FFA500');
      scene.addLayer(road);

      const poiLabel = new PointLayer({
        sourceLayer: 'poi_label',
        usage: 'basemap',
        zIndex: 1,
      })
        .source(source)
        .shape('name', 'text')
        .color('#333')
        .size(10);
      scene.addLayer(poiLabel);

      const landuse_overlay = new PolygonLayer({
        sourceLayer: 'landuse_overlay',
        usage: 'basemap',
      })
        .source(source)
        .color('#f00');
      scene.addLayer(landuse_overlay);

      // const waterway = new LineLayer({
      //   sourceLayer: 'waterway',
      //   usage: 'basemap',
      // })
      //   .source(source)
      //   .shape('simple')
      //   // .color('#87CEFA');
      //   .color('#f00');
      // scene.addLayer(waterway);

      const tunnel = new LineLayer({
        sourceLayer: 'tunnel',
        usage: 'basemap',
      })
        .source(source)
        .shape('simple')
        // .color('#A9A9A9');
        .color('#f00');
      scene.addLayer(tunnel);

      const landuse = new PolygonLayer({
        sourceLayer: 'landuse',
        usage: 'basemap',
      })
        .source(source)
        .color('#90EE90');
      scene.addLayer(landuse);

      const state_label = new PointLayer({
        sourceLayer: 'state_label',
        zIndex: 1,
        usage: 'basemap',
      })
        .source(source)
        .shape('name', 'text')
        .color('#000')
        .size(12);
      scene.addLayer(state_label);

      // const placeLabel = new PointLayer({
      //   sourceLayer: 'place_label',
      //   zIndex: 1,
      //   usage: 'basemap',
      // })
      //   .source(source)
      //   .shape('name', 'text')
      //   .color('#000')
      //   .size(8);
      // scene.addLayer(placeLabel);

      const marineLabel = new PointLayer({
        sourceColor: 'marine_label',
        zIndex: 1,
        usage: 'basemap',
      })
        .source(source)
        .shape('name', 'text')
        .color('#0ff')
        .size(15);
      scene.addLayer(marineLabel);

      const countryLabel = new PointLayer({
        sourceLayer: 'country_label',
        zIndex: 2,
        usage: 'basemap',
      })
        .source(source)
        .shape('name', 'text')
        .color('#f00')
        .size(15);
      scene.addLayer(countryLabel);

      const water = new PolygonLayer({
        sourceLayer: 'water',
        usage: 'basemap',
      })
        .source(source)
        .color('#87CEFA');
      scene.addLayer(water);

      const debugerLayer = new TileDebugLayer({ usage: 'basemap' });
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
