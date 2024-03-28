import { PointLayer, PolygonLayer, RasterLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [121.268, 30.3628],
    zoom: 10,
  }),
});
scene.on('loaded', async () => {
  const googleurl = 'https://www.google.com/maps/vt?lyrs=s@820&gl=cn&x={x}&y={y}&z={z}';
  const gazafill = await (
    await fetch(
      'https://mdn.alipayobjects.com/afts/file/A*7h8hS5hqXkcAAAAAAAAAAAAADrd2AQ/gaza.geo.json',
    )
  ).json();
  const gazacity = await (
    await fetch(
      'https://mdn.alipayobjects.com/afts/file/A*3xTGQ6ZeTIcAAAAAAAAAAAAADrd2AQ/gazacity.json',
    )
  ).json();

  const fillLayer = new PolygonLayer({
    visible: false,
  })
    .source(gazafill)
    .shape('fill')
    .color('red');

  const googleMap = new RasterLayer({
    zIndex: -1,
    maskLayers: [fillLayer],
    zoomOffset: 1,
    updateStrategy: 'overlap',
  }).source(googleurl, {
    parser: {
      type: 'rasterTile',
      tileSize: 256,
    },
  });

  const fillLine = new PolygonLayer({
    autoFit: true,
  })
    .source(gazafill)
    .shape('line')
    .color('red')
    .size(1);
  const cityLayer = new PointLayer()
    .source(gazacity)
    .shape('circle')
    .size(5)
    .color('#027aff')
    .style({ opacity: 1, stroke: '#fff', strokeWidth: 2 });
  const cityLayerName = new PointLayer()
    .source(gazacity)
    .shape('city', 'text')
    .size(12)
    .color('#027aff')
    .style({
      textAnchor: 'top', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
      spacing: 2, // 字符间距
      fontWeight: '800',
      textOffset: [0, 30],
      padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
      stroke: '#ffffff', // 描边颜色
      strokeWidth: 2, // 描边宽度
      textAllowOverlap: true,
    });
  scene.addLayer(googleMap);
  scene.addLayer(fillLine);
  scene.addLayer(fillLayer);
  scene.addLayer(cityLayer);
  scene.addLayer(cityLayerName);
});
