// @ts-ignore
import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
// import imageIcon from './image/icon.svg';

export default class MultiGaodeMap extends React.Component {
  private scene1: Scene;
  private scene2: Scene;

  public componentWillUnmount() {
    this.scene1.destroy();
    this.scene2.destroy();
  }

  public async componentDidMount() {
    const data = {
      schoolGps: [120.46970867, 27.25603049],
      dataObs: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [120.46753644, 27.22434614],
            },
          },
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [120.48454783, 27.25587721],
            },
          },
        ],
      },
      dataObs2: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [120.47067657, 27.26350309],
            },
          },
        ],
      },
    };
    const scene1 = new Scene({
      id: 'map1',
      map: new GaodeMap({
        center: data.schoolGps as [number, number],
        zoom: 12,
        style: 'light',
      }),
    });
    scene1.addImage(
      '02',
      'https://gw.alipayobjects.com/zos/basement_prod/7aa1f460-9f9f-499f-afdf-13424aa26bbf.svg',
    );
    const scene2 = new Scene({
      id: 'map2',
      map: new GaodeMap({
        center: data.schoolGps as [number, number],
        zoom: 12,
        style: 'dark',
      }),
    });
    scene2.addImage(
      '02',
      'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*KFyuTZxN6wYAAAAAAAAAAABkARQnAQ',
    );
    const imageLayer1 = new PointLayer()
      .source(data.dataObs)
      .shape('02')
      .size(12);

    const imageLayer2 = new PointLayer()
      .source(data.dataObs2)
      .shape('02')
      .size(12);
    scene1.addLayer(imageLayer1);
    scene2.addLayer(imageLayer2);

    this.scene1 = scene1;
    this.scene2 = scene2;
  }

  public render() {
    return (
      <>
        <div
          id="map1"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: '50%',
            bottom: 0,
          }}
        />
        <div
          id="map2"
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            right: 0,
            bottom: 0,
          }}
        />
      </>
    );
  }
}
