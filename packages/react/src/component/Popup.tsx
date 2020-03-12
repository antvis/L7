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
import { SceneContext } from './SceneContext';
interface IPopupProps {
  option?: IPopupOption;
  lnglat: number[];
  children?: React.ReactNode;
}
export default class PopupComponet extends React.PureComponent<IPopupProps> {
  private el: HTMLDivElement;
  private scene: Scene;
  private popup: Popup;
  constructor(props: IPopupProps) {
    super(props);
    this.el = document.createElement('div');
  }
  public componentDidMount() {
    const { lnglat, children, option } = this.props;
    const p = new Popup(option);

    if (lnglat) {
      p.setLnglat(lnglat);
    }
    if (children) {
      p.setDOMContent(this.el);
    }
    this.popup = p;
    this.scene.addPopup(p);
  }

  public componentDidUpdate(prevProps: IPopupProps) {
    const positionChanged =
      prevProps?.lnglat?.toString() !== this.props?.lnglat?.toString();

    if (positionChanged) {
      this.popup.remove();
      this.popup = new Popup(this.props.option);
      this.popup.setLnglat(this.props.lnglat);
      this.popup.setDOMContent(this.el);
      this.scene.addPopup(this.popup);
    }
  }

  public componentWillUnmount() {
    this.popup.remove();
  }

  public render() {
    return React.createElement(
      SceneContext.Consumer,
      // @ts-ignore
      {},
      (scene: Scene) => {
        if (scene) {
          this.scene = scene;
        }

        return createPortal(this.props.children, this.el);
      },
    );
  }
}
