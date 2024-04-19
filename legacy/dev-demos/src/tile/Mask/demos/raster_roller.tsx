// @ts-ignore
import { PolygonLayer, RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import React, { useEffect, useState, useRef } from 'react';

export default () => {
  const [barLocation, setBarLocation] = useState(0.5);
  const barLocationRef = useRef(barLocation);
  const [activity, setActivity] = useState(false);
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const layerRef = useRef(null);

  // 镜头移动时更新mask
  const updateMask = (layer = layerRef.current, ratio = barLocationRef.current) => {
    // @ts-ignore
    const [sw, ne] = sceneRef.current?.mapService.getBounds();
    const [swLng, swLat] = sw;
    const [neLng, neLat] = ne;
    const centerLng = swLng * (1 - ratio) + neLng * ratio;
    const maskCoordinate = [
      [swLng, neLat],
      [centerLng, neLat],
      [centerLng, swLat],
      sw,
    ];

    // @ts-ignore
    layer?.setData({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            enableMask: true,
            maskInside: true,
            coordinates: [
              maskCoordinate,
            ],
          },
        },
      ],
    });

    // @ts-ignore
    sceneRef.current?.render();
  }

  const handleMouseDown = () => {
    if (activity) return;
    setActivity(true)
  };

  const handleMouseMove = (e) => {
    if (!activity) return;
    // @ts-ignore
    let bounds = containerRef.current?.getBoundingClientRect();
    let relativeDistance = e.clientX - bounds.left;
    const ratio = relativeDistance / bounds.width
    setBarLocation(ratio);
    barLocationRef.current = ratio; // 更新 ref
    updateMask()
  }

  const handleMouseUp = () => {
    if (!activity) return;
    setActivity(false);
  }

  const maskLine = 113.270854;

  useEffect(() => {
    // 初始化map
    const scene = new Scene({
      id: 'map',

      map: new Map({
        center: [maskLine, 23.141717],
        zoom: 5,
      }),
    });
    sceneRef.current = scene;

    const url1 =
      'https://tiles{1-3}.geovisearth.com/base/v1/ter/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
    const url2 =
      'https://tiles{1-3}.geovisearth.com/base/v1/cat/{z}/{x}/{y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';

    const layer3 = new PolygonLayer({
      zIndex: 1,
      visible: false,
    })
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',

              enableMask: true,
              maskInside: true,
              coordinates: [
                [
                  [-180.0, -89.0],
                  [113.270854, -89.0],
                  [113.270854, 89.0],
                  [-180.0, 89.0],
                ],
              ],
            },
          },
        ],
      })
      .shape('fill')
      .color('#f00')
      .style({
        opacity: 0,
      });

    layerRef.current = layer3;

    // 栅格图层使用polygon 掩模
    const layer1 = new RasterLayer({
      zIndex: 1,
      maskLayers: [layer3],
      enableMask: true,
      maskInside: false,

    }).source(url1, {
      parser: {
        maxZoom: 21,
        minZoom: 3,

        type: 'rasterTile',
        tileSize: 256,
        zoomOffset: 0,
      },
    });

    const layer2 = new RasterLayer({
      zIndex: 1,
    }).source(url2, {
      parser: {
        maxZoom: 21,
        minZoom: 3,
        type: 'rasterTile',
        tileSize: 256,
        zoomOffset: 0,
      },
    });

    scene.on('loaded', () => {
      scene.addLayer(layer1); //彩色地图图层
      scene.addLayer(layer2); //白色地图图层
      scene.addLayer(layer3);
    });

    // Listen camera change event
    scene.mapService.on('camerachange', () => {
      updateMask();
    })
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          position: 'relative',
        }}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}

      >
        <div
          id="bar"
          style={{
            marginLeft: `${barLocation * 100}%`,
            zIndex: 5,
            width: '10px',
            height: 'calc(100% + 2px)',
            cursor: 'pointer',
            position: 'absolute',
            backgroundColor: 'white',
            borderLeft: '1px solid rgba(0,0,0,.25)',
            boxShadow: '0 1px 2px rgba(0,0,0,.25)',
          }}
          onMouseDown={handleMouseDown}
        />
        <div
          id="map"
          style={{
            height: '60vh',
            position: 'relative',
            width: '100%',
          }}
        />
      </div>
    </>
  );
};
