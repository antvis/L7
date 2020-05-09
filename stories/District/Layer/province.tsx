import { Scene } from '@antv/l7';
import { ProvinceLayer } from '@antv/l7-district';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
// tslint:disable-next-line:no-submodule-imports
import { Select } from 'antd';
import * as React from 'react';
const { Option } = Select;
const ProvinceData = [
  {
    NAME_CHN: '云南省',
    adcode: 530000,
  },
  {
    NAME_CHN: '黑龙江省',
    adcode: 230000,
  },
  {
    NAME_CHN: '贵州省',
    adcode: 520000,
  },
  {
    NAME_CHN: '北京市',
    adcode: 110000,
  },
  {
    NAME_CHN: '河北省',
    adcode: 130000,
  },
  {
    NAME_CHN: '山西省',
    adcode: 140000,
  },
  {
    NAME_CHN: '吉林省',
    adcode: 220000,
  },
  {
    NAME_CHN: '宁夏回族自治区',
    adcode: 640000,
  },
  {
    NAME_CHN: '辽宁省',
    adcode: 210000,
  },
  {
    NAME_CHN: '海南省',
    adcode: 460000,
  },
  {
    NAME_CHN: '内蒙古自治区',
    adcode: 150000,
  },
  {
    NAME_CHN: '天津市',
    adcode: 120000,
  },
  {
    NAME_CHN: '新疆维吾尔自治区',
    adcode: 650000,
  },
  {
    NAME_CHN: '上海市',
    adcode: 310000,
  },
  {
    NAME_CHN: '陕西省',
    adcode: 610000,
  },
  {
    NAME_CHN: '甘肃省',
    adcode: 620000,
  },
  {
    NAME_CHN: '安徽省',
    adcode: 340000,
  },
  {
    NAME_CHN: '香港特别行政区',
    adcode: 810000,
  },
  {
    NAME_CHN: '广东省',
    adcode: 440000,
  },
  {
    NAME_CHN: '河南省',
    adcode: 410000,
  },
  {
    NAME_CHN: '湖南省',
    adcode: 430000,
  },
  {
    NAME_CHN: '江西省',
    adcode: 360000,
  },
  {
    NAME_CHN: '四川省',
    adcode: 510000,
  },
  {
    NAME_CHN: '广西壮族自治区',
    adcode: 450000,
  },
  {
    NAME_CHN: '江苏省',
    adcode: 320000,
  },
  {
    NAME_CHN: '澳门特别行政区',
    adcode: 820000,
  },
  {
    NAME_CHN: '浙江省',
    adcode: 330000,
  },
  {
    NAME_CHN: '山东省',
    adcode: 370000,
  },
  {
    NAME_CHN: '青海省',
    adcode: 630000,
  },
  {
    NAME_CHN: '重庆市',
    adcode: 500000,
  },
  {
    NAME_CHN: '福建省',
    adcode: 350000,
  },
  {
    NAME_CHN: '湖北省',
    adcode: 420000,
  },
  {
    NAME_CHN: '西藏自治区',
    adcode: 540000,
  },
  {
    NAME_CHN: '台湾省',
    adcode: 710000,
  },
];
export default class Country extends React.Component {
  public state = {
    province: '110000',
  };
  // @ts-ignore
  private scene: Scene;
  private provinceLayer: ProvinceLayer;
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
        minZoom: 3,
        maxZoom: 10,
      }),
    });

    scene.on('loaded', () => {
      const { province } = this.state;
      this.provinceLayer = new ProvinceLayer(scene, {
        data: [],
        adcode: [],
        depth: 3,
        label: {
          field: 'NAME_CHN',
          textAllowOverlap: false,
        },
        fill: {
          field: 'NAME_CHN',
          values: [
            '#feedde',
            '#fdd0a2',
            '#fdae6b',
            '#fd8d3c',
            '#e6550d',
            '#a63603',
          ],
        },
        popup: {
          enable: true,
          Html: (props) => {
            return `<span>${props.NAME_CHN}</span>`;
          },
        },
      });
    });
    this.scene = scene;
  }

  public render() {
    return (
      <>
        <Select
          defaultValue="北京市"
          style={{
            width: 120,
            zIndex: 2,
            position: 'absolute',
            right: '10px',
            top: '10px',
          }}
          onChange={this.handleProvinceChange}
        >
          {ProvinceData.map((province, i) => {
            return (
              <Option key={i} value={province.adcode}>
                {province.NAME_CHN}
              </Option>
            );
          })}
        </Select>
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
      </>
    );
  }

  private handleProvinceChange = (value: string) => {
    this.setState({
      province: value,
    });
    this.provinceLayer.updateDistrict([value]);
  };
}
