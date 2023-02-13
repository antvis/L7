// @ts-ignore
import { Scene, Source, PolygonLayer, LineLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
     
      map: new GaodeMap({
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
          getCustomData:(tile, cb)=>{
            const url = `https://gridwise.alibaba-inc.com/tile/test?z=${tile.z}&x=${tile.x}&y=${tile.y}`;
            fetch(url).then(res=>res.arrayBuffer()).then((data)=>{
              cb(null,data)
            }
            )
            }
        },
  
      },
    );

    const layer = new PolygonLayer({
      featureId: 'space_id',
      zIndex: 3,
      mask: false,
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
        opacity: 0.8,
      });

    const layer2 = new LineLayer({
      featureId: 'space_id',
      zIndex: 3,
      mask: false,
      sourceLayer: 'default', // woods hillshade contour ecoregions ecoregions2 city
    })
      .source(source)
      .shape('simple')
      .size(0.8)
      .color('#3E6Eff')
      .style({
        opacity: 1,
      });

    scene.on('loaded', () => {
      scene.addLayer(layer);
      scene.addLayer(layer2);

      // const debugerLayer = new TileDebugLayer();
      // scene.addLayer(debugerLayer);
    });
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '100vh',
        position: 'relative',
      }}
    />
  );
};

//
