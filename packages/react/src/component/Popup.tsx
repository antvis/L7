import {
  IActiveOption,
  IImage,
  ILayer,
  ILngLat,
  IPopupOption,
  Popup,
  Scene,
} from '@antv/l7';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { useSceneValue } from './SceneContext';

const { useEffect } = React;
interface IPopupProps {
  option: IPopupOption;
  lnglat: ILngLat;
  text: string;
  html: string;
  children?: JSX.Element | JSX.Element[] | Array<JSX.Element | undefined>;
}
export default React.memo(function LoadImage(props: IPopupProps) {
  const mapScene = (useSceneValue() as unknown) as Scene;
  const { lnglat, html, text, children } = props;
  const [popup, setPopup] = React.useState<Popup>();
  const el = document.createElement('div');
  useEffect(() => {
    const p = new Popup(props.option);
    if (lnglat) {
      p.setLnglat(lnglat);
    }
    if (html) {
      p.setHTML(html);
    }
    if (text) {
      p.setText(text);
    }
    if (children) {
      p.setDOMContent(el);
    }
    setPopup(p);
  }, []);
  return createPortal(children, el);
});
