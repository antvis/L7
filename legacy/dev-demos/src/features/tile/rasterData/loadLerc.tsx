//@ts-ignore
import { RasterLayer, Scene } from '@antv/l7';
//@ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import * as Lerc from 'lerc';

export default () => {

  useEffect(() => {
    const scene = new Scene({
      id: 'lerc',
      map: new Map({
        center: [120, 30],
        style: 'blank',
        zoom: 3
      }),
    });

    scene.on('loaded', () => {
      const layer = new RasterLayer();
      layer
        .source(
          'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/{z}/{y}/{x}',
          {
            parser: {
              type: 'rasterTile',
              dataType: 'arraybuffer',
              tileSize: 256,
              format: async (data: any) => {
                const image = Lerc.decode(data);
                return {
                  rasterData: image.pixels[0],
                  width: image.width,
                  height: image.height,
                };
              },
            },
          },
        )
        .style({
          domain: [0, 1024],
          rampColors: {
            colors: [ '#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858' ],
            positions: [ 0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.0 ],
          },
        })
        .select(true);

      scene.addLayer(layer);
    });

  
    return () => {
      scene.destroy();
    };
  }, []);

  return (
    <div
      id="lerc"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
