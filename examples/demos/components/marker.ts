import { Marker } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const marker: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.434765, 31.256735],
      zoom: 3,
    },
  });

  const nodes = await fetch(
    'https://gw.alipayobjects.com/os/basement_prod/67f47049-8787-45fc-acfe-e19924afe032.json',
  ).then((res) => res.json());

  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].g !== '1' || nodes[i].v === '') {
      continue;
    }

    const markerIns = new Marker({ draggable: true }).setLnglat({
      lng: Number(nodes[i].x * 1),
      lat: Number(nodes[i].y),
    });
    scene.addMarker(markerIns);
  }

  scene.render();

  marker.extendGUI = (gui) => {
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
