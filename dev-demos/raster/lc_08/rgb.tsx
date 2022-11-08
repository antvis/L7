// @ts-ignore
import { RasterLayer, Scene, metersToLngLat } from '@antv/l7';
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

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [130.5, 47],
        zoom: 5,
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
        'https://gw.alipayobjects.com/zos/raptor/1667920165972/china.tif';
      const tiffdata = await getTiffData(url1);
      const maskData = await (
        await fetch(
          'https://gw.alipayobjects.com/os/basement_prod/d2e0e930-fd44-4fca-8872-c1037b0fee7b.json',
        )
      ).json();
      const layer = new RasterLayer({
        zIndex: 10,
        mask: true,
        maskfence: maskData,
      });
      layer
        .source(
          [
            {
              data: tiffdata,
              bands: [0, 1, 2],
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
              operation: 'rgb',
              extent: [
                ...metersToLngLat([
                  8182125.2558000003919005,
                  427435.8622000003233552,
                ]),
                ...metersToLngLat([
                  15038832.4410999994724989,
                  7087852.7587999999523163,
                ]),
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
          height: '500px',
          position: 'relative',
        }}
      ></div>
    </>
  );
};
