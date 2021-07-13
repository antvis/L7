//@ts-ignore
import { MarkerLayer, Scene } from '@antv/l7';
import { AMapScene, Marker, Popup } from '@antv/l7-react';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
import { useState } from 'react';

const Amap2demo_markerPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  return (
    <AMapScene
      map={{
        center: [114, 32],
        pitch: 0,
        style: 'dark',
        zoom: 6,
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Marker
        key={1}
        lnglat={[112, 30]}
        onMarkerLoaded={(marker) => {
          console.log(marker.getElement().children[0].children[0]);
          marker
            .getElement()
            .children[0].children[0].addEventListener('mouseenter', (e) => {
              setShowPopup(true);
            });
          marker
            .getElement()
            .children[0].children[0].addEventListener('mouseout', (e) => {
              setShowPopup(false);
            });
        }}
      />
      {showPopup && (
        <Popup
          lnglat={[120, 30]}
          option={{
            closeOnClick: false,
          }}
        >
          <span>这是个信息框</span>
        </Popup>
      )}
    </AMapScene>
  );
};
export default Amap2demo_markerPopup;
