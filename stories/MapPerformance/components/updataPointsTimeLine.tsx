// @ts-nocheck
import { Scene, json } from '@antv/l7';
import { PointLayer } from '@antv/l7-layers';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
import { csvParse } from 'd3-dsv';
import {styled, withStyles} from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

export default class Demo extends React.Component {
  private scene: Scene;
  private layer: any;

  constructor() {
    this.state = {
        currentYear: 50,
        modelDatas: undefined
    }
  }
  public componentWillUnmount() {
    this.scene.destroy();
  }

  public getSortedData(dataList: {DateTime: string}[]) {
    const res = {}, years = []
    dataList.map((data) => {
        const { DateTime } = data
        const year = DateTime.slice(0, 4)
        if(res[year]) {
            res[year].push({
                Latitude: Number(data.Latitude),
                Longitude: Number(data.Longitude),
                Depth: Number(data.Depth),
                Magnitude: Number(data.Magnitude),
            });
        } else {
            years.push(year);
            res[year] = [];
            res[year].push({
                Latitude: Number(data.Latitude),
                Longitude: Number(data.Longitude),
                Depth: Number(data.Depth),
                Magnitude: Number(data.Magnitude),
            });
        }
    })
    return {
        res,
        years
    };
  }

  public getModelDatas(layer, sortedData, years, parser) {
    const modelDatas = {}
    years.map(year => {
        modelDatas[year] = layer.initModelData(sortedData[year], parser)
    })
    
    this.setState({
        modelDatas
    })
  }

  public generateData(size) {
    let data = [];
    for (let i = 0; i < size; i++) {
      data.push({
        lng: Math.random() * 180,
        lat: Math.random() * 80 - 40,
        c: Math.random() > 0.5 ? '#f00' : '#ff0',
      });
    }
    return data;
  }

  public async componentDidMount() {
      
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [-120, 36],
        pitch: 0,
        zoom: 6,
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {

        fetch('https://gw.alipayobjects.com/os/bmw-prod/6b15fe03-9d5b-4779-831d-ec30aa2e4738.csv')
        .then(res => res.text())
        .then(res => {
            const originData = csvParse(res)
            const { res: sortedData, years } = this.getSortedData(originData);
            const parser = {
                parser: {
                    type: 'json',
                    x: 'Longitude',
                    y: 'Latitude'
                }
            }
        
            let layer = new PointLayer()
            .source(sortedData[years[0]], parser)
            .shape('simple')
            .size('Magnitude', v => Math.pow(v, 2))
            .color('Magnitude', [
                '#ffffb2',
                '#fed976',
                '#feb24c',
                '#fd8d3c',
                '#f03b20',
                '#bd0026'
            ])
            .style({
                opacity: 0.5
            })

            scene.addLayer(layer)
            this.layer = layer;
         
            this.getModelDatas(layer, sortedData, years, parser)
          
        })
        
    });
  }

  public timelinechange(time) {
    if(time !== this.state.currentYear) {
        this.layer.updateModelData(this.state.modelDatas[time])
        this.scene.render();
        this.setState({
            currentYear: time
        })
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
        {
            this.state.modelDatas !== undefined && <RangeInput
            min={1988}
            max={2018}
            value={this?.state?.currentYear || 1988}
            onChange = {(e) => this.timelinechange(e)}
        />
        }
      </div>
    );
  }
}



const PositionContainer = styled('div')({
  position: 'absolute',
  zIndex: 1,
  bottom: '40px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

const SliderInput = withStyles({
  root: {
    marginLeft: 12,
    width: '40%'
  },
  valueLabel: {
    '& span': {
      background: 'none',
      color: '#000'
    }
  }
})(Slider);

function RangeInput({min, max, value, onChange}) {
  return (
    <PositionContainer>
      <SliderInput
        min={min}
        max={max}
        value={value}
        onChange={(event, newValue) => onChange(newValue)}
        valueLabelDisplay="auto"
        valueLabelFormat={t => t}
      />
    </PositionContainer>
  );
}

