---
title: Control
order: 1
---

The map control refers to hovering around the map, and you can perform operations on the map, layers and other elements.**information presentation**or**interaction**s component.

![](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*zgFeTocc-_oAAAAAAAAAAAAAARQnAQ)

## use

```ts
import { Scene, Zoom } from '@antv/l7';

const scene = new Scene({
  // ...
});

scene.on('loaded', () => {
  //Instantiate the Zoom control, you can pass in the control configuration in the constructor
  const zoom = new Zoom({
    position: 'leftbottom',
    className: 'my-test-class',
  });

  //Add the instantiated control to L7
  scene.addControl(zoom);
});
```

## Update configuration

After the control is instantiated, if you need to update the configuration, you can call the control instance's`setOptions`method, and pass in the configuration object that needs to be updated.

```ts
const zoom = new Zoom({
  position: 'leftbottom',
});

const onPositionChange = () => {
  // Pass in the configuration object that needs to be updated through setOptions
  zoom.setOptions({
    position: 'topright',
  });
};
```

## slot

Currently the controls in L7 support inserting into the map**Upper left, lower left, upper right, lower right, upper, left, lower, right**Eight position slots or user-defined`DOM`, and support between multiple controls in the same map slot**Horizontal**and**portrait**arrangement.

When initializing all control classes, you can pass in`position`Parameters to set the corresponding slot and arrangement of the control.

![](https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*BfG1TI231ysAAAAAAAAAAAAAARQnAQ)

## Configuration

<embed src="@/docs/api/common/control/api.en.md"></embed>

## method

<embed src="@/docs/api/common/control/method.en.md"></embed>

## event

<embed src="@/docs/api/common/control/event.en.md"></embed>
