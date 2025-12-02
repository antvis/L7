import { LayerPopup, PolygonLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const fillChina: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [-96, 37.8],
      zoom: 3,
    },
  });

  const url1 =
    'https://mdn.alipayobjects.com/antforest/afts/file/A*vaL-R4SU18IAAAAAgCAAAAgAerd2AQ/original_2025-11-14.json';
  // const url2 = 'https://geojson.cn/api/china/1.6.2/china.json'
  const result = await fetch(url1);
  const data = await result.json();
  const fillData = data.features.filter((feature: any) => {
    // 过滤掉线数据
    if (feature.properties.name === '境界线') {
      return false;
    }
    return true;
  });
  // 未定国界线数据
  const UndelimitedBoundary = data.features.filter((feature: any) => {
    // 过滤掉线数据
    if (feature.properties.gb === '003') {
      return true;
    }
    return false;
  });

  const boundary = data.features.filter((feature: any) => {
    // 过滤掉线数据
    if (feature.properties.gb !== '003') {
      return true;
    }
    return false;
  });
  // 行政区划填充色
  const fillLayer = new PolygonLayer({
    autoFit: true,
  })
    .source({
      type: 'FeatureCollection',
      features: fillData,
    })
    .color('#d6dff6')
    .shape('fill')
    .active({
      color: '#5483ef',
    })
    .style({
      opacity: 0.5,
    });
  const boundaryLayer = new PolygonLayer({
    autoFit: true,
  })
    .source({
      type: 'FeatureCollection',
      features: boundary,
    })
    .color('#5483ef')
    .shape('line')
    .size(0.5)
    .style({
      opacity: 1,
    });

  // 未定国际虚线表示
  const layer = new PolygonLayer({
    autoFit: true,
  })
    .source({
      type: 'FeatureCollection',
      features: UndelimitedBoundary,
    })
    .color('red')
    .shape('line')
    .size(1)
    .style({
      opacity: 1,
      lineType: 'dash',
      dashArray: [5, 5],
    });

  const layerPopup = new LayerPopup({
    trigger: 'click',
    items: [
      {
        layer: fillLayer,
        fields: [
          {
            field: 'name',
            formatField: () => '名称',
          },
          {
            field: 'gb',
            formatField: () => '编号',
            formatValue: (val) => val,
          },
        ],
      },
    ],
  });

  scene.addLayer(fillLayer);

  scene.addLayer(boundaryLayer);

  scene.addLayer(layer);

  scene.addPopup(layerPopup);

  return scene;
};
