import { PolygonLayer, Scene, Source } from '@antv/l7';
import { Protocol } from 'pmtiles';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';
const protocol = new Protocol();
//@ts-ignore
Scene.addProtocol('pmtiles', protocol.tile);

export const vectorPmTile: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [11.2438, 43.7799],
      zoom: 12,
    },
  });

  const source = new Source(
    'pmtiles://https://mdn.alipayobjects.com/afts/file/A*HYvHSZ-wQmIAAAAAAAAAAAAADrd2AQ/protomaps(vector)ODbL_firenze.bin',
    {
      parser: {
        type: 'mvt',
        tileSize: 256,
        maxZoom: 14,
        extent: [-180, -85.051129, 179, 85.051129],
      },
    },
  );

  const buildings = new PolygonLayer({
    //   featureId: 'COLOR',
    sourceLayer: 'buildings', // woods hillshade contour ecoregions ecoregions2 city
  })
    .source(source)
    .color('#f1b6da')
    .shape('fill')
    .style({
      opacity: 1,
    });
  scene.addLayer(buildings);

  return scene;
};
