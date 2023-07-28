import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import React, { useEffect, useState } from 'react';
import THREE, { AmbientLight, DirectionalLight, Group } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const gltfSceneMap: Record<string, GLTF> = {};
const gltfPromiseMap: Record<string, Promise<Group>> = {};

export const getGLTFScene = (() => {
  return (url: string) => {
    const promise = new Promise<Group>((resolve, reject) => {
      // 防止 promise 还未完成赋值
      setTimeout(() => {
        const cacheGLTF = gltfSceneMap[url];
        if (cacheGLTF) {
          resolve(cacheGLTF.scene.clone());
          return;
        }
        const getGLTFPromise = gltfPromiseMap[url];
        // @ts-ignore
        if (getGLTFPromise) {
          getGLTFPromise.then(() => {
            resolve(gltfSceneMap[url].scene.clone());
          });
          return;
        }
        const loader = new GLTFLoader();
        gltfPromiseMap[url] = promise;
        loader.load(url, (gltf) => {
          gltfSceneMap[url] = gltf;
          resolve(gltf.scene.clone());
        });
      }, 0);
    });

    return promise;
  };
})();

const data1 = [
  {
    lng: 120.1143242,
    lat: 20.27562376,
    size:  Math.pow(2, 17),
    url: 'https://mdn.alipayobjects.com/huamei_zihk4o/uri/file/as/2/zihk4o/6/mp/RxNN8ocL3KtNSN9F/homePoi/homePoi.gltf',
    label: '潜客: 750',
  }
];

const data2 = [
  {
    lng: 120.1669987,
    lat: 40.27756082,
    size:  Math.pow(2, 17),
    url: 'https://mdn.alipayobjects.com/huamei_zihk4o/uri/file/as/2/zihk4o/6/mp/RxNN8ocL3KtNSN9F/homePoi/homePoi.gltf',
    label: '潜客: 780',
  },
];

const data3 = [

    {
      lng: 60.164324,
      lat: 30.272368,
      size:  Math.pow(2, 17),
      url: 'https://mdn.alipayobjects.com/huamei_iy7sau/uri/file/as/2/iy7sau/6/mp/fP3BH5TMbu1I9Crv/site/site.gltf',
      label: '武林广场',
    },
  ];

export default () => {
  const [scene, setScene] = useState<Scene | undefined>();
  const [data, setData] = useState<any[]>(data1);

  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120.1143242, 30.27562376],
        zoom: 2,
        style: 'dark',
        pitch: 45,
      }),
    });
    scene.registerRenderService(ThreeRender);
    scene.on('loaded', () => {
      setScene(scene);
    });
  }, []);

  useEffect(() => {
    if (!scene) {
      return;
    }
    const threeJSLayer2 = new ThreeLayer({
        enableMultiPassRenderer: false,
        // @ts-ignore
        onAddMeshes: (threeScene: THREE.Scene, layer: ThreeLayer) => {
          threeScene.add(new AmbientLight(0xffffff));
          const sunlight = new DirectionalLight(0xffffff, 0.25);
          sunlight.position.set(0, 80000000, 100000000);
          sunlight.matrixWorldNeedsUpdate = true;
          threeScene.add(sunlight);
  
          Promise.all(
            data3.map(({ url, lng, lat, size }) => {
              return new Promise<void>((resolve) => {
                const loader = new GLTFLoader();
                loader.load(url, (gltf) => {
                  const gltfScene = gltf.scene;
                  layer.adjustMeshToMap(gltfScene);
                  layer.setMeshScale(gltfScene, size, size, size);
                  layer.setObjectLngLat(gltfScene, [lng, lat], 0);
                  // 向场景中添加模型
                  threeScene.add(gltfScene);
                  resolve();
                });
              });
            }),
          ).then(() => {
            // layer.render();
          });
        },
      });
          scene?.addLayer(threeJSLayer2);
    fetch("https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt")
              .then((res) => res.text(
                
              ))
              .then((data) => {
                const layer = new LineLayer({
                    zIndex: -2
                })
                  .source(data, {
                    parser: {
                      type: "csv",
                      x: "lng1",
                      y: "lat1",
                      x1: "lng2",
                      y1: "lat2"
                    }
                  })
                  .size(1)
                  .shape("arc")
                  .color("#FF7C6A")
                  .style({
                    opacity: 0.8,
                    sourceColor: "#f00",
                    targetColor: "#6F19FF"
                  });
                scene.addLayer(layer);
              });
    const threeJSLayer = new ThreeLayer({
      enableMultiPassRenderer: false,
      // @ts-ignore
      onAddMeshes: (threeScene: THREE.Scene, layer: ThreeLayer) => {
        threeScene.add(new AmbientLight(0xffffff));
        const sunlight = new DirectionalLight(0xffffff, 0.25);
        sunlight.position.set(0, 80000000, 100000000);
        sunlight.matrixWorldNeedsUpdate = true;
        threeScene.add(sunlight);

        Promise.all(
          data.map(({ url, lng, lat, size }) => {
            return new Promise<void>((resolve) => {
              const loader = new GLTFLoader();
              loader.load(url, (gltf) => {
                const gltfScene = gltf.scene;
                layer.adjustMeshToMap(gltfScene);
                layer.setMeshScale(gltfScene, size, size, size);
                layer.setObjectLngLat(gltfScene, [lng, lat], 0);
                // 向场景中添加模型
                threeScene.add(gltfScene);
                resolve();
              });
            });
          }),
        ).then(() => {
        //   scene.render();
        });
      },
    });

    scene?.addLayer(threeJSLayer);



    return () => {
        console.log('remove layer');
       scene?.removeLayer(threeJSLayer2);
      scene?.removeLayer(threeJSLayer);
    };
  }, [data, scene]);

  return (
    <div>
      <button onClick={() => setData(data1)}>按钮1</button>
      <button onClick={() => setData(data2)}>按钮2</button>
      <div
        id="map"
        style={{
          height: '500px',
          position: 'relative',
        }}
      />
    </div>
  );
};