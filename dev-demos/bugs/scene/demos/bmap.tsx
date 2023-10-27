import { BaiduMap, Scene, PointLayer } from "@antv/l7";
import React from "react";
// tslint:disable-next-line:no-duplicate-imports
import { FunctionComponent, useEffect } from "react";

const Demo: FunctionComponent = () => {

  useEffect(() => {
    const bmap = new BMapGL.Map("map");
    const point = new BMapGL.Point(121.30654632240122, 31.25744185633306);
    bmap.centerAndZoom(point, 3);
    var marker1 = new BMapGL.Marker(new BMapGL.Point(116.404, 39.925));
    bmap.addOverlay(marker1);

    console.log('getRotation', bmap)
    const newScene = new Scene({
      id: "map",
      map: new BaiduMap({ mapInstance: bmap })
    });

    newScene.on("loaded", () => {

      fetch(
        "https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json"
      )
        .then((res) => res.json())
        .then((data) => {
          const pointLayer = new PointLayer({
            autoFit: false
          })
            .source([{
              x: 116.404,
              y: 39.925

            }], {
              parser: {
                type: 'json',
                x: 'x',
                y: 'y'
              }
            })
            .shape("circle")
            .size(10)
            .color('#5CCEA1')
            .active(true)
            .style({
              opacity: 1,
              strokeWidth: 1
            });
          newScene.addLayer(pointLayer);



        });
    });
  }, []);

  return (

    <div
      id="map"
      style={{
        height: "500px",
        position: "relative"
      }}
    />
  );
};

export default Demo;
