// @ts-nocheck
// @ts-ignore
import { Scene } from '@antv/l7';
import { PointLayer, HeatmapLayer } from '@antv/l7-layers';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
import { styled, withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

let currentTimeKey = '0000';
let timeKeys = [];
let layer = null;
const modelDatas = {};
const parser = {
  parser: {
    type: 'json',
    x: 'o',
    y: 'a',
  },
};

export default class Demo extends React.Component {
  private scene: Scene;
  private layer: any;

  constructor() {
    this.state = {
      currentTimeKey: 0,
      modelDatas: {},
    };
  }

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120.2, 36.1],
        zoom: 10,
        style: 'dark',
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/82d85bb6-db7c-4583-af26-35b11c7b2d0d.json',
      )
        .then((res) => res.json())
        .then((originData) => {
          timeKeys = Object.keys(originData);

          this.layer = new HeatmapLayer()
            .source(originData[currentTimeKey], parser)
            .size('v', [0, 0.2, 0.4, 0.6, 0.8, 1])
            .shape('heatmap')
            .style({
              intensity: 10,
              radius: 25,
              opacity: 1.0,
              rampColors: {
                colors: [
                  '#2E8AE6',
                  '#69D1AB',
                  '#DAF291',
                  '#FFD591',
                  '#FF7A45',
                  '#CF1D49',
                ],
                positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
              },
            });
          scene.addLayer(this.layer);

          timeKeys.map((timeKey) => {
            modelDatas[timeKey] = this.layer.createModelData(
              originData[timeKey],
              parser,
            );
          });

          let c = 0;
          let t = setInterval(() => {
            if (c > 47) {
              clearInterval(t);
            } else {
              this.timelinechange(c);
              c++;
            }
          }, 100);
        });
    });
  }

  public timelinechange(time) {
    if (time !== this.state.currentTimeKey) {
      if (this.layer) {
        let currentTimeKey = this.getTimeKey(time, '');

        this.layer.updateModelData(modelDatas[currentTimeKey + '']);
        this.scene.render();
      }
      this.setState({
        currentTimeKey: time,
      });
    }
  }

  public getTimeKey(time, text) {
    const half = Math.floor(time / 2);
    let res = '';
    if (half < 10) {
      res += '0';
    }
    if (time / 2 > half) {
      res += half + text + '30';
    } else {
      res += half + text + '00';
    }
    return res;
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
      >
        <div
          style={{
            position: 'absolute',
            top: '100px',
            left: '100px',
            color: '#fff',
            zIndex: 10,
            fontSize: '36px',
            fontFamily: 'STLiti',
          }}
        >
          {'当前时间 ' + this.getTimeKey(this?.state?.currentTimeKey, ' : ')}
        </div>
        {this.state.modelDatas !== undefined && (
          <RangeInput
            min={0}
            max={47}
            value={this?.state?.currentTimeKey || 0}
            onChange={(e) => this.timelinechange(e)}
          />
        )}
      </div>
    );
  }
}

const PositionContainer = styled('div')({
  position: 'absolute',
  zIndex: 9,
  bottom: '40px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const SliderInput = withStyles({
  root: {
    marginLeft: 12,
    width: '60%',
  },
  valueLabel: {
    '& span': {
      background: 'none',
      color: '#fff',
    },
  },
})(Slider);

function RangeInput({ min, max, value, onChange }) {
  return (
    <PositionContainer>
      <SliderInput
        min={min}
        max={max}
        value={value}
        onChange={(event, newValue) => onChange(newValue)}
        valueLabelDisplay="auto"
        valueLabelFormat={(t) => t}
      />
    </PositionContainer>
  );
}
