import {
  anchorType,
  Fullscreen,
  GaodeMap,
  PointLayer,
  Popup,
  Scene,
} from '@antv/l7';
import { featureCollection, point } from '@turf/turf';
import React, { useState } from 'react';
// tslint:disable-next-line:no-duplicate-imports
import type { FunctionComponent} from 'react';
import { useEffect } from 'react';

const Demo: FunctionComponent = () => {
  const [scene, setScene] = useState<Scene | null>(null);
  const [popup, setPopup] = useState<Popup | null>(null);

  useEffect(() => {
    const newScene = new Scene({
      id: 'map',
      map: new GaodeMap({
        style: 'dark',
        center: [120.104697, 30.260704],
        pitch: 0,
        zoom: 15,
      }),
      // logoVisible: false,
    });

    newScene.on('loaded', () => {
      const newPopup = new Popup({
        // closeOnClick: true,
        closeOnEsc: true,
        lngLat: {
          lng: 120.104697,
          lat: 30.260704,
        },
        anchor: 'bottom-right',
        // followCursor: true,
        title:
          '算啦就是老地方上的分萨迪克浪费撒东方巨龙凯撒付款流水阿帆十多分数据福克斯阿道夫阿斯蒂芬',
        html: '算啦就是老地方上的分萨迪克浪费撒东方巨龙凯撒付款流水阿帆十多分数据福克斯阿道夫阿斯蒂芬',
      });
      newScene.addPopup(newPopup);

      const pointLayer = new PointLayer();
      pointLayer
        .source(featureCollection([point([120.104697, 30.260704])]))
        .color('#ff0000')
        .size(10);

      newScene.addLayer(pointLayer);
      setPopup(newPopup);

      const fullscreen = new Fullscreen();
      newScene.addControl(fullscreen);

      setScene(newScene);
    });
  }, []);

  return (
    <>
      <div>
        <button
          onClick={() => {
            popup?.show();
          }}
        >
          show
        </button>
        <button
          onClick={() => {
            popup?.hide();
          }}
        >
          hide
        </button>
        <button
          onClick={() => {
            popup?.setOptions({
              closeButton: false,
            });
          }}
        >
          closeButton
        </button>
        <button
          onClick={() => {
            popup?.setOptions({
              closeButtonOffsets: [10, 10],
            });
          }}
        >
          closeButtonOffsets
        </button>
        <button
          onClick={() => {
            popup?.setOptions({
              closeOnClick: false,
            });
          }}
        >
          closeOnClick
        </button>
        <button
          onClick={() => {
            popup?.setOptions({
              closeOnEsc: false,
            });
          }}
        >
          closeOnEsc
        </button>
        <button
          onClick={() => {
            popup?.setOptions({
              maxWidth: '50px',
            });
          }}
        >
          maxWidth
        </button>
        <button
          onClick={() => {
            popup?.setOptions({
              anchor: anchorType['BOTTOM-LEFT'],
            });
          }}
        >
          anchor
        </button>
        <button
          onClick={() => {
            popup?.setOptions({
              offsets: [10, 10],
            });
          }}
        >
          offsets
        </button>
        <button
          onClick={() => {
            popup?.setOptions({
              autoPan: true,
            });
            popup?.setLnglat({
              lng: 120,
              lat: 30,
            });
          }}
        >
          autoPan
        </button>
        <button
          onClick={() => {
            popup?.setOptions({
              autoClose: false,
            });
          }}
        >
          autoClose
        </button>
        <button
          onClick={() => {
            popup?.setOptions({
              followCursor: true,
            });
          }}
        >
          followCursor
        </button>
        <button
          onClick={() => {
            popup?.setOptions({
              className: 'text-class',
            });
          }}
        >
          className
        </button>
        <button
          onClick={() => {
            popup?.setOptions({
              style: 'background-color: #ff0000',
            });
          }}
        >
          style
        </button>
        <button
          onClick={() => {
            popup?.setOptions({
              text: 'text',
            });
          }}
        >
          text
        </button>
        <button
          onClick={() => {
            popup?.setOptions({
              html: 'html byOptions',
            });
          }}
        >
          htmlByOptions
        </button>
        <button
          onClick={() => {
            popup?.setHTML('html');
          }}
        >
          html
        </button>
        <button
          onClick={() => {
            popup?.setOptions({
              lngLat: {
                lng: 120.103797,
                lat: 30.260804,
              },
            });
          }}
        >
          lngLat
        </button>
        <button
          onClick={() => {
            popup?.setOptions({
              title: popup.getOptions().title ? undefined : 'Popup Title',
            });
          }}
        >
          toggleTitle
        </button>
        <button
          onClick={() => {
            const newPopup = new Popup({
              // autoPan: true,
              html: 'fjdksl',
              lngLat: {
                lng: 120.103797,
                lat: 30.260804,
              },
            });
            scene?.addPopup(newPopup);
          }}
        >
          addPopup
        </button>
      </div>
      <div
        id="map"
        style={{
          height: '500px',
          position: 'relative',
        }}
      />
    </>
  );
};

export default Demo;
