// @ts-ignore
import { RasterLayer, Scene } from '@antv/l7';
import { Select } from 'antd';
import 'antd/es/select/style/index';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import * as GeoTIFF from 'geotiff';

async function getTiffData(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}

// console.log(metersToLngLat([14504979.7235,5917159.8828993]));
// console.log(metersToLngLat([14571644.4264000,5981299.2233999]))
export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [130.5, 47],
        zoom: 10.5,
      }),
    });

    scene.on('loaded', async () => {
      const url2 =
        'https://t0.tianditu.gov.cn/img_w/wmts?tk=b72aa81ac2b3cae941d1eb213499e15e&';

      const layer2 = new RasterLayer({
        zIndex: 1,
      }).source(url2, {
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
      scene.addLayer(layer2);
      const url1 =
        'https://gw.alipayobjects.com/zos/raptor/1667832825992/LC08_3857_clip_2.tif';
      const tiffdata = await getTiffData(url1);

      const layer = new RasterLayer({ zIndex: 10 });
      layer
        .source(
          [
            {
              data: tiffdata,
              bands: [6, 5, 2].map((v) => v - 1),
            },
          ],
          {
            parser: {
              type: 'rasterRgb',
              format: async (data, bands) => {
                const tiff = await GeoTIFF.fromArrayBuffer(data);
                const image1 = await tiff.getImage();
                const value = await image1.readRasters();
                return bands.map((band) => {
                  return {
                    rasterData: value[band],
                    width: value.width,
                    height: value.height,
                  };
                });
              },
              operation: {
                type: 'rgb',
              },
              extent: [
                130.39565357746957, 46.905730725742366, 130.73364094187343,
                47.10217234153133,
              ],
            },
          },
        )
        .style({
          opacity: 1,
        });
      scene.addLayer(layer);
    });
  }, []);

  return (
    <>
      <p>
        <Select
          value={'3,2,1'}
          style={{ width: 120, zIndex: 10 }}
          options={[
            {
              value: '3,2,1',
              label: '真彩色图像',
            },
            {
              value: '4,3,2',
              label: '自然真彩色',
            },
            {
              value: '7,6,4',
              label: '城市',
            },
            {
              value: '5,4,3',
              label: '标准假彩色图像',
            },
            {
              value: '6,5,2',
              label: '农业',
            },
            {
              value: '5,6,2',
              label: '健康植被',
            },
            {
              value: '7,6,5',
              label: '穿透大气层',
            },
            {
              value: '7,5,4',
              label: '短波红外',
            },
            {
              value: '6,5,4',
              label: '植被分析',
            },
          ]}
        />
      </p>
      <div
        id="map"
        style={{
          height: '60vh',
          position: 'relative',
        }}
      ></div>
    </>
  );
};
