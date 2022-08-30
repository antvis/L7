// @ts-ignore
import { Scene, LineLayer, Source, PolygonLayer } from '@antv/l7';
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
        zoom: 4,
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

    const layer = new LineLayer({
      sourceLayer: 'water', // woods hillshade contour ecoregions ecoregions2 city
    })
      .source(source)
      .shape('simple')
      .color('#f00')
      .size(1);

    // const planeLabel = new PointLayer()
    // .source(source)

    const water = new PolygonLayer({
      sourceLayer: 'water', // woods hillshade contour ecoregions ecoregions2 city
    })
      .source(source)
      .shape('fill')
      .color('#0ff');

    scene.on('loaded', () => {
      scene.addLayer(layer);
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
