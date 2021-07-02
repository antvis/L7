import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_lineHeight extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        pitch: 40,
        style: 'light',
        center: [102.600579, 23.114887],
        zoom: 14.66,
        viewMode: '3D',
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/rmsportal/ZVfOvhVCzwBkISNsuKCc.json',
      )
        .then((res) => res.json())
        .then((data) => {

      //   let data = {
      //     "type": "FeatureCollection",
      //     "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
      //     "features": [
      //     { "type": "Feature", "properties": { "ID": 29, "ELEV": 1520.0 }, "geometry": { "type": "LineString", "coordinates": [ [ 102.608042343554914, 23.123174402406956 ], [ 102.608042343554914, 23.12303965511434 ], [ 102.608042119163088, 23.123036986851119 ], [ 102.608031339379679, 23.122770160529104 ], [ 102.608031339379679, 23.122500665943868 ], [ 102.608042119163088, 23.122470722101063 ], [ 102.6082217822199, 23.122231171358631 ], [ 102.608311613748313, 23.122171283673023 ], [ 102.608580436277236, 23.122231171358631 ], [ 102.608581108333553, 23.122231416131189 ], [ 102.608737131514474, 23.122500665943868 ], [ 102.608737131514474, 23.122770160529104 ], [ 102.608850602918793, 23.12290490782172 ], [ 102.608958400752883, 23.12303965511434 ], [ 102.608958400752883, 23.123174402406956 ] ] } },
      //     { "type": "Feature", "properties": { "ID": 30, "ELEV": 1530.0 }, "geometry": { "type": "LineString", "coordinates": [ [ 102.607834863512082, 23.123174402406956 ], [ 102.607834863512082, 23.12303965511434 ], [ 102.607923541545574, 23.122770160529104 ], [ 102.607923541545574, 23.122500665943868 ], [ 102.608012175320283, 23.122231171358631 ], [ 102.608042119163088, 23.122182172343134 ], [ 102.608311613748313, 23.122021564459004 ], [ 102.608581108333553, 23.122089399325638 ], [ 102.608703539025072, 23.122231171358631 ], [ 102.608850602918793, 23.122462166717405 ], [ 102.608877552377308, 23.122500665943868 ], [ 102.608877552377308, 23.122770160529104 ], [ 102.609093148045503, 23.12303965511434 ], [ 102.609093148045503, 23.123174402406956 ] ] } },
      //  ]
          // }
          const layer = new LineLayer({})
            .source(data)
            .size('ELEV', (h) => {
              return [h % 50 === 0 ? 1.0 : 0.5, (h - 1500) * 20];
            })
            .shape('line')
            .scale('ELEV', {
              type: 'quantize',
            })
            .color('#f00')
            // .color(
            //   'ELEV',
            //   [
            //     '#E4682F',
            //     '#FF8752',
            //     '#FFA783',
            //     '#FFBEA8',
            //     '#FFDCD6',
            //     '#EEF3FF',
            //     '#C8D7F5',
            //     '#A5C1FC',
            //     '#7FA7F9',
            //     '#5F8AE5',
            //   ].reverse(),
            // );
          scene.addLayer(layer);
        });
    });
  }

  public render() {
    return (
      <>
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
