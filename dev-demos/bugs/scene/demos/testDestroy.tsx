import { Map, Scene, PolygonLayer,LineLayer,GaodeMap,Mapbox } from "@antv/l7";
import React from "react";
// tslint:disable-next-line:no-duplicate-imports
import { FunctionComponent, useEffect } from "react";

const Demo: FunctionComponent = () => {


  useEffect(() => {
    
    let count = 0;
    let scene;
    const colors = ["red", "green", "blue", "yellow", "purple"];
    function loadAreaMap(color) {
      if (scene != null) {
        scene.destroy();
        scene = null;
      }
      scene = new Scene({
        id: "map",
        map: new Map({
          center: [120.19382669582967, 30.258134],
          pitch: 0,
          zoom: 3,
        }),
        // map: new Mapbox({
        //   zoom: 10,
        //   minZoom: 0,
        //   maxZoom: 18,
        //   center: [120.19382669582967, 30.258134],
        //   token:"pk.eyJ1Ijoic2tvcm5vdXMiLCJhIjoiY2s4dDBkNjY1MG13ZTNzcWEyZDYycGkzMyJ9.tjfwvJ8G_VDmXoClOyxufg",
        // })
      });
      let _this = scene;
      scene.on("loaded", () => {
        // const backgroundLayer = new PolygonLayer({});
        // backgroundLayer
        //   .source({ type: "FeatureCollection", features: chinaGeo.features })
        //   .color(color)
        //   .active(true);
        // const lineLayer = new LineLayer({});
        // lineLayer
        //   .source({ type: "FeatureCollection", features: chinaGeo.features })
        //   .color("#ccc")
        //   .active(false);
        // _this.addLayer(backgroundLayer);
        // _this.addLayer(lineLayer);
      });
    }
    const maxCount = 5;
    loadAreaMap();
    function startRender() {
      let timer = window.setInterval(() => {
        if (count >= maxCount) {
          window.clearInterval(timer);
          scene.destroy();
          scene = null;
          // chinaGeo = null;
          return;
        } else {
          loadAreaMap(colors[count % 5]);
        }
        count++;
        document.querySelector("#start").textContent = `Render ${count}`;
      }, 3000);
    }
    document.querySelector("#start").addEventListener("click", startRender);

  }, []);

  return (

    <><div
      id="map"
      style={{
        height: "500px",
        position: "relative"
      }} /><button id="start">Start</button></>
  );
};

export default Demo;
