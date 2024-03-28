import { Scene, HeatmapLayer, GaodeMap } from "@antv/l7";
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {

    const scene = new Scene({
        id: "map",
        map: new GaodeMap({
          style: "dark",
          pitch: 0,
          center: [120., 30.651873105004427],
          zoom: 2
        })
      });
      scene.on("loaded", () => {
        fetch(
          "https://gw.alipayobjects.com/os/basement_prod/a1a8158d-6fe3-424b-8e50-694ccf61c4d7.csv"
        )
          .then((res) => res.text())
          .then((data) => {
            const layer = new HeatmapLayer({
                autoFit: false
            })
              .source(data, {
                parser: {
                  type: "csv",
                  x: "lng",
                  y: "lat"
                },
                transforms: [
                  {
                    type: "hexagon",
                    size: 2500,
                    field: "v",
                    method: "sum"
                  }
                ]
              })
              .size("sum", (sum) => {
                return sum * 1000000;
              })
              .shape("hexagonColumn")
              .style({
                coverage: 0.8,
                angle: 0
              })
              .color("sum", [
                "#094D4A",
                "#146968",
                "#1D7F7E",
                "#289899",
                "#34B6B7",
                "#4AC5AF",
                "#5FD3A6",
                "#7BE39E",
                "#A1EDB8",
                "#C3F9CC",
                "#DEFAC0",
                "#ECFFB1"
              ]);
            scene.addLayer(layer);
            layer.on("inited", () => {
              // alert('inited')
              console.log("inited *****");
            });
          });
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
