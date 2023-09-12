// @ts-ignore
import { LineLayer, GaodeMap, Mapbox,Scene,Map } from '@antv/l7';
import React, { useEffect } from 'react';
  
export default () => {
    useEffect( () => {
        const scene = new Scene({
            id: 'map1',
            map: new Map({
              center: [116.26191000524402,40.01346243590182],
              zoom: 17,
              style: 'mapbox://styles/mapbox/dark-v11',
              token:
                  'pk.eyJ1IjoiZXRlcm5pdHkteHlmIiwiYSI6ImNqaDFsdXIxdTA1ODgycXJ5czdjNmF0ZTkifQ.zN7e588TqZOQMWfws-K0Yw'
            }),
          });

          const scene2 = new Scene({
            id: 'map2',
            map: new GaodeMap({
              center: [121.472644, 31.231706],
              zoom: 8.15,
              style:'normal',
              zooms: [4, 22],

            }),
          });
          
          const coord1 = [[116.26191000524402,40.01346243590182],[116.26191262306759,40.01341607545047],[116.26191490936715,40.01337305146164],[116.26191719868861,40.01332966034864],[116.26191945904797,40.01328598892853]];
          const coord = coord1.map((item) =>[item[0].toFixed(5) * 1, item[1].toFixed(5) * 1]);
           console.log(coord);
          scene.on('loaded', () => {
            const json = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"LineString",
            
            "coordinates":coord1}}]}
                const layer = new LineLayer({
                    autoFit:true
                })
                  .source(json)
                  .size(2)
                  .shape('simple')
                  .active(true)
                  .color('red');
                scene.addLayer(layer);
              });

              scene2.on('loaded', () => {
                const json = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":[[116.26191000524402,40.01346243590182],[116.26191262306759,40.01341607545047],[116.26191490936715,40.01337305146164],[116.26191719868861,40.01332966034864],[116.26191945904797,40.01328598892853]]}}]}
                    const layer = new LineLayer({
                        autoFit:true
                    })
                      .source(json)
                      .size(1)
                      .shape('line')
                      .active(true)
                      .color('red');
                    // scene2.addLayer(layer);
                  });
 
          
    }, []);
    return (
      <div style={{position:'relative',height:'500px', display:'flex',justifyContent:'space-between'}}>
      <div
        id="map1"
        style={{
          height: '500px',
          width: '500px',
          position:'relative',
        }}
      />
      <div
        id="map2"
        style={{
          height: '500px',
          width: '500px',
          position:'relative',
        }}
      />
    </div>
    );
  };
  