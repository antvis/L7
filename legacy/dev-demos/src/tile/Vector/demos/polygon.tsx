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
        center: [112, 30],
        zoom: 0,
      }),
    });
    const maskData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [125.15625000000001, 8.407168163601076],
                  [116.54296874999999, -21.289374355860424],
                  [156.26953125, -20.632784250388013],
                  [150.29296875, 2.1088986592431382],
                ],
              ],
              [
                [
                  [78.57421875, 46.92025531537451],
                  [51.67968749999999, 37.020098201368114],
                  [87.890625, 28.76765910569123],
                ],
              ],
            ],
          },
        },
      ],
    };

    const polygonLayer = new PolygonLayer({visible:true}).source(maskData).shape('fill').color('#f00').style({opacity:0.3});

    const layer = new PolygonLayer({
      maskLayers: [polygonLayer],
      featureId: 'COLOR',
      sourceLayer: 'ecoregions2', // woods hillshade contour ecoregions ecoregions2 city
    });
    layer
      .source(
        'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
        {
          parser: {
            type: 'mvt',
            tileSize: 256,
            maxZoom: 9,
            extent: [-180, -85.051129, 179, 85.051129],
          },
        },
      )
      // .shape('line')
      .color('COLOR')
      // .active(true)
      .size(10)
      .select(true)

      .style({
        opacity: 0.5
      });

    const point = new PointLayer({ zIndex: 1 })
      .source(
        [
          {
            lng: 120,
            lat: 30,
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        },
      )
      .shape('circle')
      .size(40)
      .active(true)
      .color('#f00');

    scene.on('loaded', () => {
      scene.addLayer(layer);
      scene.addLayer(polygonLayer);

      setTimeout(() => {
        point.setData([
          {
            lng: 123,
            lat: 30,
          },
        ]);

        point.color('#ff0');
        scene.render();
        console.log('update');
      }, 3000);
      // layer.on('inited', () => {
      //   console.log(
      //     'layer.getLayerConfig().enableHighlight',
      //     layer.getLayerConfig().enableHighlight,
      //   );
      // });

      layer.on('click', (e) => {
        console.log('click');
        console.log(e);
      });

      scene.addLayer(point);
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
