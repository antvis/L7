---
title: threejs 引擎兼容
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

1\. L7 supports allowing users to access third-party rendering engines to develop map scenes. ThreeJS is currently the most widely used general-purpose 3D rendering engine. L7 can meet the requirements after integrating it.
User-defined development needs allow L7 to cover more application scenarios.

2\. Currently, in order to smooth out the differences between different map basemaps, the L7Three module provides some compatibility methods, such as the setMeshScale method. Through these methods, users can
environment using the same set of code.

3\. The adaptation method provided by L7 is only responsible for the conversion of threejs world coordinates to different map basemap coordinates, the sharing of gl context and the synchronization of rendering frames. The rest is related to the construction of 3D scene content.
There is no difference from the development of ordinary threejs applications.

4\. L7 itself does not integrate threejs, so you need to install threejs independently when using the L7Three module.

✨ Currently, the threejs compatibility officially provided by L7 is developed based on version 0.115.0. There may be compatibility issues when using other versions of threejs.

## use

```javascript
// 1. Introduce the corresponding module
import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as THREE from 'three';
...
// 2. Registration service
scene.registerRenderService(ThreeRender);
...
// 3. Build the threejs layer object and add the grid object built by threejs to it.
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

// 4. Add threejs layer object
scene.addLayer(threeJSLayer);
```

L7 encapsulates the reference of threejs into a special layer object, which is used the same as other layers.

## Constructor new ThreeLayer

### onAddMeshes

This method accepts two parameters threeScene: THREE.Scene, layer: ThreeLayer

- threeScene: This is a normal threejs scene object
- layer: This is the threeLayer object provided by L7, which mounts the methods needed to adapt the threejs space to the map space.

## ThreeLayer

The layer object created by the user will also be returned in the second parameter of the onAddMesh method.

The following is the adaptation method mounted on the ThreeLayer instance.

### getModelMatrix(lnglat, altitude, rotation, scale): Matrix

- lnglat: \[number, number] latitude and longitude
- altitude: number = 0 relative altitude
- rotation: \[number, number, number] = \[0, 0, 0] rotation angle
- scale: \[number, number, number] = \[1, 1, 1] scaling

Users can use this method to calculate the model matrix at the corresponding longitude and latitude point, relative height, rotation angle and scaling.
The return value of this method is a matrix of type THREE.Matrix4

### applyObjectLngLat(object, lnglat, altibute): void

- object: Object3D threejs object
- lnglat: ILngLat\[number, number] latitude and longitude
- altitude = 0 relative altitude

The user can use this method to move the object object from the current location to the specified location (map longitude and latitude coordinates)

### setObjectLngLat(object, lnglat, altibute): void

- object: Object3D threejs object
- lnglat: ILngLat\[number, number] latitude and longitude
- altitude = 0 relative altitude

The user can set the location of the object object (map longitude and latitude coordinates) through this method

### lnglatToCoord(lnglat): \[number, number]

- lnglat: ILngLat\[number, number] latitude and longitude

Users can use this method to convert latitude and longitude coordinates into threejs world coordinates

### adjustMeshToMap(object): void

- object: Object3D threejs object

Users can use this method to adjust the posture of the 3D object before adding the threejs object to ensure that the added object can be displayed correctly.

✨ In threejs world coordinates, the default upward direction is the positive Y-axis direction, while in map coordinates, the default upward direction is the positive Z-axis direction.

✨ Users do not necessarily use this method to adjust the posture of objects, they can also implement it themselves

### setMeshScale(object, x, y, z): void

- object: Object3D threejs object
- x: number = 1 Scaling ratio in x-axis direction
- y: number = 1 Scaling ratio in the y-axis direction
- z: number = 1 Scaling ratio in z-axis direction

Users can set the threejs object zoom through this method

✨ In fact, the same effect can be achieved by setting the scale attribute of the threejs object. However, because mapbox introduces special calculations when calculating the model matrix, it cannot directly set the scale attribute for scaling.

✨ Similarly, you can directly modify the position, rotation, etc. of threejs to adjust the posture of the 3D object.

### addAnimateMixer(mixer): void

- mixer: AnimationMixer animation mixer for threejs

The user manages the animation of loading the model through this method.

### getRenderCamera(): THREE.Camera

Returns the corresponding THREEJS camera based on the current map scene parameters.

## Load model

Users can use the capabilities provided by threejs to load any model it supports.

### Simple case

✨ Take loading gltf model as an example

```javascript
// 1. Introduce loader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
...
const threeJSLayer = new ThreeLayer({
  onAddMeshes: (threeScene: THREE.Scene, layer: ThreeLayer) => {
    ...
    // 2. Build the loader
    const loader = new GLTFLoader();
    // 3. Load model
    loader.load('https://gw.alipayobjects.com/os/bmw-prod/3ca0a546-92d8-4ba0-a89c-017c218d5bea.gltf',
    (gltf) => {
      const model = gltf.scene;
      layer.adjustMeshToMap(model);
      layer.setMeshScale(model, 1000, 1000, 1000);
      layer.setObjectLngLat( model, [center.lng, center.lat], 0 );

      // 4. Play the animation bound to the model
      const animations = gltf.animations;
      if (animations && animations.length) {
        const mixer = new THREE.AnimationMixer(model);
        const animation = animations[2];
        const action = mixer.clipAction(animation);
        action.play();
        // 5. L7 controls the playback of model animation
        layer.addAnimateMixer(mixer);
      }
    })
  }
}).source(data)
.animate(true) // If you need to play model animation, please turn on the animation mode (or there is already a layer with animation turned on in the scene)
```
