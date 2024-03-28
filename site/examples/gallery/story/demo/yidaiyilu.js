import { LineLayer, PointLayer, PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [60.268, 30.3628],
    zoom: 1.5,
  }),
});
scene.on('loaded', async () => {
  scene.addImage('local', 'https://gw.alipayobjects.com/zos/rmsportal/xZXhTxbglnuTmZEwqQrE.png');
  const belt = await (
    await fetch('https://gw.alipayobjects.com/os/rmsportal/UpapMomPYUeiBjbHNAma.json')
  ).json();
  const line = await (
    await fetch('https://gw.alipayobjects.com/os/rmsportal/kwUdcXnxQtexeGRvTGtA.json')
  ).json();
  const line2 = await (
    await fetch('https://gw.alipayobjects.com/os/rmsportal/dzpMOiLYBKxpdmsgBLoE.json')
  ).json();
  const point = await (
    await fetch('https://gw.alipayobjects.com/os/rmsportal/opYqFyDGyGUAUXkLUhBV.json')
  ).json();
  const fillLayer = new PolygonLayer({
    autoFit: false,
  })
    .source(belt)
    .color('cname', function (value) {
      return value == '中国' ? 'rgba(46,149,169,0.45)' : 'rgba(227,244,244,1)';
    })
    .shape('fill');

  const linelayer = new LineLayer().source(line).color('rgb(79,147,234)').size(1.5).shape('line');

  const linelayer2 = new LineLayer()
    .source(line2)
    .color('rgb(11,94,69)')
    .size(1.5)
    .shape('line')
    .style({
      // 'lineType':'solid'
    });

  const pointlayer = new PointLayer({}).source(point).size(12.0).shape('local');

  const textlayer = new PointLayer({})
    .source(point)
    .size(12.0)
    .shape('name', 'text')
    .color('#027aff')
    .style({
      textOffset: [0, -42],
      stroke: '#fff',
      strokeWidth: 2,
      textAnchor: 'bottom',
    });
  scene.addLayer(fillLayer);
  scene.addLayer(linelayer);
  scene.addLayer(linelayer2);
  scene.addLayer(pointlayer);
  scene.addLayer(textlayer);
});
