import { LineLayer, PointLayer, PolygonLayer, Source, TileDebugLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const tileText: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [120.212089, 30.289822],
      zoom: 12.83,
    },
  });
  const debugerLayer = new TileDebugLayer();

  const source = new Source(
    'https://spatialservice.alipay.com/serve_vector_tile/f/merge117/{z}/{x}/{y}.mvt',
    {
      parser: {
        type: 'mvt',
        tileSize: 256,
        maxZoom: 14,
        extent: [-180, -85.051129, 179, 85.051129],
      },
    },
  );

  const layer = new PolygonLayer({
    //   featureId: 'COLOR',
    sourceLayer: 'county', // woods hillshade contour ecoregions ecoregions2 city
  })
    .source(source)
    .shape('fill')
    .color('#1677ff')
    .style({
      opacity: 0.6,
    });

  const linelayer = new LineLayer({
    //   featureId: 'COLOR',
    sourceLayer: 'county', // woods hillshade contour ecoregions ecoregions2 city
  })
    .source(source)
    .shape('line')
    .size(1)
    .color('#1677ff')
    .style({
      opacity: 1,
    });

  const point = new PointLayer({
    //   featureId: 'COLOR',
    sourceLayer: 'name', // woods hillshade contour ecoregions ecoregions2 city
  })
    .source(source)
    .color('#542788')
    .shape('circle')
    .size(5)
    .style({
      opacity: 1,
    });

  const pointtext = new PointLayer({
    featureId: 'id',
    sourceLayer: 'name', // woods hillshade contour ecoregions ecoregions2 city
  })
    .source(source)
    .color('red')
    .shape('name', 'text')
    .size(12)
    .style({
      textOffsets: [0, -10],
      textAllowOverlap: false,
      opacity: 1,
    });
  scene.addLayer(debugerLayer);
  scene.addLayer(layer);
  scene.addLayer(linelayer);
  scene.addLayer(point);
  scene.addLayer(pointtext);
  console.log(pointtext);

  return scene;
};
