import { Scene } from '@antv/l7';
import { CountyLayer } from '@antv/l7-district';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import { Cascader } from 'antd';
import ReactDOM from 'react-dom';
import * as React from 'react';
export default class County extends React.Component {
  public state = {
    options: [],
  };
  // @ts-ignore
  private scene: Scene;
  private countyLayer: CountyLayer;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const res = await fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/04de56cc-5998-4f7e-9ad3-e87e9ac5fd39.json',
    );
    const options = await res.json();
    this.setState({
      options,
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
      this.countyLayer = new CountyLayer(scene, {
        data: [],
        adcode: ['110101'],
        depth: 3,
        label: {
          field: 'NAME_CHN',
        },
        fill: {
          color: {
            field: 'NAME_CHN',
            values: [
              '#feedde',
              '#fdd0a2',
              '#fdae6b',
              '#fd8d3c',
              '#e6550d',
              '#a63603'
            ]
          }
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
        <Cascader
          style={{
            width: 200,
            zIndex: 2,
            position: 'absolute',
            right: '10px',
            top: '10px',
          }}
          options={this.state.options}
          defaultValue={['110000', '110100', '110101']}
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
    this.countyLayer.updateDistrict([value[2]]);
  };
}

ReactDOM.render(<County />, document.getElementById('map'));
