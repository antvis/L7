import { LineLayer, PolygonLayer, Scene, Source } from '@antv/l7';
import { Protocol } from 'pmtiles';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

const protocol = new Protocol();
Scene.addProtocol('pmtiles', protocol.tile);

export const vectorUSA: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [-82.96875, 37.71024],
      zoom: 5,
    },
  });

  const source = new Source(
    'pmtiles://https://r2-public.protomaps.com/protomaps-sample-datasets/cb_2018_us_zcta510_500k.pmtiles',
    {
      parser: {
        type: 'mvt',
        tileSize: 256,
        maxZoom: 7,
        extent: [-180, -85.051129, 179, 85.051129],
      },
    },
  );

  const layer = new PolygonLayer({
    //   featureId: 'COLOR',
    sourceLayer: 'zcta', // woods hillshade contour ecoregions ecoregions2 city
  });
  layer
    .source(source)
    .color('#feb24c')

    .style({
      opacity: 0.8,
    });

  const linelayer = new LineLayer({
    //   featureId: 'COLOR',
    sourceLayer: 'zcta', // woods hillshade contour ecoregions ecoregions2 city
  });
  linelayer.source(source).color('#444').shape('simple').style({
    opacity: 0.8,
  });

  scene.addLayer(layer);
  scene.addLayer(linelayer);

  return scene;
};
