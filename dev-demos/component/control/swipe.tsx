import {
  GaodeMap,
  HeatmapLayer,
  PointLayer,
  RasterLayer,
  Scene,
  Swipe,
} from '@antv/l7';
import type { FunctionComponent} from 'react';
import React, { useEffect, useState } from 'react';

const Demo: FunctionComponent = () => {
  const [scene, setScene] = useState<Scene | null>(null);
  const [swipe, setSwipe] = useState<Swipe | null>(null);
  const [isAddSwipe, setIsAddSwipe] = useState(false);
  const [orientation, setOrientation] = useState<'vertical' | 'horizontal'>(
    'vertical',
  );

  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        center: [127.5671666579043, 7.445038892195569],
        zoom: 2.632456779444394,
        style: 'normal',
      }),
    });
    // 地形地图图层
    const leftLayer1 = new RasterLayer({}).source(
      'https://tiles{1-3}.geovisearth.com/base/v1/ter/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788',
      {
        parser: {
          maxZoom: 21,
          minZoom: 3,
          type: 'rasterTile',
          tileSize: 256,
          zoomOffset: 0,
        },
      },
    );
    // 影像地图图层
    const rightLayer1 = new RasterLayer({}).source(
      'https://tiles{1-3}.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788',
      {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
          zoomOffset: 0,
        },
      },
    );

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const leftLayer2 = new PointLayer({})
            .source(data)
            .shape('circle')
            .size('mag', [1, 25])
            .color('#5B8FF9')
            .style({
              strokeWidth: 3,
            });
          const rightLayer2 = new HeatmapLayer({})
            .source(data)
            .shape('heatmap')
            .size('mag', [0, 1.0])
            .style({
              intensity: 2,
              radius: 20,
              opacity: 1.0,
              rampColors: {
                colors: [
                  '#FF4818',
                  '#F7B74A',
                  '#FFF598',
                  '#91EABC',
                  '#2EA9A1',
                  '#206C7C',
                ].reverse(),
                positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
              },
            });

          scene.addLayer(leftLayer1);
          scene.addLayer(rightLayer1);
          scene.addLayer(leftLayer2);
          scene.addLayer(rightLayer2);

          const swipe = new Swipe({
            orientation: 'vertical',
            ratio: 0.5,
            layers: [leftLayer1, leftLayer2],
            rightLayers: [rightLayer1, rightLayer2],
          });
          scene.addControl(swipe);
          setSwipe(swipe);
          setIsAddSwipe(true);
        });
    });
    setScene(scene);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          if (!scene) return;
          if (isAddSwipe) {
            // scene.removeControl(swipe);
            swipe.hide();
            setIsAddSwipe(false);
          } else {
            // scene.addControl(swipe);
            swipe.show();
            setIsAddSwipe(true);
          }
        }}
        disabled={!scene}
      >
        {/* {isAddSwipe ? 'Remove' : 'Add'} */}
        {isAddSwipe ? 'Hide' : 'Show'}
      </button>
      <button
        onClick={() => {
          const newOrientation =
            orientation === 'vertical' ? 'horizontal' : 'vertical';
          swipe?.setOptions({
            orientation: newOrientation,
          });
          setOrientation(newOrientation);
        }}
      >
        Set {orientation === 'vertical' ? 'horizontal' : 'vertical'}
      </button>
      <button
        onClick={() => {
          swipe?.setOptions({
            ratio: 0.5,
          });
        }}
      >
        Reset position
      </button>
      <div
        id="map"
        style={{
          height: '500px',
          position: 'relative',
        }}
      />
    </>
  );
};

export default Demo;
