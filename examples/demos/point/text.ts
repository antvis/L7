import { PointLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const text: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.4352, 31.2568],
      style: 'dark',
      zoom: 15.2,
    },
  });

  const baseConfig = {
    textSize: 20,
    strokeWidth: 2,
    strokeOpacity: 1,
    halo: 0.6,
    gamma: 2.2,
  };

  const sampleData = [
    {
      lng: 121.4339,
      lat: 31.25735,
      name: 'Sharp text\nstroke 0 / halo 0.25',
      fill: '#FDE68A',
      stroke: '#111827',
    },
    {
      lng: 121.4352,
      lat: 31.25705,
      name: 'Balanced text\nstroke 2 / halo 0.6',
      fill: '#FFFFFF',
      stroke: '#0F172A',
    },
    {
      lng: 121.43655,
      lat: 31.25675,
      name: 'Heavy outline\nstroke 4 / opacity 0.85',
      fill: '#D1FAE5',
      stroke: '#064E3B',
    },
    {
      lng: 121.43455,
      lat: 31.25595,
      name: 'Small label\ngamma 2.8 / halo 0.9',
      fill: '#BFDBFE',
      stroke: '#1E3A8A',
    },
  ];

  const referenceLayer = new PointLayer({ zIndex: 10 })
    .source(sampleData, {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    })
    .shape('circle')
    .size(4)
    .color('#FF4D4F')
    .style({ opacity: 1 });

  const textLayer = new PointLayer({ zIndex: 11 })
    .source(sampleData, {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    })
    .shape('name', 'text')
    .size(baseConfig.textSize)
    .color('fill')
    .style({
      textAnchor: 'bottom',
      textOffset: [0, 18],
      spacing: 2,
      padding: [6, 4],
      fontFamily: 'Monaco',
      stroke: '#0F172A',
      strokeWidth: baseConfig.strokeWidth,
      strokeOpacity: baseConfig.strokeOpacity,
      halo: baseConfig.halo,
      gamma: baseConfig.gamma,
      textAllowOverlap: true,
    });

  const compareStrongStrokeLayer = new PointLayer({ zIndex: 12 })
    .source(
      sampleData.filter((item) => item.name.startsWith('Heavy outline')),
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    )
    .shape('name', 'text')
    .size(22)
    .color('fill')
    .style({
      textAnchor: 'bottom',
      textOffset: [0, 18],
      fontFamily: 'Monaco',
      stroke: '#064E3B',
      strokeWidth: 4,
      strokeOpacity: 0.85,
      halo: 0.7,
      gamma: 2.2,
      textAllowOverlap: true,
    });

  const compareSmallTextLayer = new PointLayer({ zIndex: 12 })
    .source(
      sampleData.filter((item) => item.name.startsWith('Small label')),
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    )
    .shape('name', 'text')
    .size(16)
    .color('fill')
    .style({
      textAnchor: 'bottom',
      textOffset: [0, 18],
      fontFamily: 'Monaco',
      stroke: '#1E3A8A',
      strokeWidth: 2,
      strokeOpacity: 1,
      halo: 0.9,
      gamma: 2.8,
      textAllowOverlap: true,
    });

  scene.addLayer(referenceLayer);
  scene.addLayer(textLayer);
  scene.addLayer(compareStrongStrokeLayer);
  scene.addLayer(compareSmallTextLayer);

  text.extendGUI = (gui) => {
    const config = { ...baseConfig };

    const sizeController = gui
      .add(config, 'textSize', 12, 32, 1)
      .name('文字大小')
      .onChange((value: number) => {
        textLayer.size(value);
        scene.render();
      });

    const strokeWidthController = gui
      .add(config, 'strokeWidth', 0, 6, 0.1)
      .name('描边宽度')
      .onChange((value: number) => {
        textLayer.style({ strokeWidth: value });
        scene.render();
      });

    const strokeOpacityController = gui
      .add(config, 'strokeOpacity', 0, 1, 0.05)
      .name('描边透明度')
      .onChange((value: number) => {
        textLayer.style({ strokeOpacity: value });
        scene.render();
      });

    const haloController = gui
      .add(config, 'halo', 0, 1.5, 0.05)
      .name('边缘模糊')
      .onChange((value: number) => {
        textLayer.style({ halo: value });
        scene.render();
      });

    const gammaController = gui
      .add(config, 'gamma', 0.8, 4, 0.1)
      .name('Gamma 缩放')
      .onChange((value: number) => {
        textLayer.style({ gamma: value });
        scene.render();
      });

    return [
      sizeController,
      strokeWidthController,
      strokeOpacityController,
      haloController,
      gammaController,
    ];
  };

  return scene;
};
