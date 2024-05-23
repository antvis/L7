import { LineLayer, Scene, Source } from '@antv/l7';
import { Protocol } from 'pmtiles';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

const protocol = new Protocol();
Scene.addProtocol('pmtiles', protocol.tile);

export const vectorLine: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [116.420818, 39.923852],
      zoom: 14,
    },
  });

  const source = new Source(
    'pmtiles://https://r2-public.protomaps.com/protomaps-sample-datasets/protomaps-basemap-opensource-20230408.pmtiles',
    {
      parser: {
        type: 'mvt',
        tileSize: 256,
        maxZoom: 14,
        extent: [-180, -85.051129, 179, 85.051129],
      },
    },
  );

  const linelayer = new LineLayer({
    //   featureId: 'COLOR',
    sourceLayer: 'roads', // woods hillshade contour ecoregions ecoregions2 city
  });
  linelayer.source(source).color('#444').shape('simple').style({
    opacity: 0.8,
  });

  scene.addLayer(linelayer);

  return scene;
};
