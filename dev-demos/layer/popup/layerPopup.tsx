import {
  GaodeMap,
  PointLayer,
  Popup,
  Scene,
  Fullscreen,
  // anchorType,
} from '@antv/l7';
import { featureCollection, point } from '@turf/turf';
import React, { useState } from 'react';
// tslint:disable-next-line:no-duplicate-imports
import { FunctionComponent, useEffect } from 'react';

const Demo: FunctionComponent = () => {
  const [scene, setScene] = useState<Scene | null>(null);
  const [popup, setPopup] = useState<Popup | null>(null);

  useEffect(() => {
    const newScene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'dark',
        center: [120.104697, 30.260704],
        pitch: 0,
        zoom: 15,
      }),
      // logoVisible: false,
    });

    newScene.on('loaded', () => {
      const newPopup = new Popup({
        closeOnClick: true,
        closeOnEsc: true,
        lngLat: {
          lng: 120.104697,
          lat: 30.260704,
        },
        html: 'fldksja  jdklfaj  jdfklas d skljf as lkfdsa f adsfa fsd alfk',
      });
      newScene.addPopup(newPopup);

      const pointLayer = new PointLayer();
      pointLayer
        .source(featureCollection([point([120.104697, 30.260704])]))
        .color('#ff0000')
        .size(10);

      newScene.addLayer(pointLayer);
      setPopup(newPopup);

      const fullscreen = new Fullscreen();
      newScene.addControl(fullscreen);

      setScene(newScene);
    });
  }, []);

  return (
    <>
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
