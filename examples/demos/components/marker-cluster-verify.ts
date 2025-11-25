import { Marker, MarkerLayer, Popup } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const markerClusterVerify: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [105.79, 30],
      zoom: 3,
    },
  });

  // create a layer with markerOption defaults to verify defaults application
  const markerLayer = new MarkerLayer({
    cluster: true,
    markerOption: {
      color: '#ff5722',
      style: { width: '26px', height: '26px', borderRadius: '50%' },
      className: 'demo-marker-default',
    },
  });

  // sample points: three clustered points and one isolated point
  const coords = [
    [105.79, 30.0],
    [105.795, 30.002],
    [105.788, 29.998],
    // isolated single-point far away
    [110.0, 35.0],
  ];

  const markers: Marker[] = [];

  coords.forEach((c, i) => {
    const m = new Marker({
      // do not pass element so markerOption defaults get applied
      extData: { id: `m-${i}`, idx: i },
    } as any).setLnglat({ lng: c[0], lat: c[1] });

    // attach a simple listener to validate event binding and show a popup
    m.on('click', (ev: any) => {
      console.log('[marker click]', i, ev.data, 'lngLat:', ev.lngLat);
      try {
        const popup = new Popup({
          lngLat: ev.lngLat,
          html: `<div style="padding:6px">id: ${ev.data?.id || 'unknown'}<br/>idx: ${ev.data?.idx}</div>`,
          className: `marker-popup-${i}`,
        });
        m.setPopup(popup);
        m.openPopup();
      } catch (e) {
        // ignore popup errors in environments without Popup implementation
        void e;
      }
    });

    markers.push(m);
    markerLayer.addMarker(m);
  });

  scene.addMarkerLayer(markerLayer);
  // layer-level event for cluster markers
  markerLayer.on &&
    markerLayer.on('marker:click', (ev: any) => {
      console.log('[layer marker click]', ev && ev.data, ev && ev.lngLat);
      try {
        const data = ev && ev.data;
        const popup = new Popup({
          lngLat: ev && ev.lngLat,
          html: `<div style="padding:6px">cluster: ${JSON.stringify(data)}</div>`,
        });
        ev.marker && ev.marker.setPopup && ev.marker.setPopup(popup);
        ev.marker && ev.marker.openPopup && ev.marker.openPopup();
      } catch (e) {
        void e;
      }
    });

  // GUI helpers to verify behaviors
  markerClusterVerify.extendGUI = (gui) => {
    return [
      gui.add(
        {
          setZoom: () => scene.setZoom(6),
          hideFirst: () => {
            const m = markers[0];
            m.hide();
          },
          showFirst: () => {
            const m = markers[0];
            m.show();
          },
          removeFirst: () => {
            const m = markers[0];
            markerLayer.removeMarker(m);
          },
          addNew: () => {
            const i = markers.length;
            const nm = new Marker({ extData: { id: `m-${i}` } } as any).setLnglat({
              lng: 105.79 + Math.random() * 0.01,
              lat: 30 + Math.random() * 0.01,
            });
            nm.on('click', (e: any) => console.log('[new marker click]', e.data));
            markers.push(nm);
            markerLayer.addMarker(nm);
          },
        },
        'setZoom',
      ),
    ];
  };

  scene.render();

  // Debug helper: wait until cluster markers are rendered, then attach raw DOM listeners
  const attachDomListeners = () => {
    const items = markerLayer.getMarkers();
    if (!items || items.length === 0) return false;
    items.forEach((mm: any, idx: number) => {
      try {
        const el = mm.getElement && mm.getElement();
        if (el) {
          // avoid duplicate listeners
          if (!(el as any).__verify_click_attached) {
            el.addEventListener('click', () => {
              console.log('[DOM click]', idx, mm.getExtData && mm.getExtData());
            });
            (el as any).__verify_click_attached = true;
          }
        }
      } catch (e) {
        void e;
      }
    });
    return true;
  };

  const maxTry = 20;
  let tryCount = 0;
  const interval = setInterval(() => {
    tryCount += 1;
    const ok = attachDomListeners();
    if (ok || tryCount >= maxTry) {
      clearInterval(interval);
    }
  }, 300);

  return scene;
};
