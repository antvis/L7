// @ts-ignore
import { PointLayer, Scene,Popup } from '@antv/l7';
// @ts-ignore
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import { DrawControl } from '@antv/l7-draw';
import React, { useEffect } from 'react';
  
export default () => {
  // @ts-ignore
    useEffect( async () => {
      const scene = new Scene({
        id: 'map',
        map: new GaodeMap({
          center: [121.4, 31.258134],
          zoom: 14,
          pitch: 0,
          style: 'normal',
          doubleClickZoom:false,
        }),
      });

      //  实例化 DrawControl
      const drawControl = new DrawControl(scene, {
        defaultActiveType: 'point',
        commonDrawOptions: {
          distanceOptions: {

          }
        }
      });

      scene.addControl(drawControl);

          
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
  