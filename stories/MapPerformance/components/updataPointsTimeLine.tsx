// @ts-nocheck
import { Scene, json } from '@antv/l7';
import { PointLayer } from '@antv/l7-layers';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
import { styled, withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

export default class Demo extends React.Component {
  private scene: Scene;
  private layer: any;

  constructor() {
    this.state = {
      currentYear: 24,
      modelDatas: undefined,
    };
  }
  public componentWillUnmount() {
    this.scene.destroy();
  }

  public getTimeKey(time, str: string = '') {
    const half = Math.floor(time / 2);
    const res = '';
    if (half < 10) {
      res += '0';
    }
    if (time / 2 > half) {
      res += half + str + '30';
    } else {
      res += half + str + '00';
    }
    return res;
  }

  public getModelDatas(layer, sortedData, years, parser) {
    const modelDatas = {};
    years.map((year) => {
      modelDatas[year] = layer.createModelData(sortedData[year], parser);
    });

    this.setState({
      modelDatas,
    });
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120.2, 36.1],
        pitch: 0,
        zoom: 10,
        style: 'dark',
      }),
    });
    this.scene = scene;
    // 公交出行需求量的时序数据
    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/82d85bb6-db7c-4583-af26-35b11c7b2d0d.json',
      )
        .then((res) => res.json())
        .then((originData) => {
          const times = Object.keys(originData);
          const parser = {
            parser: {
              type: 'json',
              x: 'o',
              y: 'a',
            },
          };
          let layer = new PointLayer({})
            .source(originData[times[0]], parser)
            .shape('simple')
            .size('v', (v) => Math.sqrt(v) / 6)
            .color('v', ['#ffffb2', '#fecc5c', '#fd8d3c', '#e31a1c'])
            .scale('v', {
              type: 'quantize',
            })
            .style({
              opacity: 0.8,
            });

          scene.addLayer(layer);
          this.layer = layer;

          this.getModelDatas(layer, originData, times, parser);

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
    if (time !== this.state.currentYear) {
      this.layer.updateModelData(this.state.modelDatas[this.getTimeKey(time)]);
      this.scene.render();
      this.setState({
        currentYear: time,
      });
    }
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
          {'当前时间 ' + this.getTimeKey(this?.state?.currentYear, ' : ')}
        </div>
        {this.state.modelDatas !== undefined && (
          <RangeInput
            min={0}
            max={48}
            value={this?.state?.currentYear || 0}
            onChange={(e) => this.timelinechange(e)}
          />
        )}
      </div>
    );
  }
}

const PositionContainer = styled('div')({
  position: 'absolute',
  zIndex: 2,
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
        valueLabelFormat={(t) => {
          const half = Math.floor(t / 2);
          const res = '';
          if (half < 10) {
            res += '0';
          }
          if (t / 2 > half) {
            res += half + ':30';
          } else {
            res += half + ':00';
          }
          return res;
        }}
      />
    </PositionContainer>
  );
}
