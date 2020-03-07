import {
  IActiveOption,
  IImage,
  ILayer,
  ILngLat,
  IMarker,
  IMarkerOption,
  IPoint,
  Marker,
  Popup,
  Scene,
} from '@antv/l7';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { SceneContext } from './SceneContext';
interface IMarkerProps {
  option?: IMarkerOption;
  lnglat: ILngLat | number[];
  onMarkerLoad?: (marker: IMarker) => void;
  children?: React.ReactNode;
}
export default class MarkerComponet extends React.PureComponent<IMarkerProps> {
  private el: HTMLDivElement;
  private scene: Scene;
  private marker: IMarker;
  constructor(props: IMarkerProps) {
    super(props);
    this.el = document.createElement('div');
  }
  public componentDidMount() {
    const { lnglat, children, option, onMarkerLoad } = this.props;
    const marker = new Marker(option);
    if (lnglat) {
      marker.setLnglat(lnglat as ILngLat | IPoint);
    }
    if (children) {
      marker.setElement(this.el);
    }
    this.marker = marker;
    if (onMarkerLoad) {
      onMarkerLoad(marker);
    }
    this.scene.addMarker(marker);
  }
  public componentDidUpdate(prevProps: IMarkerProps) {
    const positionChanged =
      prevProps?.lnglat.toString() !== this.props?.lnglat.toString();

    if (positionChanged) {
      this.marker.setLnglat(this.props.lnglat as ILngLat | IPoint);
    }
  }
  public componentWillUnmount() {
    if (this.marker) {
      this.marker.remove();
    }
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
