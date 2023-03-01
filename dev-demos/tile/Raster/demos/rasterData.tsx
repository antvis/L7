
import { RasterLayer, Scene, Source, TileDebugLayer, LineLayer, PolygonLayer } from '@antv/l7';

import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import * as GeoTIFF from 'geotiff';
// https://gee-community-catalog.org/projects/esrilc2020/
const colorList = [
  '#419bdf', // Water

  '#358221', // Tree

  '#88b053', // Grass


  '#7a87c6', // vegetation


  '#e49635', // Crops


  '#dfc35a', // shrub


  '#ED022A', // Built Area


  '#EDE9E4', // Bare ground
 

  '#F2FAFF', // Snow

  '#C8C8C8', // Clouds
];
const positions = [
  1,2,3,4,5,6,7,8,9,10,11,
];
export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
     
      map: new Map({
        center: [115, 27],
        zoom: 9,
      }),
    });

    scene.on('loaded', () => {
      const offset = 0.25;

      const tileDebug = new TileDebugLayer();
      scene.addLayer(tileDebug);
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/fccd80c0-2611-49f9-9a9f-e2a4dd12226f.json',
      )
        .then((res) => res.json())
        .then((maskData) => {
          const p = new PolygonLayer({
            visible:false
          })
          .source(maskData)
          .shape('fill')
          .color('blue')
          scene.addLayer(p)
          const layer = new RasterLayer(
            {
              maskLayers: [p],
            }
          );

          const tileSource = new Source(
            'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff',
            {
              parser: {
                type: 'rasterTile',
                dataType: 'arraybuffer',
                tileSize: 256,
                maxZoom: 13.1,
                format: async (data) => {
                  const tiff = await GeoTIFF.fromArrayBuffer(data);
                  const image = await tiff.getImage();
                  const width = image.getWidth();
                  const height = image.getHeight();
                  const values = await image.readRasters();
                  // console.log(values)
                  return { rasterData: values[0], width, height };
                },
              },
            },
          );

          layer.source(tileSource).style({
            // domain: [0, 255],
            opacity: 0.5,
            clampLow: false,
            rampColors: {
              type:"cat",
              colors: colorList,
              positions,
              
            },
          });

          scene.addLayer(layer);

          const offset = 0.25;
          const points = [
            ...[115 - offset, 27 + offset],
            ...[115 + offset, 27 + offset],
            ...[115 + offset, 27 - offset],
          ]

          setTimeout(() => {
            // console.log('rasterLayer boxSelect');
            // layer.boxSelect([115 - offset, 27 - offset, 115 + offset, 27 + offset], (e) => {
            //   console.log('boxSelect', e);
            // })
            layer.pickData(points)
            // layer.pickData([115 - offset, 27 - offset, 115 + offset, 27 + offset])
            .then(res => {
              console.log(JSON.stringify(res[1].filterData))
              // console.log(JSON.stringify(res[0].data))
              // console.log(res)
            })
            
          }, 2200)

          
          const line = new LineLayer()
          .source({
            "type": "FeatureCollection",
            "features": [
              {
                "type": "Feature",
                "properties": {
                  "name": "tom"
                },
                "geometry": {
                  "type": "Polygon",
                  "coordinates": [
                    [
                      [115 - offset, 27 + offset],
                      [115 + offset, 27 + offset],
                      [115 + offset, 27 - offset],
                      [115 - offset, 27 - offset],
                      [115 - offset, 27 + offset],
                    ]
                  ]
                }
              }
            ]
          })
          .size(2)
          .shape('line')
          .color('#f00')
            scene.addLayer(line);

            // 114.75, 27.059126, 115.25, 27.25
            const polygon = new PolygonLayer()
            .source({
              "type": "FeatureCollection",
              "features": [
                {
                  "type": "Feature",
                  "properties": {
                    "name": "tom"
                  },
                  "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                      [
                        [114.75, 27.25],
                        [115.25, 27.25],
                        [115.25, 27.059126],
                        [114.75, 27.059126],
                        [114.75, 27.059126],
                      ]
                    ]
                  }
                }
              ]
            })
            .shape('fill')
            .color('#00f')
            .style({
              opacity: 0.2,
            })
            scene.addLayer(polygon);

          // setTimeout(() => {
          //   layer.style({
          //     opacity: 0.5,
          //     // rampColors: {
          //     //   // colors: colorList,
          //     //   // positions,
          //     //   colors: ['#f00', '#f00'],
          //     //   positions: [0, 1]
          //     // },
          //   })
          //   scene.render();
          //   console.log('***')
          // }, 2000)

          // layer.on('click', (e) => {
          //   console.log('layer click');
          //   console.log(e);
          // })
        });
    });

    return () => {
      scene.destroy();
    };
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
