 
  // @ts-ignore
import { Scene, PolygonLayer, PointLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
     
      map: new Map({
        center: [119.586579, 39.942531],
        zoom: 8,
        minZoom: 7,
        maxZoom: 18,
      }),
    });

    const layer = new PolygonLayer({
      featureId: 'id',
      sourceLayer: 'qhd_bianhua_jiance',// woods hillshade contour ecoregions ecoregions2 city
    });
    const url =
  '//114.116.251.141:2183/geoserver/gwc/service/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&LAYER=ellip:qhd_bianhua_jiance&STYLE=&TILEMATRIX=EPSG:3857:{z}&TILEMATRIXSET=EPSG:3857&FORMAT=application/vnd.mapbox-vector-tile&TILECOL={x}&TILEROW={y}';

    layer
      .source(
        url,
        {
          parser: {
            type: 'mvt',
            tileSize: 256,
            extent: [-180, -85.051129, 179, 85.051129],
          },
        },
      )
      .shape('fill')
      .color('red')
      // .active(true)
      .select(true)

      .style({
        // opacity: 0.3
      });

  

    scene.on('loaded', () => {
      scene.addLayer(layer);
      console.log(layer)

      
      // layer.on('inited', () => {
      //   console.log(
      //     'layer.getLayerConfig().enableHighlight',
      //     layer.getLayerConfig().enableHighlight,
      //   );
      // });

      layer.on('click', (e) => {
        console.log(e);
      });

    });
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '60vh',
        position: 'relative',
      }}
    />
  );
};
