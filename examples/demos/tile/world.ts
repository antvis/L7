import { LineLayer, Scene, Source } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import { Protocol } from 'pmtiles';
import type { RenderDemoOptions } from '../../types';

const protocol = new Protocol();
Scene.addProtocol('pmtiles', protocol.tile);

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'light',
      center: [116.420818, 39.923852],
      zoom: 14,
    }),
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

  scene.on('loaded', () => {
    scene.addLayer(linelayer);

    if (window['screenshot']) {
      window['screenshot']();
    }
  });
}
