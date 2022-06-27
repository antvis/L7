import * as React from 'react';
import * as turf from '@turf/turf';
import {
  RasterLayer,
  Scene,
  LineLayer,
  ILayer,
  PointLayer,
  PolygonLayer,
  Source,
} from '@antv/l7';
import { GaodeMap, GaodeMapV2, Map, Mapbox } from '@antv/l7-maps';

/**
#f7fcf0
#e0f3db
#ccebc5
#a8ddb5
#7bccc4
#4eb3d3
#2b8cbe
#0868ac
#084081

['#fff7f3','#fde0dd','#fcc5c0','#fa9fb5','#f768a1','#dd3497','#ae017e','#7a0177','#49006a']
 */

function getColor(num: number) {
  // if (num > 2000) {
  //   return '#f7fcf0';
  // } else if (num > 1000) {
  //   return '#e0f3db';
  // } else if (num > 800) {
  //   return '#ccebc5';
  // } else if (num > 600) {
  //   return '#a8ddb5';
  // } else if (num > 400) {
  //   return '#7bccc4';
  // } else if (num > 200) {
  //   return '#4eb3d3';
  // } else if (num > 100) {
  //   return '#2b8cbe';
  // } else if (num > 50) {
  //   return '#0868ac';
  // } else {
  //   return ' #084081';
  // }

  if (num > 2000) {
    return '#f7fcf0';
  } else if (num > 1000) {
    return '#e0f3db';
  } else if (num > 800) {
    return '#ccebc5';
  } else if (num > 600) {
    return '#a8ddb5';
  } else if (num > 400) {
    return '#7bccc4';
  } else if (num > 200) {
    return '#4eb3d3';
  } else if (num > 100) {
    return '#2b8cbe';
  } else if (num > 50) {
    return '#0868ac';
  } else {
    return ' #084081';
  }
}

export default class RasterTile extends React.Component<
  any,
  { colorList: string[]; positions: any[] }
> {
  private scene: Scene;

  constructor(props: any) {
    super(props);
    this.state = {
      colorList: [
        '#146968',
        '#1D7F7E',
        '#289899',
        '#34B6B7',
        '#4AC5AF',
        '#5FD3A6',
        '#7BE39E',
        '#A1EDB8',
        '#CEF8D6',
      ],
      positions: [
        '0m',
        '50m',
        '100m',
        '200m',
        '400m',
        '600m',
        '800m',
        '1000m',
        '2000m',
      ],
    };
  }

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    this.scene = new Scene({
      id: 'map',
      stencil: true,
      // map: new GaodeMap({
      map: new GaodeMap({
        center: [119.48, 30.38],
        // style: 'blank',
        style: 'dark',
        zoom: 15,
      }),
    });

    this.scene.on('loaded', () => {
      const tileServe1 = 'http://localhost:3000/zjline.mbtiles/{z}/{x}/{y}.pbf'; // 10 - 11
      const tileServe2 =
        'http://localhost:3000/zjline2.mbtiles/{z}/{x}/{y}.pbf'; // 11.1 -14
      const tileSource = new Source(tileServe2, {
        parser: {
          type: 'mvt',
          tileSize: 256,
          zoomOffset: 0,
          // maxZoom: 10,
          // minZoom: 11,
          // extent: [-180, -85.051129, 179, 85.051129],
          minZoom: 11.1,
          maxZoom: 14,
        },
      });

      // const tileSource2 = new Source('http://localhost:3000/zjline.mbtiles/{z}/{x}/{y}.pbf',
      // {
      //   parser: {
      //     type: 'mvt',
      //     tileSize: 256,
      //     zoomOffset: -2,
      //     maxZoom: 10,
      //     minZoom: 11,
      //     // extent: [-180, -85.051129, 179, 85.051129],
      //   },
      // })
      const layer = new LineLayer({
        featureId: 'COLOR',
        sourceLayer: 'zhejiang', // woods hillshade contour ecoregions ecoregions2 city
      })
        .source(tileSource)
        // .color('ELEV', (v) => getColor(v))
        .color(
          'ELEV',
          [
            '#146968',
            '#1D7F7E',
            '#289899',
            '#34B6B7',
            '#4AC5AF',
            '#5FD3A6',
            '#7BE39E',
            '#A1EDB8',
            '#CEF8D6',
          ].reverse(),
        )
        .size(0.4)
        .scale('ELEV', {
          type: 'quantize',
          domain: [0, 2000],
        })
        .style({
          // color: "#ff0"
          // opacity: 0.4,
        });
      this.scene.addLayer(layer);

      // const layer2 = new LineLayer({
      //   featureId: 'COLOR',
      //   sourceLayer: 'zhejiang', // woods hillshade contour ecoregions ecoregions2 city

      // })
      //   .source(tileSource2)
      //   .color('#f00')
      //   .size(0.4)
      //   .style({
      //     // color: "#ff0"
      //     // opacity: 0.4,
      //   })
      // this.scene.addLayer(layer2);
    });
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
        left: '10px',
        bottom: '30px',
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
                marginTop: '5px',
                width: '48px',
                height: '8px',
                background: color,
                border: '1px solid',
              }}
            ></div>
          </div>
        );
      })}
    </div>
  );
}
