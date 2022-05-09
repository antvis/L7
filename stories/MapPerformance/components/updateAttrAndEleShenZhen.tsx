// @ts-nocheck
// @ts-ignore
import { Scene } from '@antv/l7';
import { PointLayer, HeatmapLayer } from '@antv/l7-layers';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
import { styled, withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

export default class Demo extends React.Component {
  private scene: Scene;
  private layer: any;

  constructor() {
    this.state = {
      currentYear: 5,
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
        center: [113.76, 22.742875],
        zoom: 12,
        style: 'dark',
      }),
    });

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/bmw-prod/6956815b-f2b0-4242-97d6-8f3fea62ea17.txt',
      )
        // fetch('https://gw.alipayobjects.com/os/bmw-prod/b08e27a8-26e0-4ba3-9881-7b01f5638716.txt')
        .then((res) => res.text())
        .then((res) => {
          const list = {};
          const array = res.split('\n');
          array = array.map((str) => str.replace('"', ''));
          array.map((str) => {
            let data = str.split(',');
            let lng = +data[0];
            let lat = +data[1];
            data.slice(2).map((e, i) => {
              if (
                e !== undefined &&
                e !== '"' &&
                e !== '' &&
                typeof +e === 'number'
              ) {
                if (!list[i + '']) {
                  list[i + ''] = [];
                  list[i + ''].push({
                    lng,
                    lat,
                    v: +e,
                  });
                } else {
                  list[i + ''].push({
                    lng,
                    lat,
                    v: +e,
                  });
                }
              }
            });
          });
          const listKeys = Object.keys(list);

          // console.log(list)
          // console.log(list['0'])
          const data0 = list['0'];
          const parser = {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          };
          // const layer = new PointLayer({  })
          // .source(data0, parser)
          // .size('v', v => Math.pow(v, 2))
          // .color('v', [
          //   '#ffffb2',
          //   '#fed976',
          //   '#feb24c',
          //   '#fd8d3c',
          //   '#f03b20',
          //   '#bd0026',
          // ])
          // // .shape('circle')
          // .shape('simple')
          // .style({
          //   opacity: 0.2
          // })
          // .shape('dot')
          const layer = new HeatmapLayer()
            .source(data0, parser)
            .size('v', [0, 0.2, 0.4, 0.6, 0.8, 1])
            .shape('heatmap')
            .style({
              intensity: 2,
              radius: 10,
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

          scene.addLayer(layer);
          this.layer = layer;
          this.scene = scene;

          listKeys.map((key) => {
            this.state.modelDatas[key + ''] = layer.createModelData(
              list[key + ''],
              parser,
            );
          });
        });
    });
  }

  public timelinechange(time) {
    if (time !== this.state.currentYear) {
      this.layer.updateModelData(this.state.modelDatas[time]);
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
        {this.state.modelDatas !== undefined && (
          <RangeInput
            min={0}
            max={11}
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
