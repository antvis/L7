import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';
/**
 * @private
 * 点数据转线数据
 * @param data Point类型的数据
 * @param minValue 最小值 用于数据过滤
 * @returns LineString类型的数据
 */
function processPointToLine(data, minValue = 0) {
  // 根据纬度对点进行分组
  const groupedPoints = data.features.reduce((acc, point) => {
    const latitude = point.geometry.coordinates[1];
    if (!acc[latitude]) {
      acc[latitude] = [];
    }
    acc[latitude].push(point);
    return acc;
  }, {});
  // 将每个纬度分组中的点连接成一条线
  let lines = Object.values(groupedPoints).map((points) => {
    let result = [];
    let lastLon = -500;
    points = points.filter((v) => {
      return parseFloat(v.properties.value) > minValue;
    });
    for (let i = 0; i < points.length; i++) {
      if (Math.abs(points[i].geometry.coordinates[0] - lastLon) >= 2) {
        const line = {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: [] },
          properties: { heights: [] },
        };
        result.push(line);
      }
      const line = result[result.length - 1];
      const coordinates = points[i].geometry.coordinates;
      coordinates[2] = parseFloat(points[i].properties.value);
      line.geometry.coordinates.push(points[i].geometry.coordinates);
      line.properties.heights.push(coordinates[2]);
      lastLon = points[i].geometry.coordinates[0];
    }
    result = result.filter((v) => {
      return v.geometry.coordinates.length > 1;
    });
    return result;
  });
  lines = lines.flat(1);
  // 创建包含多条线的新 GeoJSON 对象
  return {
    type: 'FeatureCollection',
    features: lines,
  };
}
/**
 * @private
 * csv转geojson
 * @param csvString csv格式字符串
 * @returns geojson格式对象
 */
function csvToGeojson(csvString) {
  const dataArray = csvString.split('\n');
  const geojson = {
    type: 'FeatureCollection',
    features: [],
  };
  for (let i = 1; i < dataArray.length; i++) {
    const data = dataArray[i];
    const [x, y, value] = data.split(',').map(parseFloat);
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [x, y],
      },
      properties: {
        value: value,
      },
    };
    geojson.features.push(feature);
  }
  return geojson;
}
export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      renderer: process.env.renderer,
      map: new GaodeMap({
        pitch: 40,
        style: 'dark',
        center: [43.686824, -4.665872],
        zoom: 1.2,
        token:
          'pk.eyJ1Ijoic2tvcm5vdXMiLCJhIjoiY2s4dDBkNjY1MG13ZTNzcWEyZDYycGkzMyJ9.tjfwvJ8G_VDmXoClOyxufg',
      }),
    });
    const guiConfig = {
      height: 30,
      minValue: 10000,
      color: '#0D5EFF',
      // opacity:1.0,
      blend: 'additive',
    };
    let layer, originData, gui;

    scene.on('loaded', () => {
      fetch(
        'https://static.observableusercontent.com/files/c517bc4710d3a5daf34549dde51fd3a0e457a62ce3113847cf804dd21b78a95dd0ecc0b975455c4c162f87e74e665e6994bb9bbd457a420e46d6b6179200b47d',
      )
        .then((res) => res.text())
        .then((data) => {
          originData = csvToGeojson(data);
          const dataSource = processPointToLine(originData, guiConfig.minValue);
          layer = new LineLayer({
            blend: guiConfig.blend,
          })
            .source(dataSource)
            .size(1)
            .shape('simple')
            .style({
              vertexHeightScale: 0.01 * guiConfig.height,
              // opacity: guiConfig.opacity
            })
            .color(guiConfig.color);
          scene.addLayer(layer);
        });
      gui = new dat.GUI();
      gui.domElement.style.position = 'absolute';
      gui.domElement.style.top = '202px';
      gui.domElement.style.right = '220px';
      gui.add(guiConfig, 'height', 1, 100, 0.1).onChange((v) => {
        layer.style({
          vertexHeightScale: 0.01 * v,
        });
        scene.render();
      });
      gui.add(guiConfig, 'minValue', 10000, 1000000, 1).onChange((v) => {
        const dataSource = processPointToLine(originData, guiConfig.minValue);
        layer.setData(dataSource);
      });

      gui.add(guiConfig, 'blend', ['additive', 'normal']).onChange((v) => {
        layer.setBlend(v);
      });
      gui.addColor(guiConfig, 'color').onChange((v) => {
        layer.color(v);
        scene.render();
      });
    });
    return () => {
      gui.destroy();
    };
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
