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
        center: [110, 30],
        // zoom: 12,
        zoom: 5,
      }),
    });
    const worldSource = new Source('http://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
    {
      parser: {
        type: 'mvt',
        tileSize: 256,
        maxZoom: 9,
        extent: [-180, -85.051129, 179, 85.051129],
      },
    })

    // const mask = new MaskLayer({
    //   sourceLayer: 'ecoregions2', // woods hillshade contour ecoregions ecoregions2 city
    // }).source(worldSource
    // );
    const fillLayer = new PolygonLayer({
      zIndex:5,
      visible:true,
      featureId: 'COLOR',
      sourceLayer: 'ecoregions2', // woods hillshade contour ecoregions ecoregions2 city
    }).source(worldSource).shape('fill')
    .color('COLOR')
    .style({
      opacity:0.5
    })

    const layer = new RasterLayer({
      zIndex: 4,
      maskLayers:[fillLayer]
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
      // scene.addLayer(mask);
      scene.addLayer(fillLayer);
   
      scene.addLayer(layer);


     
      fillLayer.on('click', (e) => {
        console.log(e)
      })
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
