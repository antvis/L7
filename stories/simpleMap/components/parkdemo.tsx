// @ts-nocheck
import { Scene, PolygonLayer, ImageLayer, PointLayer, Map } from '@antv/l7-mini';
import * as React from 'react';

export default class Demo extends React.Component {
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [500, 500],
        pitch: 0,
        zoom: 2.5,
        version: 'SIMPLE',
        mapSize: 1000,
        maxZoom: 4,
        minZoom: 2
      }),
    });
    scene.setBgColor('rgb(216, 209, 86)');
   

      const textlayer = new PointLayer()
      .source([
        {
          x: 470, 
          y: 520,
          t: '库布齐'
        },
        {
          x: 490, 
          y: 580,
          t: '阿拉善'
        },
        {
          x: 530, 
          y: 530,
          t: '鄂尔多斯'
        },
        {
          x: 545, 
          y: 480,
          t: '武威'
        },
        {
          x: 490, 
          y: 470,
          t: '黄山洋湖'
        }
      ], {
        parser: {
          type: 'json',
          x: 'x',
          y: 'y',
        },
      })
      .shape('t', 'text')
      .size(14)
      .active(true)
      .color('#000')
      .style({
        textAllowOverlap: true
      });

      const imagelayer = new ImageLayer({}).source(
        'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*M1v5TKxzrHoAAAAAAAAAAAAAARQnAQ',
        {
          parser: {
            type: 'image',
            extent: [
              450, 400, 
              550, 600
            ],
          },
        },
      );

    scene.on('loaded', () => {
      
      scene.addLayer(imagelayer);

      scene.addLayer(textlayer);
      // console.log(scene.mapService.getSize())
      // setTimeout(() => {
      //   console.log(scene.mapService.getSize())
      // }, 2000 )
      console.log(scene.mapService.getCenter())
    });

   
  }

  public render() {
    return (
      <div
        id="map"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      ></div>
    );
  }
}
