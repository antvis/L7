// @ts-ignore
import { Scene, ImageLayer,PolygonLayer } from '@antv/l7';
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
        zoom: 15,
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
                  [120.16021728515624, 30.259660295442085],
                  [120.15987396240234, 30.25313608393673],
                  [120.16605377197266, 30.253729211980726],
                  [120.1658821105957, 30.258474107402265],
                ],
              ],
              [
                [
                  [120.1703453063965, 30.258474107402265],
                  [120.17086029052733, 30.254174055663515],
                  [120.17583847045898, 30.254915457324778],
                  [120.17446517944336, 30.258474107402265],
                ],
              ],
            ],
          },
        },
      ],
    };

    scene.on('loaded', () => {
      const polygonLayer = new PolygonLayer().source(maskData).shape('fill').color('#f00').style({opacity:0.5});
      const layer = new ImageLayer({
        maskLayers:[polygonLayer],
      });
      layer.source(
        'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*4UApTKmeiy4AAAAAAAAAAAAAARQnAQ',
        {
          parser: {
            type: 'image',
            extent: [
              120.14802932739258,
              30.262773970881057,
              120.17669677734374,
              30.25239466884559,
            ],
          },
        },
      );
      scene.addLayer(layer);
      scene.addLayer(polygonLayer);
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
