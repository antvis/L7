import { GaodeMapV2, LayerPopup, Scene } from '@antv/l7';
import { FlowLayer } from '@antv/l7-composite-layers';

// 详情可见：https://l7plot.antv.antgroup.com/api/composite-layers/flow-layer

const scene = new Scene({
  id: 'map',
  map: new GaodeMapV2({
    pitch: 0,
    style: 'dark',
    center: [121.458794, 31.205302],
    zoom: 10.95,
  }),
});

scene.on('loaded', async () => {
  const response = await fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/f4f3e99a-1d6c-4ab0-b08f-ec730c576b62.json',
  );
  const data = await response.json();

  const flowLayer = new FlowLayer({
    source: {
      data,
      parser: {
        type: 'json',
        x: 'f_lon',
        y: 'f_lat',
        x1: 't_lon',
        y1: 't_lat',
        weight: 'weight',
      },
    },
  });

  flowLayer.on('circleLayer:click', (e) => console.log('circle layer click', e));
  flowLayer.on('lineLayer:click', (e) => console.log('line layer click', e));
  scene && flowLayer.addTo(scene);

  const layerPopup = new LayerPopup({
    items: [
      {
        layer: 'circleLayer',
        fields: ['id', 'weight'],
      },
      {
        layer: 'lineLayer',
        fields: ['id', 'weight'],
      },
    ],
  });
  scene.addPopup(layerPopup);
});
