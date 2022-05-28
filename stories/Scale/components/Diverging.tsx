import { PolygonLayer, Scene, Popup } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

const list = [
  {
    value: 10.0,
    color1: 'red',
    province_adcode: '110000',
    province_adName: '北京市',
    province: '北京市',
  },
  {
    value: 8.0,
    color1: 'red',
    province_adcode: '120000',
    province_adName: '天津市',
    province: '天津市',
  },
  {
    value: 6.0,
    color1: 'blue',
    province_adcode: '130000',
    province_adName: '河北省',
    province: '河北省',
  },
  {
    value: 4.0,
    color1: 'blue',
    province_adcode: '140000',
    province_adName: '山西省',
    province: '山西省',
  },
  {
    value: 2.0,
    color1: 'blue',
    province_adcode: '150000',
    province_adName: '内蒙古自治区',
    province: '内蒙古自治区',
  },
  {
    value: 0.0,
    color1: 'blue',
    province_adcode: '210000',
    province_adName: '辽宁省',
    province: '辽宁省',
  },
  {
    value: -2,
    color1: 'green',
    province_adcode: '220000',
    province_adName: '吉林省',
    province: '吉林省',
  },
  {
    value: -4,
    color1: 'green',
    province_adcode: '230000',
    province_adName: '黑龙江省',
    province: '黑龙江省',
  },
  {
    value: -6,
    color1: 'green',
    province_adcode: '310000',
    province_adName: '上海市',
    province: '上海市',
  },
  {
    value: -8,
    color1: 'green',
    province_adcode: '320000',
    province_adName: '江苏省',
    province: '江苏省',
  },
  {
    value: -10,
    color1: 'green',
    province_adcode: '330000',
    province_adName: '浙江省',
    province: '浙江省',
  },
  {
    value: 12.0,
    color1: 'yellow',
    province_adcode: '340000',
    province_adName: '安徽省',
    province: '安徽省',
  },
  {
    value: -12,
    color1: 'yellow',
    province_adcode: '350000',
    province_adName: '福建省',
    province: '福建省',
  },
  {
    value: 14.0,
    color1: 'yellow',
    province_adcode: '360000',
    province_adName: '江西省',
    province: '江西省',
  },
  {
    value: -14.0,
    color1: 'yellow',
    province_adcode: '370000',
    province_adName: '山东省',
    province: '山东省',
  },
  {
    value: 16.0,
    color1: 'yellow',
    province_adcode: '410000',
    province_adName: '河南省',
    province: '河南省',
  },
  {
    value: -16,
    color1: 'yellow',
    province_adcode: '420000',
    province_adName: '湖北省',
    province: '湖北省',
  },
  {
    value: 18.0,
    color1: 'yellow',
    province_adcode: '430000',
    province_adName: '湖南省',
    province: '湖南省',
  },
  {
    value: -18.0,
    color1: 'yellow',
    province_adcode: '440000',
    province_adName: '广东省',
    province: '广东省',
  },
  {
    value: 20.0,
    color1: 'yellow',
    province_adcode: '450000',
    province_adName: '广西壮族自治区',
    province: '广西壮族自治区',
  },
  {
    value: 21.0,
    color1: 'orange',
    province_adcode: '460000',
    province_adName: '海南省',
    province: '海南省',
  },
  {
    value: 22.0,
    color1: 'orange',
    province_adcode: '500000',
    province_adName: '重庆市',
    province: '重庆市',
  },
  {
    value: 23.0,
    color1: 'orange',
    province_adcode: '510000',
    province_adName: '四川省',
    province: '四川省',
  },
  {
    value: 24.0,
    color1: 'orange',
    province_adcode: '520000',
    province_adName: '贵州省',
    province: '贵州省',
  },
  {
    value: 25.0,
    color1: 'orange',
    province_adcode: '530000',
    province_adName: '云南省',
    province: '云南省',
  },
  {
    value: -26.0,
    color1: 'orange',
    province_adcode: '540000',
    province_adName: '西藏自治区',
    province: '西藏自治区',
  },
  {
    value: 27.0,
    color1: 'orange',
    province_adcode: '610000',
    province_adName: '陕西省',
    province: '陕西省',
  },
  {
    value: -28.0,
    color1: 'orange',
    province_adcode: '630000',
    province_adName: '青海省',
    province: '青海省',
  },
  {
    value: 29.0,
    color1: 'orange',
    province_adcode: '640000',
    province_adName: '宁夏回族自治区',
    province: '宁夏回族自治区',
  },
  {
    value: 60.0,
    color1: 'orange',
    province_adcode: '650000',
    province_adName: '新疆维吾尔自治区',
    province: '新疆维吾尔自治区',
  },
  {
    value: -31.0,
    color1: 'orange',
    province_adcode: '710000',
    province_adName: '台湾省',
    province: '台湾省',
  },
  {
    value: 80.0,
    color1: 'orange',
    province_adcode: '810000',
    province_adName: '香港特别行政区',
    province: '香港特别行政区',
  },
  {
    value: -33.0,
    color1: 'orange',
    province_adcode: '820000',
    province_adName: '澳门特别行政区',
    province: '澳门特别行政区',
  },
];

export default class Diverging extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      pickBufferScale: 1.0,
      map: new GaodeMap({
        style: 'light',
        center: [-121.24357, 37.58264],
        pitch: 0,
        zoom: 6.45,
      }),
    });
    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/alisis/geo-data-v0.1.1/choropleth-data/country/100000_country_province.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const chinaPolygonLayer = new PolygonLayer({
            autoFit: true,
          })
            .source(data, {
              transforms: [
                {
                  type: 'join',
                  sourceField: 'province_adName',
                  targetField: 'name', // data 对应字段名 绑定到的地理数据
                  data: list,
                },
              ],
            })
            .scale({
              value: {
                ticks: [5],
                type: 'linear', //sequential
                // domain: [-40, 0, 40],
              },
            })
            .color('value', [
              '#eff3ff',
              '#bdd7e7',
              '#6baed6',
              '#3182bd',
              '#08519c',
            ])
            .shape('fill')
            .style({
              opacity: 1,
            });

          const textLayer = new PolygonLayer({
            autoFit: false,
          })
            .source(data, {
              transforms: [
                {
                  type: 'join',
                  sourceField: 'province_adName',
                  targetField: 'name', // data 对应字段名 绑定到的地理数据
                  data: list,
                },
              ],
            })
            .size(10)
            .color('#000')
            .shape('value', 'text');

          chinaPolygonLayer.on('add', (type) => {
            console.log(
              'getLegendItems: ',
              chinaPolygonLayer.getLegendItems('color'),
            );
          });

          chinaPolygonLayer.on('mousemove', (e) => {
            const popup = new Popup({
              offsets: [0, 0],
              closeButton: false,
            })
              .setLnglat(e.lngLat)
              .setHTML(e.feature.properties.name + e.feature.properties.value);
            scene.addPopup(popup);
          });

          scene.addLayer(chinaPolygonLayer);
          scene.addLayer(textLayer);
        });

      this.scene = scene;
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
      />
    );
  }
}
