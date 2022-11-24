import { RasterLayer, Scene, Source,TileDebugLayer } from '@antv/l7';
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import * as GeoTIFF from 'geotiff';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
     
      map: new Map({
        center: [129.54663, 46.42832],
        zoom: 8,
        style: 'dark',
      }),
    });

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/fccd80c0-2611-49f9-9a9f-e2a4dd12226f.json',
      )
        .then((res) => res.json())
        .then((maskData) => {
          const layer = new RasterLayer({
            mask: false,
            maskfence: maskData,
          });
          //https://ganos.oss-cn-hangzhou.aliyuncs.com/tmp/landsat08/LC08/B02/8/220/90.tiff
          const urls = [
            {
              url: 'http://localhost:8080/LC08/B04/{z}/{x}/{y}.tiff',
              bands: [0]
            },
            {
              url: 'http://localhost:8080/LC08/B03/{z}/{x}/{y}.tiff',
              bands: [0]
            },
            {
              url: 'http://localhost:8080/LC08/B02/{z}/{x}/{y}.tiff',
              bands: [0]
            }
          ]

          const tileSource = new Source(
            urls,
            {
              zoomOffset:1,
              parser: {
                type: 'rasterTile',
                dataType: 'rgb',
                tileSize: 256,
                operation: {
                  type:'rgb',
                  // options:{
                  //   RMinMax:[7799,29131],
                  //   GMinMax:[8127,28226],
                  //   BMinMax:[7549,27298],
                  // }
                  
                },
                format: async (data,bands) => {
                  const tiff = await GeoTIFF.fromArrayBuffer(data);
                  const image = await tiff.getImage();
                  const width = image.getWidth();
                  const height = image.getHeight();
                  const values = await image.readRasters();
                  return { 
                    rasterData: values[0], width, height 
                  }
                }
                  
      
              },
              
            },
          );

          layer.source(tileSource).style({});

          scene.addLayer(layer);
          const debugerLayer = new TileDebugLayer();
          scene.addLayer(debugerLayer);

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
