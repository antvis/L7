// https://unpkg.com/xinzhengqu@1.0.0/data/2023_xian.pbf

// @ts-ignore
import { PolygonLayer, Scene,LineLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMap,Map } from '@antv/l7-maps';
import { RDBSource } from "district-data";
import React, { useEffect } from 'react';

  
export default () => {
  // @ts-ignore
    useEffect( async () => {
        const scene = new Scene({
            id: "map",
            map: new GaodeMap({
              center: [107.77791556935472, 35.443286920228644],
              zoom: 2.9142882493605033
            })
          });
          scene.on("loaded", async() => {
            const source = new RDBSource({});
             const data = await ( await fetch(
              "https://gw.alipayobjects.com/os/bmw-prod/e495c407-953b-44cc-8f77-87b9cf257578.json"
            )).json()


  
            const provincedata = await  source.getData({ level: "province" })
              console.log(provincedata)
              const fill = new PolygonLayer({
                zIndex: 50,
                name: "面图层",
              })
                .source({type: "FeatureCollection",features:provincedata.features})
                .shape("fill")
                // .color("#4575b4")
                .color("name", ['#d73027','#f46d43','#fdae61','#fee090','#e0f3f8','#abd9e9','#74add1','#4575b4'])
                .active(false);
              
                const lineLayerRef = new LineLayer({
                  name: "线条图层",
                  zIndex: 100,
                  blend: "normal"
                })
                  .source(data, {
                    parser: {
                      type: "json",
                      x: "from_lon",
                      y: "from_lat",
                      x1: "to_lon",
                      y1: "to_lat"
                    }
                  })
                  .size(4)
                  .shape("greatcircle")
                  .color("#d73027");
                scene.addLayer(fill);
                scene.addLayer(lineLayerRef);

          });
          
      
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
  