---
title: DebugService
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

L7 provides external debugging services in the form of debugService. Through debugService, users can obtain some information that is helpful for performance monitoring.

### serEnable(enable: boolean)

Users can enable monitoring through the methods provided by debugService during scene initialization.

```js
// Monitoring can be turned on during scene initialization
const scene = new Scene({
  debug: true, //default is false
});

// Monitoring can be controlled individually through debugService
const debugService = scene.getDebugService();
debugService.serEnable(true); // Enable monitoring
```

### getLog(field: undefined | string | string\[]): ILog\[] | Log | undefined

Users obtain logs through the getLog method. By passing in different parameters, users can accurately obtain the log content they need.

```js
// Get map initialization log
debugService.getLog('map'); // map is a fixed value

// When obtaining the creation log of the layer, in order to obtain all the data, it needs to be obtained after the layer creation is completed.
layer.on('initiated', () => {
  debugService.getLog(layer.id); // Get a single layer creation log
});

layerAllLoad([pointLayer1, pointLayer2], () => {
  // layerAllLoad implements monitoring by itself
  debugService.getLog([pointLayer1.id, pointLayer2.id]); // Get multiple layer creation logs
});

// Get all logs
debugService.getLog();
```

- The following log information can be obtained through the getLog method

```js
const enum IDebugLog {
  MapInitStart = 'mapInitStart', // Map initialization time

  LayerInitStart = 'layerInitStart', //Layer initialization start time
  LayerInitEnd = 'layerInitEnd', //Layer initialization end time

  SourceInitStart = 'sourceInitStart', // source initialization start time
  SourceInitEnd = 'sourceInitEnd', // souce initialization end time

  // scale: perform scale mapping on the data => convert the data from the definition domain to the value domain
  // Such as: layer.size('v', [1, 10]);
  //Map the result of size to between 1 and 10 according to the domain represented by field v
  ScaleInitStart = 'scaleInitStart', // scale initialization start time
  ScaleInitEnd = 'scaleInitEnd', // scale initialization end time

  //mapping: construct rendering data
  MappingStart = 'mappingStart', // mapping initialization start time
  MappingEnd = 'mappingEnd', // mapping initialization end time

  // build model: build program objects used for rendering, build meshes, textures, etc.
  BuildModelStart = 'buildModelStart',// souce initialization start time
  BuildModelEnd = 'buildModelEnd', // souce initialization end time
}
```

### renderDebug(enable: boolean)

debugService provides a convenient method to monitor the rendering time of a layer, which is enabled through renderDebug.

### on(name: string, options: any)

debugService supports event monitoring and is commonly used to monitor rendering.

```js
debugService.on('renderEnd', renderInfo => {
  const {
    renderUid, // The unique number of the current frame rendering
    renderStart, // current frame rendering start time
    renderEnd, // current frame rendering end time
    renderDuration // current frame rendering time
  } = renderInfo;
  ...
}
```

### off(name: string, func: Function)

debugService event cancels listening.
