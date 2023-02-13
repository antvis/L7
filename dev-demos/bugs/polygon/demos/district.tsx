// https://unpkg.com/xinzhengqu@1.0.0/data/2023_xian.pbf

// @ts-ignore
import { PolygonLayer, Scene,Popup } from '@antv/l7';
// @ts-ignore
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import geobuf from 'geobuf';
import Pbf from 'pbf';
import * as turf from '@turf/turf'
  
export default () => {
  // @ts-ignore
    useEffect( async () => {
      console.time('load')
      const response = await fetch(
        'https://unpkg.com/xinzhengqu@1.0.0/data/2023_xian.pbf',
      );
      let shapeType = '01'
      const scene = new Scene({
        id: 'map',
        map: new GaodeMap({
          center: [121.4, 31.258134],
          zoom: 2,
          pitch: 0,
          style: 'normal',
          doubleClickZoom:false,
        }),
      });
  
      const data = await response.arrayBuffer();

      const geojson = geobuf.decode(new Pbf(data));
      var options = {tolerance: 0.005, highQuality: false};
      var simplified = turf.simplify(geojson, options);

      
      const fill = new PolygonLayer({
        autoFit:false
      })
        .source(simplified)
        .shape('fill')
        .color('ENG_NAME',['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'])
        .active(false)
       
      scene.addLayer(fill);
          
    }, []);
    return (
      <div
        id="map"
        style={{
          height: '500px',
          position: 'relative',
        }}
      />
    );
  };
  