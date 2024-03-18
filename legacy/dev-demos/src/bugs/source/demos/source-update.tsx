import { Scene, GaodeMap } from "@antv/l7";
import React, { useEffect } from "react";
import { LineLayer, PointLayer } from "@antv/l7";
const lineList: Feature<LineString>[] = [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [119.988511, 30.269614],
          [119.9851, 30.269323],
          [119.985438, 30.267852],
          [119.990291, 30.267257],
          [119.991454, 30.261762],
          [119.994974, 30.256115],
          [119.983641, 30.246146],
          [119.985286, 30.241228],
          [119.983351, 30.224089],
          [119.985473, 30.221814],
          [119.99271, 30.22088],
        ],
      },
    }
  ];
import {
  coordAll,
  Feature,
  featureCollection,
  LineString,
  point
} from "@turf/turf";
import { debounce } from "lodash";

const id = String(Math.random());

const getPointFeatureCollection = (lineList: Feature<LineString>[]) => {
  return featureCollection(
    coordAll(featureCollection(lineList)).map((item) => point(item))
  );
};

const Demo: React.FC = () => {

  useEffect(() => {
    const scene = new Scene({
      id,
      map: new GaodeMap({
        center: [120.151634, 30.244831],
        pitch: 0,
        style: "dark",
        zoom: 10
      })
    });
    scene.on("loaded", () => {
      const lineLayer = new LineLayer();
      lineLayer
        .source(
          featureCollection(
            lineList.map((item, index) => {
              item.properties = {
                index
              };
              return item;
            })
          )
        )
        .size(4)
        .color("#f00");
      const pointLayer = new PointLayer();
      pointLayer
        .source(getPointFeatureCollection(lineList))
        .size(6)
        .shape("circle")
        .style({
          stroke: "#00f",
          strokeWidth: 3
        });
      scene.addLayer(lineLayer);
      scene.addLayer(pointLayer);

      let isDrag = false;
      let dragFeature: Feature<LineString> | null = null;
      let prePosition = [0, 0];

      lineLayer.on("mousedown", (e) => {
        const { lng, lat } = e.lngLat;
        prePosition = [lng, lat];

        isDrag = true;
        scene.setMapStatus({
          dragEnable: false
        });
        dragFeature = e.feature;
      });

      scene.on("mousemove", (e) => {
        requestAnimationFrame(() => {
          if (isDrag) {
            const { lng, lat } = e.lnglat;
            const [lastLng, lastLat] = prePosition;
            if (dragFeature) {
              const positions = coordAll(dragFeature);
              positions.forEach((position) => {
                position[0] += lng - lastLng;
                position[1] += lat - lastLat;
              });
              dragFeature.geometry.coordinates = positions;
              lineList[dragFeature.properties?.index] = dragFeature;
            }
            prePosition = [lng, lat];
            pointLayer.setData(getPointFeatureCollection([dragFeature]),{
              autoRender:false
            });
            lineLayer.setData(featureCollection(lineList),{
              autoRender:false
            });
            scene.render()
            
          }
        });
      });

      scene.on("mouseup", (e) => {
        isDrag = false;
        scene.setMapStatus({
          dragEnable: true
        });
      });
    });
  }, []);

  return (
    <div>
      <div id={id} style={{ height: 400, position: "relative" }} />
    </div>
  );
};

export default Demo;
