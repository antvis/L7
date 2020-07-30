import { Scene } from '@antv/l7';
import { CityLayer } from '@antv/l7-district';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import { Cascader } from 'antd';
import * as React from 'react';

export default class Country extends React.Component {
  public state = {
    options: [],
  };
  // @ts-ignore
  private scene: Scene;
  private cityLayer: CityLayer;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const res = await fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/551e3ca6-6dad-421b-a8b4-b225e47f73ca.json',
    );
    const options = await res.json();
    this.setState({
      options,
    });
    const response = await fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/149b599d-21ef-4c24-812c-20deaee90e20.json',
    );
    const provinceData = await response.json();
    const data = Object.keys(provinceData).map((key: string) => {
      return {
        code: parseInt(key),
        name: provinceData[key][0],
        pop: provinceData[key][2] * 1,
      };
    });
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
      this.cityLayer = new CityLayer(scene, {
        data,
        joinBy: ['adcode', 'code'],
        adcode: ['330000', '330100'],
        depth: 3,
        label: {
          field: 'NAME_CHN',
          textAllowOverlap: false,
        },
        bubble: {
          enable: true,
          color: {
            field: 'pop',
            values: [
              '#feedde',
              '#fdd0a2',
              '#fdae6b',
              '#fd8d3c',
              '#e6550d',
              '#a63603',
            ],
          },
        },
        popup: {
          enable: true,
          Html: (props) => {
            return `<span>${props.NAME_CHN}:</span><span>${props.pop}</span>`;
          },
        },
      });
    });
    this.scene = scene;
  }

  public render() {
    return (
      <>
        <Cascader
          style={{
            width: 200,
            zIndex: 2,
            position: 'absolute',
            right: '10px',
            top: '10px',
          }}
          options={this.state.options}
          defaultValue={['330000', '330100']}
          onChange={this.handleProvinceChange}
          placeholder="Please select"
        />
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
  private handleProvinceChange = (value: string[]) => {
    this.cityLayer.updateDistrict([value[1]]);
  };
}
