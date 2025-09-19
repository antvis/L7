import { RasterLayer, Scene, Source } from '@antv/l7';
import { Protocol } from 'pmtiles';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';
const protocol = new Protocol();
//@ts-ignore
Scene.addProtocol('pmtiles', protocol.tile);

export const rasterPmTile: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.525013, 25.015092],
      zoom: 18,
    },
  });

  const source = new Source('pmtiles://https://air.mtn.tw/flowers.pmtiles', {
    parser: {
      type: 'rasterTile',
      tileSize: 256,
      maxZoom: 21,
      extent: [121.5237824, 25.0135959, 121.5262444, 25.0165886],
    },
  });

  const rasterLayer = new RasterLayer({
    zIndex: 1,
  })
    .source(source)
    .style({
      opacity: 1,
    });
  scene.addLayer(rasterLayer);

  return scene;
};
