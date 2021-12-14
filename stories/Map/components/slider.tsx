// @ts-ignore
import { PointLayer, Scene, ILayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2 } from '@antv/l7-maps';
import * as React from 'react';
import '../index.css';
import { animate, easeInOut } from 'popmotion';

const mapCenter = [121.107846, 30.267069] as [number, number];

export default class Slider extends React.Component {
  // @ts-ignore
  private scene: Scene;
  public pointLayer: ILayer;
  public isShow: boolean = false;
  public slider: HTMLElement;
  public sliderWidth: number;
  public sliderRight: number = 20;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    this.slider = document.getElementById('sliderwrap') as HTMLElement;

    this.sliderWidth = this.slider.getBoundingClientRect().width;

    const scene = new Scene({
      id: 'map',
      map: new GaodeMapV2({
        center: mapCenter,
        pitch: 0,
        style: 'normal',
        zoom: 20,
        animateEnable: false,
      }),
    });

    this.pointLayer = new PointLayer()
      .source(
        [
          {
            lng: 121.107846,
            lat: 30.267069,
          },
          {
            lng: 121.107,
            lat: 30.267069,
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        },
      )
      .shape('circle')
      .color('blue')
      .size(10);
    scene.on('loaded', () => {
      scene.addLayer(this.pointLayer);

      scene.setCenter(mapCenter, {
        padding: [0, this.sliderWidth + this.sliderRight, 0, 0],
      });

      scene.render();
    });

    this.scene = scene;
  }

  public triggle() {
    const lastPaddingRight = this.sliderWidth + this.sliderRight;
    this.isShow = !this.isShow;
    if (this.slider) {
      this.slider.style.right = this.isShow ? '20px' : `-${this.sliderWidth}px`;
      this.sliderRight = this.isShow ? 20 : -this.sliderWidth;

      const currentPaddingRight = this.sliderWidth + this.sliderRight;

      animate({
        from: {
          v: lastPaddingRight,
        },
        to: {
          v: currentPaddingRight,
        },
        ease: easeInOut,
        duration: 500,
        onUpdate: (o) => {
          this.scene.setCenter(mapCenter, { padding: [0, o.v, 0, 0] });
        },
      });
    }
  }

  public render() {
    return (
      <>
        <div
          id="map"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflowX: 'hidden',
          }}
        />
        <div
          id="sliderwrap"
          style={{
            position: 'absolute',
            top: '50px',
            right: `20px`,
            bottom: '50px',
            width: '350px',
            border: '1px solid',
            borderRadius: '10px',
            background: '#fff',
            transition: '0.5s',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '-50px',
              height: '0px',
              width: '0px',
              cursor: 'pointer',
            }}
            onClick={() => this.triggle()}
          >
            {'<<'}
          </div>
        </div>
      </>
    );
  }
}
