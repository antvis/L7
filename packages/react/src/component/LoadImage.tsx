import { IActiveOption, IImage, ILayer, Scene } from '@antv/l7';
import * as React from 'react';
import { useSceneValue } from './SceneContext';

const { useEffect } = React;
interface ILoadImageProps {
  name: string;
  url: IImage;
}
export default React.memo(function LoadImage(props: ILoadImageProps) {
  const { name, url } = props;
  const mapScene = (useSceneValue() as unknown) as Scene;
  useEffect(() => {
    mapScene.addImage(name, url);
  }, [name, url]);
  return null;
});
