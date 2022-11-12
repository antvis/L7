---
title: threejs 引擎兼容
order: 3
---

<embed src="@/docs/common/style.md"></embed>

## 简介

1、L7 支持允许用户接入第三方的渲染引擎对地图场景进行开发，threejs 作为当前最广泛使用的通用 3D 渲染引擎，L7 将其集成后可以满足
用户自定义开发的需求，可以让 L7 覆盖更多的应用场景。

2、目前 L7Three 模块为了抹平不同地图底图之间的差异，提供了一些兼容方法，如 setMeshScale 方法，通过这些方法用户可以在不同的底图
环境中使用同一套代码。

3、L7 提供的适配方法只负责 threejs 世界坐标到不同地图底图坐标的转化、 gl 上下文的共享以及渲染帧的同步，其余关于 3D 场景内容的搭建
与普通 threejs 应用的开发没有任何区别。

4、L7 本身并没有集成 threejs，所以用于在使用 L7Three 模块的时候需要独立安装 threejs。

✨ 目前 L7 官方提供的 threejs 兼容是根据 0.115.0 版本进行开发的，使用其他版本 threejs 可能会存在兼容问题

## 使用

```javascript
// 1、引入对应模块
import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as THREE from 'three';
...
// 2、注册服务
scene.registerRenderService(ThreeRender);
...
// 3、构建 threejs 图层对象并在其中添加 threejs 构建的网格对象
const threeJSLayer = new ThreeLayer({
  onAddMeshes: (threeScene: THREE.Scene, layer: ThreeLayer) => {
    threeScene.add(new THREE.AmbientLight(0xffffff));

    const sunlight = new THREE.DirectionalLight(0xffffff, 0.25);
    sunlight.position.set(0, 80000000, 100000000);
    sunlight.matrixWorldNeedsUpdate = true;
    threeScene.add(sunlight);

    let center = scene.getCenter();

    let cubeGeometry = new THREE.BoxBufferGeometry(10000, 10000, 10000);
    let cubeMaterial = new THREE.MeshNormalMaterial();
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    layer.setObjectLngLat(cube, [center.lng + 0.05, center.lat], 0);
    threeScene.add(cube);
  },
})
.source(data)
.animate(true);

// 4、添加 threejs 图层对象
scene.addLayer(threeJSLayer);

```

L7 将 threejs 的引用封装成一个特殊的图层对象，在使用上与其他的图层相同。

## 构造函数 new ThreeLayer

### onAddMeshes

该方法接受两个参数 threeScene: THREE.Scene, layer: ThreeLayer

- threeScene: 这是普通的 threejs 场景对象
- layer: 这是 L7 提供的 threeLayer 对象，上面挂载了 threejs 空间适配到地图空间所需要的方法

## ThreeLayer

用户新建的图层对象，同时也会在 onAddMesh 方法的第二个参数返回。

以下是挂载在 ThreeLayer 实例上的适配方法。

### getModelMatrix(lnglat, altitude, rotation, scale): Matrix

- lnglat: [number, number] 经纬度
- altitude: number = 0 相对高度
- rotation: [number, number, number] = [0, 0, 0] 旋转角度
- scale: [number, number, number] = [1, 1, 1] 缩放比例

用户可以通过该方法计算在对应经纬度点位、相对高度、旋转角度和缩放的模型矩阵
该方法的返回值是 THREE.Matrix4 类型的矩阵

### applyObjectLngLat(object, lnglat, altibute): void

- object: Object3D threejs 对象
- lnglat: ILngLat[number, number] 经纬度
- altitude = 0 相对高度

用户可以通过该方法将 object 对象从当前位置向指定位置移动（地图经纬度坐标）

### setObjectLngLat(object, lnglat, altibute): void

- object: Object3D threejs 对象
- lnglat: ILngLat[number, number] 经纬度
- altitude = 0 相对高度

用户可以通过该方法设置 object 对象的位置（地图经纬度坐标）

### lnglatToCoord(lnglat): [number, number]

- lnglat: ILngLat[number, number] 经纬度

用户可以通过该方法将经纬度坐标转化成 threejs 世界坐标

### adjustMeshToMap(object): void

- object: Object3D threejs 对象

用户在添加 threejs 对象的前可以通过该方法调整 3D 对象的姿态，保证添加对象能正确显示

✨ 在 threejs 世界坐标中，默认的上方向为 Y 轴正方向，而在地图坐标中，默认的上方向为 Z 轴正方向

✨ 用户不一定使用该方法调整物体的姿态，也可以自己实现

### setMeshScale(object, x, y, z): void

- object: Object3D threejs 对象
- x: number = 1 x 轴方向的缩放比例
- y: number = 1 y 轴方向的缩放比例
- z: number = 1 z 轴方向的缩放比例

用户可以通过该方法设置 threejs 对象缩放

✨ 其实通过设置 threejs 对象的 scale 属性一样能达到同样的效果，但是由于 mapbox 在计算模型矩阵的时候引入了特殊计算，所以无法直接设置 scale 属性进行缩放

✨ 同样的，可以直接修改 threejs 的 position、rotation 等调整 3D 对象的姿态

### addAnimateMixer(mixer): void

- mixer: AnimationMixer threejs 的动画混合器

用户通过该方法管理加载模型的动画

### getRenderCamera(): THREE.Camera

返回根据当前地图场景参数下对应的 THREEJS 相机

## 加载模型

用户可以使用 threejs 提供的能力加载其支持的任意模型

### 简单案例

✨ 以加载 gltf 模型为例

```javascript
// 1、引入加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
...
const threeJSLayer = new ThreeLayer({
  onAddMeshes: (threeScene: THREE.Scene, layer: ThreeLayer) => {
    ...
    // 2、构建加载器
    const loader = new GLTFLoader();
    // 3、加载模型
    loader.load('https://gw.alipayobjects.com/os/bmw-prod/3ca0a546-92d8-4ba0-a89c-017c218d5bea.gltf',
    (gltf) => {
      const model = gltf.scene;
      layer.adjustMeshToMap(model);
      layer.setMeshScale(model, 1000, 1000, 1000);
      layer.setObjectLngLat( model, [center.lng, center.lat], 0 );

      // 4、播放模型上绑定的动画
      const animations = gltf.animations;
      if (animations && animations.length) {
        const mixer = new THREE.AnimationMixer(model);
        const animation = animations[2];
        const action = mixer.clipAction(animation);
        action.play();
        // 5、由 L7 控制模型动画的播放
        layer.addAnimateMixer(mixer);
      }
    })
  }
}).source(data)
.animate(true) // 若需要播放模型动画，请开启动画模式（或者场景中已经存在开启动画的图层）

```
