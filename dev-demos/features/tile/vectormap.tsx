// @ts-ignore
import { Scene, LineLayer, Source, PolygonLayer, PointLayer } from '@antv/l7';
// @ts-ignore
import { Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      stencil: true,
      map: new Mapbox({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'blank',
        zoom: 7,
      }),
    });

    const url =
      'https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token=';
    const token =
      'pk.eyJ1IjoiMTg5Njk5NDg2MTkiLCJhIjoiY2s5OXVzdHlzMDVneDNscDVjdzVmeXl0dyJ9.81SQ5qaJS0xExYLbDZAGpQ';
    const source = new Source(url + token, {
      parser: {
        type: 'mvt',
        tileSize: 256,
        zoomOffset: 0,
        maxZoom: 9,
        extent: [-180, -85.051129, 179, 85.051129],
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
     * landuse
     * waterway
     */

    scene.on('loaded', () => {

      const admin = new LineLayer({
        sourceLayer: 'admin',
      })
      .source(source)
      .shape('simple')
      .color('#f00')
      scene.addLayer(admin);

      const road = new LineLayer({
        sourceLayer: 'road'
      })
      .source(source)
      .shape('simple')
      .color('#FFA500')
      scene.addLayer(road);

      const waterway = new LineLayer({
        sourceLayer: 'waterway'
      })
      .source(source)
      .shape('simple')
      .color('#87CEFA')
      scene.addLayer(waterway);

      const landuse = new PolygonLayer({
        sourceLayer: 'landuse'
      })
      .source(source)
      .color('#90EE90')
      scene.addLayer(landuse);

      const planeLabel = new PointLayer({
        sourceLayer: 'place_label',
        zIndex: 1
      })
      .source(source)
      .shape('name', 'text')
      .color('#000')
      .size(8)
      scene.addLayer(planeLabel);

      const marineLabel = new PointLayer({
        sourceColor: 'marine_label',
        zIndex: 1
      })
      .source(source)
      .shape('name', 'text')
      .color('#0ff')
      .size(15)
      scene.addLayer(marineLabel)

      const countryLabel = new PointLayer({
        sourceLayer: 'country_label',
        zIndex: 2
      })
      .source(source)
      .shape('name', 'text')
      .color('#f00')
      .size(15)
      scene.addLayer(countryLabel);

      const water = new PolygonLayer({
        sourceLayer: 'water',
      })
      .source(source)
      .color('#87CEFA');
      scene.addLayer(water);
      

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
