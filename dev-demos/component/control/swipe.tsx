import { GaodeMap, Scene, Swipe } from '@antv/l7';
import React, { FunctionComponent, useEffect, useState } from 'react';

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
        center: [120, 30],
        pitch: 0,
        zoom: 6.45,
        style: 'normal',
      }),
    });

    scene.on('loaded', () => {
      const swipe = new Swipe({
        orientation: 'vertical',
        ratio: 0.5,
      });
      scene.addControl(swipe);
      setSwipe(swipe);
      setIsAddSwipe(true);
    });
    setScene(scene);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          if (!scene) return;
          if (isAddSwipe) {
            scene.removeControl(swipe);
            // swipe.hide();
            setIsAddSwipe(false);
          } else {
            scene.addControl(swipe);
            // swipe.show();
            setIsAddSwipe(true);
          }
        }}
        disabled={!scene}
      >
        {isAddSwipe ? 'removeControl' : 'addControl'}
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
