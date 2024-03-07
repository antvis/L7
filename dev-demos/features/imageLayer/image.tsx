import { ImageLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import dat from 'dat.gui'
import React, { useEffect } from 'react';
export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      pickBufferScale: 1.0,
      renderer: 'device',
      map: new GaodeMap({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'normal',
        zoom: 10,
      }),
    });
    const layerStyle = {
      brightness: 1.0,
      gamma: 1.0,
      color: '#ffffff',
      opacity: 1.0,
      saturation: 1.0,
      contrast: 1.0,
    };
    const layer = new ImageLayer({});
    layer.source(
      'https://cdn.uino.cn/thing-earth-space/images/refraction.jpg',
      // 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*4k6vT6rUsk4AAAAAAAAAAAAAARQnAQ',
      {
        parser: {
          type: 'image',
          extent: [121.168, 30.2828, 121.384, 30.4219],
        },
      },
    );
    layer.style(layerStyle);
    scene.on('loaded', () => {
      scene.addLayer(layer);
      scene.startAnimate();
    });
    const gui = new dat.GUI();
    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '202px';
    gui.domElement.style.right = '220px';
    gui.add(layerStyle, 'brightness', 0, 2, 0.01).onChange((v) => {
      layer.style({
        brightness: v,
      });
      scene.render();
    });
    gui.add(layerStyle, 'saturation', 0, 2, 0.01).onChange((v) => {
      layer.style({
        saturation: v,
      });
      scene.render();
    });
    gui.add(layerStyle, 'contrast', 0, 2, 0.01).onChange((v) => {
      layer.style({
        contrast: v,
      });
      scene.render();
    });
    gui.add(layerStyle, 'gamma', 0, 2, 0.01).onChange((v) => {
      layer.style({
        gamma: v,
      });
      scene.render();
    });
    gui.add(layerStyle, 'opacity', 0, 1, 0.01).onChange((v) => {
      layer.style({
        opacity: v,
      });
      scene.render();
    });

    return () => {
      gui.destroy();
    };
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
