import { GaodeMapV2, GeoLocate, Scene } from '@antv/l7';
import gcoord from 'gcoord';
import React, { useState } from 'react';
// tslint:disable-next-line:no-duplicate-imports
import { FunctionComponent, useEffect } from 'react';

const Demo: FunctionComponent = () => {
  const [scene, setScene] = useState<Scene | undefined>();

  useEffect(() => {
    const newScene = new Scene({
      id: 'map',
      map: new GaodeMapV2({
        style: 'normal',
        center: [120, 30],
        pitch: 0,
        zoom: 6.45,
        preserveDrawingBuffer: true,
        // WebGLParams: {
        //   preserveDrawingBuffer: true,
        // },
      }),
      // logoVisible: false,
    });

    newScene.on('loaded', () => {
      const newControl = new GeoLocate({
        transform: (position) => {
          return gcoord.transform(position, gcoord.WGS84, gcoord.GCJ02);
        },
      });
      newScene.addControl(newControl);
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
