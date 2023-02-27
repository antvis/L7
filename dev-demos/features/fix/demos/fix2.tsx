import { Scene, PointLayer, Marker, LineLayer, Source } from "@antv/l7";
// import { DrawEvent, DrawLine } from "@antv/l7-draw";
import { GaodeMap, Map, Mapbox } from "@antv/l7-maps";
import { coordAll, Feature, featureCollection, LineString, point } from "@turf/turf";
import React, { useEffect } from 'react';

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
  },
  {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [120.075427, 30.147148],
        [120.073659, 30.147609],
        [120.074996, 30.154115],
        [120.070946, 30.160916],
        [120.074171, 30.161745],
        [120.075425, 30.158086],
        [120.081662, 30.159401],
        [120.084335, 30.163868],
        [120.112648, 30.17977],
        [120.119262, 30.186753],
        [120.137108, 30.198481],
        [120.137962, 30.202496],
        [120.135039, 30.208876],
        [120.135625, 30.216541],
        [120.138548, 30.225005],
        [120.145412, 30.229088],
        [120.155609, 30.230104],
        [120.158572, 30.241788],
        [120.160816, 30.245725],
        [120.16441, 30.245929],
        [120.164401, 30.247589],
        [120.165608, 30.247515],
        [120.166546, 30.254134],
      ],
    },
  },
  {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [120.216401, 30.291456],
        [120.217689, 30.289456],
        [120.218912, 30.28995],
        [120.216862, 30.292565],
        [120.221055, 30.293611],
        [120.221909, 30.291061],
        [120.211464, 30.28603],
        [120.207209, 30.278355],
        [120.207448, 30.270482],
        [120.199987, 30.270352],
        [120.200252, 30.247617],
        [120.210037, 30.243515],
        [120.204483, 30.237082],
        [120.224585, 30.222153],
        [120.213219, 30.213984],
        [120.216402, 30.20977],
        [120.194058, 30.196853],
        [120.17329, 30.188212],
        [120.174223, 30.181411],
        [120.16777, 30.181168],
        [120.167244, 30.173706],
        [120.147426, 30.172062],
        [120.146042, 30.176801],
        [120.135382, 30.17619],
      ],
    },
  },
];


export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120.151634, 30.244831],
        style: "dark",
        zoom: 10
      })
    });

    const source = new Source(featureCollection(
      lineList.map((item, index) => {
        item.properties = {
          index
        };
        return item;
      })
    ))
    scene.on("loaded", () => {
      const lineLayer = new LineLayer();
      lineLayer
        .source(source)
        .size(4)
        .color("#f00");
      scene.addLayer(lineLayer);

      const marker = new Marker()
      marker.setLnglat([
        120.1047383116185, 30.261127905299425,
      ]);
      marker.on('click', (e) => {
        console.log( 'click')
      })
      scene.addMarker(marker);
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
