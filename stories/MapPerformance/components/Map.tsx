// @ts-ignore
import { Scene } from '@antv/l7';
import { PointLayer } from '@antv/l7-layers';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class PointTest extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [110.19382669582967, 30.258134],
        pitch: 0,
        zoom: 2,
      }),
    });

    // // @ts-ignore
    // var Stats = function() {
    //   function h(a) {
    //     c.appendChild(a.dom);
    //     return a;
    //   }
    //   function k(a) {
    //     for (var d = 0; d < c.children.length; d++)
    //       // @ts-ignore
    //       c.children[d].style.display = d === a ? 'block' : 'none';
    //     l = a;
    //   }
    //   var l = 0,
    //     c = document.createElement('div');
    //   c.style.cssText =
    //     'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
    //   c.addEventListener(
    //     'click',
    //     function(a) {
    //       a.preventDefault();
    //       k(++l % c.children.length);
    //     },
    //     !1,
    //   );
    //   var g = (performance || Date).now(),
    //     e = g,
    //     a = 0,
    //     // @ts-ignore
    //     r = h(new Stats.Panel('FPS', '#0ff', '#002')),
    //     // @ts-ignore
    //     f = h(new Stats.Panel('MS', '#0f0', '#020'));
    //   // @ts-ignore
    //   if (self.performance && self.performance.memory)
    //     // @ts-ignore
    //     var t = h(new Stats.Panel('MB', '#f08', '#201'));
    //   k(0);
    //   return {
    //     REVISION: 16,
    //     dom: c,
    //     addPanel: h,
    //     showPanel: k,
    //     begin: function() {
    //       g = (performance || Date).now();
    //     },
    //     end: function() {
    //       a++;
    //       var c = (performance || Date).now();
    //       f.update(c - g, 200);
    //       // @ts-ignore
    //       if (
    //         c > e + 1e3 &&
    //         (r.update((1e3 * a) / (c - e), 100), (e = c), (a = 0), t)
    //       ) {
    //         // @ts-ignore
    //         var d = performance.memory;
    //         t.update(d.usedJSHeapSize / 1048576, d.jsHeapSizeLimit / 1048576);
    //       }
    //       return c;
    //     },
    //     update: function() {
    //       g = this.end();
    //     },
    //     domElement: c,
    //     setMode: k,
    //   };
    // };
    // // @ts-ignore
    // Stats.Panel = function(h, k, l) {
    //   var c = Infinity,
    //     g = 0,
    //     e = Math.round,
    //     a = e(window.devicePixelRatio || 1),
    //     r = 80 * a,
    //     f = 48 * a,
    //     t = 3 * a,
    //     u = 2 * a,
    //     d = 3 * a,
    //     m = 15 * a,
    //     n = 74 * a,
    //     p = 30 * a,
    //     q = document.createElement('canvas');
    //   q.width = r;
    //   q.height = f;
    //   q.style.cssText = 'width:80px;height:48px';
    //   var b = q.getContext('2d');
    //   b.font = 'bold ' + 9 * a + 'px Helvetica,Arial,sans-serif';
    //   b.textBaseline = 'top';
    //   b.fillStyle = l;
    //   b.fillRect(0, 0, r, f);
    //   b.fillStyle = k;
    //   b.fillText(h, t, u);
    //   b.fillRect(d, m, n, p);
    //   b.fillStyle = l;
    //   b.globalAlpha = 0.9;
    //   b.fillRect(d, m, n, p);
    //   // @ts-ignore
    //   return {
    //     dom: q,
    //     update: function(f, v) {
    //       c = Math.min(c, f);
    //       g = Math.max(g, f);
    //       b.fillStyle = l;
    //       b.globalAlpha = 1;
    //       b.fillRect(0, 0, r, m);
    //       b.fillStyle = k;
    //       b.fillText(e(f) + ' ' + h + ' (' + e(c) + '-' + e(g) + ')', t, u);
    //       // @ts-ignore
    //       b.drawImage(q, d + a, m, n - a, p, d, m, n - a, p);
    //       b.fillRect(d + n - a, m, a, p);
    //       b.fillStyle = l;
    //       b.globalAlpha = 0.9;
    //       b.fillRect(d + n - a, m, a, e((1 - f / v) * p));
    //     },
    //   };
    // };
    // 'object' === typeof module && (module.exports = Stats);
    // // @ts-ignore
    // var stats = new Stats();
    // document.body.appendChild(stats.dom);

    // let address = 'https://gw.alipayobjects.com/os/bmw-prod/e76d89f4-aa69-4974-90b7-b236904a43b1.json' // 100
    // let address = 'https://gw.alipayobjects.com/os/bmw-prod/edc8219a-b095-4451-98e9-3e387e290087.json' // 10000
    // let address = 'https://gw.alipayobjects.com/os/bmw-prod/2c37f08b-3fe6-4c68-a699-dc15cfc217f1.json' // 50000
    let address =
      'https://gw.alipayobjects.com/os/bmw-prod/8adff753-64e6-4ffa-9e7b-1f3dc6f4fd76.json'; // 100000
    fetch(address)
      .then((res) => res.json())
      .then((data) => {
        const layer = new PointLayer()
          .source(data, {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat',
            },
          })
          .size(10)
          .color('#f00')
          .shape('circle')
          .style({
            opacity: 1.0,
          })
          .select(true)
          // .animate(true)
          // .active(true);

        scene.on('loaded', () => {
          scene.addLayer(layer);
          // @ts-ignore
          // layer.layerService.startAnimate2(stats)

          // ILayerService
          // ---
          // startAnimate2(state: any): void;
          // ---
          // LayerService
          // ---
          // private stats: any;
          // ---
          // @ts-ignore
          // public startAnimate2(stats) {
          //   // @ts-ignore
          //   this.stats = stats
          //   if (this.animateInstanceCount++ === 0) {
          //     this.clock.start();
          //     this.runRender();
          //   }
          // }
          // public runRender() {
          //   // @ts-ignore
          //   this.stats.update()
          //   this.renderLayers();
          //   this.layerRenderID = requestAnimationFrame(this.runRender.bind(this));
          // }
        });
      });
  }

  public render() {
    return (
      <div
        id="map"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      ></div>
    );
  }
}
