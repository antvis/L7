import { Scene } from '@antv/l7';
import { CountryLayer } from '@antv/l7-district';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class Country extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [116.2825, 39.9],
        pitch: 0,
        style: 'blank',
        zoom: 3,
        minZoom: 1,
        maxZoom: 4,
      }),
    });
    const data = [
      {
        name: '湖北',
        confirm: 16678,
        suspect: 0,
        heal: 533,
        dead: 479,
      },
      {
        name: '广东',
        confirm: 895,
        suspect: 0,
        heal: 37,
        dead: 0,
      },
      {
        name: '浙江',
        confirm: 895,
        suspect: 0,
        heal: 65,
        dead: 0,
      },
      {
        name: '河南',
        confirm: 764,
        suspect: 0,
        heal: 41,
        dead: 2,
      },
      {
        name: '湖南',
        confirm: 661,
        suspect: 0,
        heal: 35,
        dead: 0,
      },
      {
        name: '江西',
        confirm: 548,
        suspect: 0,
        heal: 27,
        dead: 0,
      },
      {
        name: '安徽',
        confirm: 530,
        suspect: 0,
        heal: 20,
        dead: 0,
      },
      {
        name: '重庆',
        confirm: 376,
        suspect: 0,
        heal: 15,
        dead: 2,
      },
      {
        name: '江苏',
        confirm: 341,
        suspect: 0,
        heal: 13,
        dead: 0,
      },
      {
        name: '山东',
        confirm: 307,
        suspect: 0,
        heal: 13,
        dead: 0,
      },
      {
        name: '四川',
        confirm: 301,
        suspect: 0,
        heal: 23,
        dead: 1,
      },
      {
        name: '北京',
        confirm: 253,
        suspect: 0,
        heal: 24,
        dead: 1,
      },
      {
        name: '上海',
        confirm: 243,
        suspect: 0,
        heal: 15,
        dead: 1,
      },
      {
        name: '福建',
        confirm: 205,
        suspect: 0,
        heal: 7,
        dead: 0,
      },
      {
        name: '黑龙江',
        confirm: 190,
        suspect: 0,
        heal: 7,
        dead: 2,
      },
      {
        name: '陕西',
        confirm: 165,
        suspect: 0,
        heal: 6,
        dead: 0,
      },
      {
        name: '广西',
        confirm: 150,
        suspect: 0,
        heal: 10,
        dead: 0,
      },
      {
        name: '河北',
        confirm: 135,
        suspect: 0,
        heal: 4,
        dead: 1,
      },
      {
        name: '云南',
        confirm: 124,
        suspect: 0,
        heal: 5,
        dead: 0,
      },
      {
        name: '海南',
        confirm: 91,
        suspect: 0,
        heal: 4,
        dead: 1,
      },
      {
        name: '辽宁',
        confirm: 81,
        suspect: 0,
        heal: 3,
        dead: 0,
      },
      {
        name: '山西',
        confirm: 81,
        suspect: 0,
        heal: 4,
        dead: 0,
      },
      {
        name: '天津',
        confirm: 69,
        suspect: 0,
        heal: 2,
        dead: 1,
      },
      {
        name: '贵州',
        confirm: 64,
        suspect: 0,
        heal: 8,
        dead: 0,
      },
      {
        name: '甘肃',
        confirm: 57,
        suspect: 0,
        heal: 4,
        dead: 0,
      },
      {
        name: '吉林',
        confirm: 54,
        suspect: 0,
        heal: 1,
        dead: 0,
      },
      {
        name: '内蒙古',
        confirm: 42,
        suspect: 0,
        heal: 3,
        dead: 0,
      },
      {
        name: '宁夏',
        confirm: 34,
        suspect: 0,
        heal: 1,
        dead: 0,
      },
      {
        name: '新疆',
        confirm: 32,
        suspect: 0,
        heal: 0,
        dead: 0,
      },
      {
        name: '香港',
        confirm: 18,
        suspect: 0,
        heal: 0,
        dead: 1,
      },
      {
        name: '青海',
        confirm: 17,
        suspect: 0,
        heal: 3,
        dead: 0,
      },
      {
        name: '台湾',
        confirm: 11,
        suspect: 0,
        heal: 0,
        dead: 0,
      },
      {
        name: '澳门',
        confirm: 10,
        suspect: 0,
        heal: 0,
        dead: 0,
      },
      {
        name: '西藏',
        confirm: 1,
        suspect: 0,
        heal: 0,
        dead: 0,
      },
    ];
    scene.on('loaded', () => {
      const Layer = new CountryLayer(scene, {
        data,
        depth: 1,
        fill: {
          scale: 'quantile',
          field: 'confirm',
          values: [
            '#feedde',
            '#fdd0a2',
            '#fdae6b',
            '#fd8d3c',
            '#e6550d',
            '#a63603',
          ],
        },
      });
    });
    this.scene = scene;
    const scene2 = new Scene({
      id: 'map2',
      logoVisible: false,
      map: new Mapbox({
        center: [113.60540108435657, 12.833692637803168],
        pitch: 0,
        style: 'blank',
        zoom: 1.93,
        minZoom: 0,
        maxZoom: 3,
        interactive: false,
      }),
    });
    scene2.on('loaded', () => {
      const Layer2 = new CountryLayer(scene2, {
        data,
        label: {
          enable: false,
        },
        popup: {
          enable: false,
        },
        autoFit: false,
        fill: {
          scale: 'quantile',
          field: 'confirm',
          values: [
            '#feedde',
            '#fdd0a2',
            '#fdae6b',
            '#fd8d3c',
            '#e6550d',
            '#a63603',
          ],
        },
      });
    });
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
          }}
        />
        <div
          id="map2"
          style={{
            position: 'absolute',
            height: '125px',
            width: '98px',
            right: '100px',
            bottom: '20px',
            border: '1px solid #333',
          }}
        />
      </>
    );
  }
}
