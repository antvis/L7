import * as React from 'react';
import * as turf from '@turf/turf';
import {
  RasterLayer,
  Scene,
  LineLayer,
  ILayer,
  PointLayer,
  MaskLayer,
} from '@antv/l7';
import { GaodeMap, GaodeMapV2, Map, Mapbox } from '@antv/l7-maps';
// @ts-ignore
import * as GeoTIFF from 'geotiff';
import { animate, easeInOut } from 'popmotion';
import { styled, withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

export default class RasterTile extends React.Component<
  any,
  { colorList: string[]; positions: any[]; lowClip: number }
> {
  private scene: Scene;
  private layer: any;

  constructor(props: any) {
    super(props);
    this.state = {
      colorList: [
        '#fcfbfd',
        '#efedf5',
        '#dadaeb',
        '#bcbddc',
        '#9e9ac8',
        '#807dba',
        '#6a51a3',
        '#54278f',
        '#3f007d',
      ],
      positions: [
        '0m',
        '200m',
        '300m',
        '400m',
        '500m',
        '600m',
        '700m',
        '800m',
        '1000m',
      ],
      lowClip: 0,
    };
  }

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    this.scene = new Scene({
      id: 'map',
      map: new Map({
        center: [105, 60],
        pitch: 0,
        zoom: 4,
      }),
    });
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    this.scene.on('loaded', () => {
      const highClip = 1024;
      const layer = new RasterLayer();
      this.layer = layer;
      layer
        .source(
          'https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=pk.eyJ1IjoiMTg5Njk5NDg2MTkiLCJhIjoiY2s5OXVzdHlzMDVneDNscDVjdzVmeXl0dyJ9.81SQ5qaJS0xExYLbDZAGpQ',
          {
            parser: {
              type: 'rasterTile',
              dataType: 'arraybuffer',
              tileSize: 256,
              format: async (data: any) => {
                const blob: Blob = new Blob([new Uint8Array(data)], {
                  type: 'image/png',
                });
                const img = await createImageBitmap(blob);
                // @ts-ignore
                ctx.clearRect(0, 0, 256, 256);
                // @ts-ignore
                ctx.drawImage(img, 0, 0, 256, 256);
                // @ts-ignore
                let imgData = ctx.getImageData(0, 0, 256, 256).data;
                let arr = [];
                for (let i = 0; i < imgData.length; i += 4) {
                  const R = imgData[i];
                  const G = imgData[i + 1];
                  const B = imgData[i + 2];
                  const d = -10000 + (R * 256 * 256 + G * 256 + B) * 0.1;
                  arr.push(d);
                }
                return {
                  rasterData: arr,
                  width: 256,
                  height: 256,
                };
              },
            },
          },
        )
        .style({
          domain: [0, highClip],
          clampLow: false,
          rampColors: {
            colors: [
              '#fcfbfd',
              '#efedf5',
              '#dadaeb',
              '#bcbddc',
              '#9e9ac8',
              '#807dba',
              '#6a51a3',
              '#54278f',
              '#3f007d',
            ],
            positions: [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1.0],
          },
        });
      // .select(true);

      this.scene.addLayer(layer);
    });
  }

  public timelinechange(e: number) {
    if (e !== this.state.lowClip) {
      this.layer.style({
        domain: [e, 1024],
      });
      this.scene.render();
      this.setState({
        lowClip: e,
      });
    }
  }

  public render() {
    return (
      <>
        <Legent
          colorList={this.state.colorList}
          positions={this.state.positions}
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
        <RangeInput
          min={0}
          max={1024}
          value={this?.state?.lowClip || 0}
          // @ts-ignore
          onChange={(e) => this.timelinechange(e)}
        />
      </>
    );
  }
}

function Legent(props: { colorList: string[]; positions: number[] }) {
  const { colorList, positions } = props;

  let data: any[] = [];

  colorList.map((color, index) => {
    data.push({
      color: color,
      text: positions[index],
    });
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: '100px',
        bottom: '5px',
        zIndex: 10,
      }}
    >
      {data.map(({ color, text }) => {
        return (
          <div
            style={{
              display: 'inline-block',
              background: '#fff',
              padding: '5px',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                lineHeight: '12px',
              }}
            >
              {text}
            </div>
            <div
              style={{
                width: '30px',
                height: '8px',
                background: color,
              }}
            ></div>
          </div>
        );
      })}
    </div>
  );
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
// @ts-ignore
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
