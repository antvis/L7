// @ts-ignore
import { Scene, PointLayer } from '@antv/l7';
// @ts-ignore
import { Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';

const list = [
  {
    value: -28.0,
    color1: 'orange',
    province_adcode: '630000',
    province_adName: '青海省',
    province: '青海省',
    nnh: 2,
  },
  {
    value: 29.0,
    color1: 'orange',
    province_adcode: '640000',
    province_adName: '宁夏回族自治区',
    province: '宁夏回族自治区',
    nnh: 3,
  },
  {
    value: 60.0,
    color1: 'orange',
    province_adcode: '650000',
    province_adName: '新疆维吾尔自治区',
    province: '新疆维吾尔自治区',
    nnh: 4,
  },
  {
    value: -31.0,
    color1: 'orange',
    province_adcode: '710000',
    province_adName: '台湾省',
    province: '台湾省',
    nnh: 4,
  },
  {
    value: 80.0,
    color1: 'orange',
    province_adcode: '810000',
    province_adName: '香港特别行政区',
    province: '香港特别行政区',
    nnh: 4,
  },
  {
    value: -33.0,
    color1: 'orange',
    province_adcode: '820000',
    province_adName: '澳门特别行政区',
    province: '澳门特别行政区',
    nnh: 4,
  },
];

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'point',
     
      map: new Mapbox({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'blank',
        zoom: 4,
      }),
    });

    const layer = new PointLayer({
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
            zoomOffset: 0,
            maxZoom: 9,
            extent: [-180, -85.051129, 179, 85.051129],
          },
          transforms: [
            {
              type: 'join',
              sourceField: 'nnh',
              targetField: 'NNH', // data 对应字段名 绑定到的地理数据
              data: list,
            },
          ],
        },
      )
      // .shape('simple')
      // .shape('line')
      .color('COLOR')
      .size(10)
      .select(true);

    scene.on('loaded', () => {
      scene.addLayer(layer);
      layer.on('click', (e) => {
        console.log(e);
      });
    });
  }, []);
  return (
    <div
      id="point"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
