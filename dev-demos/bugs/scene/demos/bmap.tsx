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
