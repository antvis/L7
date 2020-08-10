import { IControl, Logo, PositionName, Scale, Scene, Zoom } from '@antv/l7';
import React, { useEffect, useState } from 'react';
import { useSceneValue } from './SceneContext';
interface IControlProps {
  type: 'scale' | 'zoom' | 'logo';
  position: PositionName;
  [key: string]: any;
}
export default React.memo(function MapControl(props: IControlProps) {
  const scene = (useSceneValue() as unknown) as Scene;
  const [, setControl] = useState();
  const { type, position } = props;
  useEffect(() => {
    let ctr: IControl;
    switch (type) {
      case 'scale':
        ctr = new Scale({
          position: position || 'bottomright',
        });
        break;
      case 'zoom':
        ctr = new Zoom({
          position: position || 'topright',
        });
        break;
      case 'logo':
        ctr = new Logo({
          position: position || 'bottomleft',
        });
    }
    setControl(ctr);
    scene.addControl(ctr);
    return () => {
      scene.removeControl(ctr);
    };
  }, [type, position]);

  return null;
});
