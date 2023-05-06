// @ts-ignore
import { Scene, RasterLayer, MaskLayer,Source,PolygonLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
     
      map: new Map({
        center: [116.39852, 39.918255],
        zoom: 9,
      }),
    });

    const source = new Source(
        'https://gridwise.alibaba-inc.com/tile/test?z={z}&x={x}&y={y}',
        {
          parser: {
            type: 'mvt',
            tileSize: 256,
          },
        },
      );
  
      const fillLayer = new PolygonLayer({
        featureId: 'space_id',
        zIndex: 3,
        visible: false,
        sourceLayer: 'default', // woods hillshade contour ecoregions ecoregions2 city
      })
        .source(source)
        .shape('fill')
        .scale('space_val', {
          type: 'quantize',
          domain: [0, 100],
        })
        .color('space_val', [
          '#f2f0f7',
          '#cbc9e2',
          '#9e9ac8',
          '#756bb1',
          '#54278f',
        ])
        .style({
          opacity: 0.1,
        });

 

    const layer = new RasterLayer({
      zIndex: 2,
      maskLayers:[fillLayer],
      enableMask: true,
    }).source(
      'https://tiles{1-3}.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788',
      {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
        },
      },
    ).style({
      opacity:1
    });

    scene.on('loaded', () => {
   
      scene.addLayer(layer);
      scene.addLayer(fillLayer);
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
