import { Marker, MarkerLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const markerCluster: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [105.790327, 30],
      zoom: 2,
    },
  });

  const resp = await fetch(
    'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
  );
  const data = await resp.json();

  const markerLayer = new MarkerLayer({
    cluster: true,
  });

  for (let i = 0; i < data.features.length; i++) {
    const { coordinates } = data.features[i].geometry;
    // create marker with configurable style and color
    const color = i % 2 === 0 ? '#ff5722' : '#5B8FF9';
    const marker = new Marker({
      color,
      style: {
        width: '28px',
        height: '28px',
      } as any as any,
    } as any).setLnglat({
      lng: coordinates[0],
      lat: coordinates[1],
    });
    markerLayer.addMarker(marker);
  }

  scene.addMarkerLayer(markerLayer);

  scene.render();

  markerCluster.extendGUI = (gui) => {
    return [
      gui.add(
        {
          setZoom: () => {
            scene.setZoom(5);
          },
        },
        'setZoom',
      ),
    ];
  };

  return scene;
};
