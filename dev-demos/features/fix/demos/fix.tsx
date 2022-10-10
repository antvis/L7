import { Scene } from "@antv/l7";
// import { DrawEvent, DrawLine } from "@antv/l7-draw";
import { GaodeMapV2, GaodeMap, Map, Mapbox } from "@antv/l7-maps";
import { LineLayer } from "@antv/l7";
import { coordAll, Feature, featureCollection, LineString } from "@turf/turf";
import { debounce } from "lodash";
import React, { useEffect } from 'react';

export const lineList: Feature<LineString>[] = [
  {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [120, 30.25],
        [120, 30.2],
      ],
    },
  },
  {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [120.1, 30.25],
        [120.1, 30.2],
      ],
    },
  },
];

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMapV2({
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
      scene.addLayer(lineLayer);

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

      scene.on(
        "mousemove",
        debounce(
        (e) => {
          if (isDrag) {
            const { lng, lat } = e.lnglat;
            const [lastLng, lastLat] = prePosition;
            if (dragFeature) {
              // lineList[0].geometry.coordinates[0][0] += 0.001
              // lineList[0].geometry.coordinates[1][0] += 0.001

              // lineList[1].geometry.coordinates[0][0] += 0.001
              // lineList[1].geometry.coordinates[1][0] += 0.001

              const positions = coordAll(dragFeature);
              positions.forEach((position) => {
                // console.log(
                //   position[0],
                //   lng - lastLng,
                //   position[0] + lng - lastLng
                // );
                position[0] += lng - lastLng;
                position[1] += lat - lastLat;
              });
              dragFeature.geometry.coordinates = positions;
              lineList[dragFeature.properties?.index] = dragFeature;
            }
            prePosition = [lng, lat];

            // lineLayer.center = undefined
            lineLayer.setData(featureCollection(lineList));
          }
        },
          0,
          {
            maxWait: 100
          }
        )
      );

      scene.on("mouseup", (e) => {
        isDrag = false;
        scene.setMapStatus({
          dragEnable: true
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
