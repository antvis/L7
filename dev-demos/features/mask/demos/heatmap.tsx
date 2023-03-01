// @ts-ignore
import { Scene, HeatmapLayer, PolygonLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
     
      map: new GaodeMap({
        center: [120.165, 30.26],
        pitch: 0,
        zoom: 2,
        style: 'dark',
      }),
    });
    scene.addImage(
      '00',
      'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
    );
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

   
    scene.on('loaded', () => {
      
      
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const polygonLayer = new PolygonLayer({visible:true}).source(maskData).shape('fill').color('#f00').style({opacity:0.4});
          const heatmapLayer = new HeatmapLayer({
            maskLayers: [polygonLayer],
            mask:false,

          })
            .source(data)
            .shape('heatmap') // heatmap3D heatmap
            .size('mag', [0, 1.0]) // weight映射通道
            .style({
              intensity: 2,
              radius: 20,
              opacity: 1.0,
              rampColors: {
                colors: [
                  '#FF4818',
                  '#F7B74A',
                  '#FFF598',
                  '#91EABC',
                  '#2EA9A1',
                  '#206C7C',
                ].reverse(),
                positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
              },
            });
            scene.addLayer(polygonLayer);
            scene.addLayer(heatmapLayer);

            setTimeout(()=>{
              console.log('add mask');
              // heatmapLayer.addMask(polygonLayer);
              // scene.render();

              console.log('disable mask');
              // heatmapLayer.disableMask();
              // scene.render();
              heatmapLayer.enableMask();
              scene.render();


            },2000)
          
        });
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
