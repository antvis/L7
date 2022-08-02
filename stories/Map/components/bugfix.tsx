// @ts-nocheck
import React from 'react';
import {
  Scene,
  GaodeMap,
  GaodeMapV2,
  Mapbox,
  Map,
  PointLayer,
  Marker,
  MarkerLayer,
  Popup,
  HeatmapLayer,
  LineLayer,
  Source,
  PolygonLayer,
} from '@antv/l7';

export default class Amap2demo extends React.Component {
  public async componentDidMount() {
    const source = new Source(
      [
        {
          lng: 120,
          lat: 30,
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    );

      const scene = new Scene({
        id: 'map',
        map: new Mapbox({
          pitch: 0,
          style: 'light',
          center: [ -96, 37.8 ],
          zoom: 3
        })
      });

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/d36ad90e-3902-4742-b8a2-d93f7e5dafa2.json'
      )
        .then(res => res.json())
        .then(data => {
          // console.log(data)
          const color = [ 'rgb(255,255,217)', 'rgb(237,248,177)', 'rgb(199,233,180)', 'rgb(127,205,187)', 'rgb(65,182,196)', 'rgb(29,145,192)', 'rgb(34,94,168)', 'rgb(12,44,132)' ];
          const layer = new PolygonLayer({})
            .source(data)
            .scale('density', {
              type: 'quantile'
            })
            .color(
              'density', color
            )
            .shape('fill')
            .active(true)
            .style({
              opacity: 1.0
            });
        
          scene.addLayer(layer);
          console.log(layer)
    
         
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
        ></div>
      </>
    );
  }
}
