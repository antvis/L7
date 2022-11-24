// @ts-ignore
import { Scene, RasterLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
     
      map: new Map({
        center: [113.270854, 23.141717],
        zoom: 11,
      }),
    });

    const url1 =
      'https://t0.tianditu.gov.cn/img_w/wmts?tk=b72aa81ac2b3cae941d1eb213499e15e&';
    const url2 =
      'https://guangdong.tianditu.gov.cn/guangzhou/ServiceAccess/MapService/DJZQ_4490/1e85e146b0728d2fb3a5312c75089400/export?dpi=96&transparent=true&format=png8&bbox={bbox}&bboxSR=4490&imageSR=3857&size=256,256&f=image';
    const url3 =
      'https://guangdong.tianditu.gov.cn/guangzhou/ServiceAccess/MapService/DJQ_4490/1e85e146b0728d2fb3a5312c75089400/export?dpi=96&transparent=true&format=png8&bbox={bbox}&bboxSR=4326&imageSR=3857&size=256%2C256&f=image';
    const url4 =
      'https://guangdong.tianditu.gov.cn/guangzhou/ServiceAccess/MapService/QSLY_4490/1e85e146b0728d2fb3a5312c75089400/export?dpi=96&transparent=true&format=png8&bbox={bbox}&bboxSR=4326&imageSR=3857&size=256%2C256&f=image';
    const layer1 = new RasterLayer({
      zIndex: 1,
    }).source(url1, {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        wmtsOptions: {
          layer: 'img',
          tileMatrixset: 'w',
          format: 'tiles',
        },
      },
    });

    const layer2 = new RasterLayer({
      zIndex: 1,
    }).source(url2, {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        zoomOffset: 0,
      },
    });

    const layer3 = new RasterLayer({
      zIndex: 1,
    }).source(url3, {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        zoomOffset: 0,
      },
    });

    const layer4 = new RasterLayer({
      zIndex: 1,
    }).source(url4, {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        zoomOffset: 0,
      },
    });

    scene.on('loaded', () => {
      scene.addLayer(layer1);
      scene.addLayer(layer2);
      scene.addLayer(layer3);
      scene.addLayer(layer4);
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
