import { GaodeMap, RasterLayer, Scene, Swipe } from '@antv/l7';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 0,
    style: 'normal',
    center: [127.5671666579043, 7.445038892195569],
    zoom: 2.632456779444394,
  }),
});
scene.on('loaded', () => {
  // 地形地图图层
  const leftLayer = new RasterLayer({}).source(
    'https://tiles{1-3}.geovisearth.com/base/v1/ter/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788',
    {
      parser: {
        maxZoom: 21,
        minZoom: 3,
        type: 'rasterTile',
        tileSize: 256,
        zoomOffset: 0,
      },
    },
  );
  // 影像地图图层
  const rightLayer = new RasterLayer({}).source(
    'https://tiles{1-3}.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788',
    {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        zoomOffset: 0,
      },
    },
  );

  scene.addLayer(leftLayer);
  scene.addLayer(rightLayer);

  const swipe = new Swipe({
    orientation: 'vertical',
    ratio: 0.5,
    layers: [leftLayer],
    rightLayers: [rightLayer],
  });
  scene.addControl(swipe);
});
