import { LineLayer, PointLayer, PolygonLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const flow: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [8.654789284720719, 47.412606122294044],
      zoom: 5,
    },
  });

  const [fill, lineData] = await Promise.all([
    fetch(
      'https://mdn.alipayobjects.com/afts/file/A*O7PBQoWAMP4AAAAAAAAAAAAADrd2AQ/locations.json',
    ).then((res) => res.json()),
    fetch(
      'https://mdn.alipayobjects.com/afts/file/A*Q_x7TLOMcrAAAAAAAAAAAAAADrd2AQ/flows-2016.json',
    ).then((res) => res.json()),
  ]);

  const filllayer = new PolygonLayer({
    autoFit: true,
  })
    .source(fill)
    .shape('fill')
    .color('#aaa');
  scene.addLayer(filllayer);

  const pointdata = fill.features.map((item: any) => {
    return item.properties;
  });

  const circleLayer = new PointLayer({
    zIndex: 1,
  })
    .source(pointdata, {
      parser: {
        type: 'json',
        coordinates: 'centroid',
      },
    })
    .shape('circle')
    .size(10)
    .color('rgb(8, 64, 129)')
    .style({
      stroke: '#fff',
      strokeWidth: 2,
    });

  scene.addLayer(circleLayer);

  const pointObj: Record<string, any> = {};
  pointdata.forEach((item: any) => {
    pointObj[item.abbr] = item;
  });

  const oddata = lineData
    .map((item: any) => {
      return {
        ...item,
        coordinates: [pointObj[item.origin].centroid, pointObj[item.dest].centroid],
      };
    })
    .sort((a: any, b: any) => {
      return a.count - b.count;
    });

  const layer = new LineLayer({
    zIndex: 0,
    autoFit: true,
  })
    .source(oddata, {
      parser: {
        type: 'json',
        coordinates: 'coordinates',
      },
    })
    .scale('count', {
      type: 'quantile',
    })
    .size('count', [0.5, 1, 2, 2, 2, 6, 8, 10])
    .shape('flowline')
    .color('count', ['#fef6b5', '#ffdd9a', '#ffc285', '#ffa679', '#fa8a76', '#f16d7a', '#e15383'])
    .style({
      // symbol:{
      //   target:'halfTriangle',
      //   source:'none',
      // },
      opacity: {
        field: 'count',
        value: [0.2, 0.4, 0.6, 0.8],
      },
      // opacity:1,
      gapWidth: 1,
      offsets: {
        field: 'count',
        value: () => {
          return [20, 20];
        },
      }, // 支持数据映射
      strokeWidth: 1,
      strokeOpacity: 1,
      stroke: '#000',
    });
  scene.addLayer(layer);

  return scene;
};
