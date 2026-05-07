---
title: 场景 Scene
description: 地图场景初始
keywords: 地图 Scene
order: 0
redirect_from:
  - /zh/docs/api
---

<embed src="@/docs/api/common/style.md"></embed>

## Introduction

scene object`scene`It is a global object that contains maps, map controls, components, and loaded resources. It is passed`scene`Scene object, we can get everything we need to operate the map.

<div>
  <div style="width:40%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*3wMCR7vIlCwAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

## options

### id

<description> _string | HTMLElement_ **required** </description>

You need to pass in the dom container or container id.

### map

<description> MapInstance **required** </description>

The map instance can be obtained through the scene map attribute.

```javascript
const map = scene.map;
```

In order to unify the interface differences between different basemaps`L7`exist`Scene`layer pair`map`The methods have been unified, so some map operation methods can be passed`Scene`Called so that consistent performance can be ensured when switching between different basemaps.

Sample code

```javascript
const scene = new L7.Scene({
  id: 'map',
  map: new L7.GaodeMap({
    style: 'dark',
    center: [110.770672, 34.159869],
    pitch: 45,
  }),
});
```

### logoPosition

<description> _string_ **Optional** _default: 'bottomleft'_ </description>

`L7` provided by default `Logo` The display position can be configured, and the default is the lower left corner.

- bottomright
- topright
- bottomleft
- topleft
- topcenter
- bottomcenter
- leftcenter
- rightcenter

### logoVisible Is the logo visible?

<description> _boolean_ **Optional** _default: true_ </description>

Configuration `L7` of `Logo` Whether to display or not, it is displayed by default.

### antialias Whether to enable anti-aliasing

<description> _boolean_ **Optional** _default: true_ </description>

Whether to enable anti-aliasing.

### stencil whether to enable cutting

<description> _boolean_ **Optional** _default: true_ </description>

Whether to enable stencil. Layer `Mask` masking capabilities as well as vector tiles require this configuration to be enabled.

🌟 Supported from version v2.7.2.

### preserveDrawingBuffer

<description> _boolean_ **Optional** _default: false_ </description>

Whether to retain buffer data. When set to `true`, map images can be exported via `canvas.toDataURL()`.

### renderer Renderer

<description> _'regl' | 'device'_ **Optional** _default: 'device'_ </description>

Specifies the renderer type. `regl` is the legacy renderer, `device` is the new renderer (based on `@antv/g-device-api`), which is used by default.

```javascript
const scene = new Scene({
  id: 'map',
  map: new Map({}),
  renderer: 'device', // or 'regl'
});
```

### animate Whether to enable animation

<description> _boolean_ **Optional** _default: undefined_ </description>

Whether to enable animation rendering.

### debug Whether to enable debugging

<description> _boolean_ **Optional** _default: false_ </description>

Whether to enable debug mode, which will output debugging information when enabled.

### pickBufferScale Pick buffer scale

<description> _number_ **Optional** _default: 1.0_ </description>

Sets the scale ratio of the pixel picking buffer.

### fitBoundsOptions Fit bounds options

<description> _object_ **Optional** </description>

Default options configuration when calling the `fitBounds` method, includes `animate` and other parameters.

## Layer method

### addLayer(layer): void Add layer object

Add the layer to`Scene`in the scene.

Parameters:

- `layer`layer object

```javascript
scene.addLayer(layer);
```

### getLayer(id: string): ILayer gets the corresponding layer object

Get the corresponding layer.

```javascript
scene.getLayer('layerID');
```

### getLayers(): ILayer\[] Get all map layers

Get all map layers.

```javascript
scene.getLayers();
```

### getLayerByName(name: string): ILayer Gets the layer based on the layer name

Get the layer based on its name.

- `name`The layer is configured during initialization.`name`。

```javascript
scene.getLayerByName(name);
```

### removeLayer(layer: ILayer): void remove layer layer

Remove`layer`layers.

```javascript
scene.removeLayer(layer);
```

🌟 The layer will be destroyed when removed.

### removeAllLayer(): Promise\<void\> removes all layer objects

Remove all layer objects.

```javascript
await scene.removeAllLayer();
```

🌟 The layer will be destroyed when removed.

### render(): void Force re-render

Manually trigger a scene re-render.

```javascript
scene.render();
```

### setEnableRender(flag: boolean): void Enable/disable rendering

Control whether layer rendering updates are allowed. When set to `false`, layer rendering will be paused.

```javascript
scene.setEnableRender(false); // Pause rendering
scene.setEnableRender(true); // Resume rendering
```

### getPickedLayer(): string Get the currently picked layer

Gets the ID of the layer currently being picked (hover/click).

```javascript
const layerId = scene.getPickedLayer();
```

## Control component methods

### addControl(ctl: IControl): void Add component control

Add component controls.

- `crl`User-created control object.

```javascript
scene.addControl(ctl);
```

### removeControl(ctr: IControl): void Removes the component control added by the user

Remove user-added component controls.

- `ctl`User-created control object.

```javascript
scene.removeControl(ctl);
```

### getControlByName(name: string): IControl gets the control based on its name

Get the control based on its name.

```javascript
const zoomControl = new Zoom({
  // zoom control
  name: 'z1', // The name of the control passed in by the user (or not passed in, the default name of the control is zoom)
  position: 'topright',
});

scene.getControlByName('z1');
```

## bubble method

### addPopup(popup: Popup): void Add bubbles

Add bubble objects to the scene. Bubbles are used to display user-defined information.

```javascript
scene.addPopup(popup);
```

### removePopup(popup: Popup): void removes bubbles

Remove the bubble object from the scene

```javascript
scene.removePopup(popup);
```

## Marking method

### addMarker(maker: IMarker): void Add mark

Add marker objects to the scene,`Marker`Instances are freely controlled by the user`DOM`。

- `maker`User created`Marker`Example.

```javascript
const marker = new Marker({
  element: el,
}).setLnglat({ lng: nodes[i].x * 1, lat: nodes[i].y });
scene.addMarker(marker);
```

### addMarkerLayer(layer: IMarkerLayer): void Add Marker to manage layers uniformly

When the user needs to add many`Marker`Instances can be used to facilitate management`MarkerLayer`Unified management of objects.

- `layer`Mark layer objects.

```javascript
const markerLayer = new MarkerLayer();
scene.addMarkerLayer(markerLayer);
```

### removeMarkerLayer(layer: IMarkerLayer): void removes the label layer

Remove the label layer.

- `layer`Mark layer objects.

```javascript
scene.removeMarkerLayer(markerLayer);
```

### removeAllMarkers(): void removes all label objects in the scene

Removes all label objects from the scene.

```javascript
scene.removeAllMarkers();
```

### removeAllMakers(): void ⚠️ Deprecated

> ⚠️ This method is deprecated, please use `removeAllMarkers()` instead.

## static method

Static methods are called through the Scene class, not the scene instance

### addProtocol

Add a custom data protocol and set up a custom load tile function that will be called when data starting with a custom URL pattern is used.

- protocol protocol name
- handler data processing callback function
  - requestParameters: RequestParameters,
    - url tile URL, carrying tile row and column numbers x, y, z
  - callback: ResponseCallback<any>) => Cancelable
    - Cancelable： {
      cancel: () => void;
      };

#### Custom function

```ts
Scene.addProtocol('custom', (params, callback) => {
  fetch(`https://${params.url.split('://')[1]}`)
    .then((t) => {
      if (t.status == 200) {
        t.arrayBuffer().then((arr) => {
          callback(null, arr, null, null);
        });
      } else {
        callback(new Error(`Tile fetch error: ${t.statusText}`));
      }
    })
    .catch((e) => {
      callback(new Error(e));
    });
  return { cancel: () => {} };
});
// the following is an example of a way to return an error when trying to load a tile
Scene.addProtocol('custom2', (params, callback) => {
  callback(new Error('someErrorMessage'));
  return { cancel: () => {} };
});
```

#### Load PMTiles

```ts
import * as pmtiles from 'pmtiles';
const protocol = new pmtiles.Protocol();
const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [11.2438, 43.7799],
    zoom: 12,
  }),
});

scene.addProtocol('pmtiles', protocol.tile);
const source = new Source(
  'pmtiles://https://mdn.alipayobjects.com/afts/file/A*HYvHSZ-wQmIAAAAAAAAAAAAADrd2AQ/protomaps(vector)ODbL_firenze.bin',
  {
    parser: {
      type: 'mvt',
      tileSize: 256,
      maxZoom: 14,
      extent: [-180, -85.051129, 179, 85.051129],
    },
  },
);
```

### removeProtocol

Delete previously added protocols

- name: protocol name

```ts
scene.remove Protocol('mbtiles',protocol.tile);
```

## map method

### getZoom(): number Get the zoom level

Get the current zoom level.

```javascript
scene.getZoom();
```

### getCenter(): ILngLat gets the map center

Get map center point

```javascript
interface ILngLat {
  lng: number;
  lat: number;
}

scene.getCenter();
```

### getSize(): \[number, number] Get the map container size

Get the map container size, width, height.

```javascript
scene.getSize();
```

### getPitch(): number Get the map tilt angle

Get the map elevation angle.

```javascript
scene.getPitch();
```

### getContainer(): HTMLElement | null Get the map container

Get the map container.

```javascript
scene.getContainer();
```

### setMapStyle(style: string): void Set map style

parameter`style`The parameter is a string, and you can select the built-in map style. The specific style format is consistent with the setting method of each base map.

`L7`There are three built-in map styles:`AMAP`and`MapBox`All applicable.

- light
- dark
- normal

Method to set the map basemap style.

```javascript
//Shortcut name setting
scene.setMapStyle('light');

// mapbox theme settings
scene.setMapStyle('mapbox://styles/mapbox/streets-v11');

// AMap
scene.setMapStyle('amap://styles/2a09079c3daac9420ee53b67307a8006?isPublic=true');
```

### setCenter(center: ICenter, option?: ICameraOptions): void Set the map center point

Set the map center point coordinates.`L7`provided`setCenter`method, allowing the user to dynamically set the center point of the map, and also allows the optional`options`Property settings offset.

```js
type ICenter = [number, number];
interface ICameraOptions {
  padding:
    | number
    | [number, number, number, number]
    | {
        top?: number,
        bottom?: number,
        right?: number,
        left?: number,
      };
}

scene.setCenter([lng, lat]);
scene.setCenter([lng, lat], {
  padding: {
    top: 100,
  },
});
```

🌟`padding`Parameters support the following three value transfer methods. The unit of the value is`px`, indicating the offset distance between the center point of the map and the edge of the container.

```javascript
export interface ICameraOptions {
  padding:
    | number
    | [number, number, number, number]
    | {
        top?: number,
        bottom?: number,
        right?: number,
        left?: number,
      };
}
```

[Online case](/examples/point/bubble#point)

### setZoomAndCenter(zoom: number, center: ICenter): void Set the map zoom level and center point

Set map level and center.

```javascript
type ICenter = [number, number];
scene.setZoomAndCenter(zoom, center);
```

### setZoom(zoom: number): void Set the map zoom level

Set map zoom level

```javascript
scene.setZoom(10);
```

### setRotation(rotation: number): void Set map rotation

Set the clockwise rotation angle of the map. The rotation origin is the center point of the map container. The value range is \[0-360].

```javascript
scene.setRotation(rotation);
```

### zoomIn(); void Zoom the map one level

The map is zoomed in one level.

```javascript
scene.zoomIn();
```

### zoomOut(): void Zoom out one level of the map

The map shrinks one level.

```javascript
scene.zoomOut();
```

### panTo(lnglat: ILngLat): void map movement

Pan the map to the specified latitude and longitude location.

```javascript
type ILngLat = [number, number];
scene.panTo(LngLat);
```

### panBy(x: number, y: number): void map pan

Moves the map in pixels in the X and Y directions.

- `x`Moving pixels horizontally to the right is the positive direction.
- `y`Move pixels vertically downward in the positive direction.

```javascript
scene.panBy(x, y);
```

### setPitch(pitch: number): void Set the map tilt angle

Set the map tilt angle.

```javascript
scene.setPitch(pitch);
```

### setMapStatus(statusOption: IStatusOptions): void Set map status

Used to set some interactive configurations of the map.

```javascript
interface IStatusOptions {
  showIndoorMap: boolean;
  resizeEnable: boolean;
  dragEnable: boolean;
  keyboardEnable: boolean;
  doubleClickZoom: boolean;
  zoomEnable: boolean;
  rotateEnable: boolean;
}

scene.setMapStatus({ dragEnable: false });
```

### fitBounds(bound: IBounds, options?: IOptions): void Set the map zoom range

The map is zoomed to a certain range.

- `bound`Represents the latitude and longitude range \[\[minlng,minlat],\[maxlng,maxlat]].
- `options`User input, override`animate`Direct configuration, override`Scene`Incoming configuration items.

```javascript
type IBounds = [[number, number], [number, number]];
interface IOptions {
  [key]: any;
  animate: boolean;
}

scene.fitBounds([
  [112, 32],
  [114, 35],
]);
```

### containerToLngLat(point: IPoint): ILngLat canvas coordinates converted to latitude and longitude

Convert canvas coordinates to latitude and longitude coordinates

```javascript
type IPoint = [number, number];
interface ILngLat {
  lng: number;
  lat: number;
}

scene.containerToLngLat([10, 10]);
```

### lngLatToContainer(lnglat: ILngLat): IPoint latitude and longitude converted to canvas coordinates

Convert latitude and longitude coordinates to canvas coordinates.

```javascript
type ILngLat = [number, number];
interface IPoint {
  x: number;
  y: number;
}

scene.lngLatToContainer([120, 10]);
```

### pixelToLngLat(pixel: IPoint): ILngLat pixel coordinates converted to longitude and latitude

The map pixel coordinates are converted into longitude and latitude coordinates, and the pixel coordinates are the distance between a point on the map and the upper left corner of the container.

```javascript
type IPoint = [number, number];
interface ILngLat {
  lng: number;
  lat: number;
}
scene.pixelToLngLat([10, 10]);
```

### lngLatToPixel(lnglat: ILngLat): IPoint longitude and latitude to pixel coordinates

Convert latitude and longitude coordinates to pixel coordinates.

```javascript
type ILngLat = [number, number];
interface IPoint {
  x: number;
  y: number;
}
scene.lngLatToPixel([120, 10]);
```

### exportMap(type?: IImage): string export

Exporting a map currently only supports the export of visualization layers and does not support the export of basemaps.

```javascript
type IImage = 'png' | 'jpg';
scene.exportMap('png');
```

### exportPng(type?: 'png' | 'jpg'): string Export image

Alias method for `exportMap`, exports the map as an image.

```javascript
scene.exportPng('png'); // Equivalent to scene.exportMap('png')
scene.exportPng('jpg'); // Equivalent to scene.exportMap('jpg')
```

### setBgColor(color: string): void Set background color

Sets the scene background color.

```javascript
scene.setBgColor('#000000');
```

### registerPostProcessingPass(constructor: any, name: string): void Register post-processing pass

Registers a post-processing effect pass, used to implement post-processing effects such as Bloom, color correction, etc.

```javascript
import { Scene, PostProcessingPass } from '@antv/l7';

scene.registerPostProcessingPass(PostProcessingPass, 'bloom');
```

### enableShaderPick(): void Enable shader picking

Enables shader picking mode.

```javascript
scene.enableShaderPick();
```

### disableShaderPick(): void Disable shader picking

Disables shader picking mode.

```javascript
scene.disableShaderPick();
```

### diasbleShaderPick(): void ⚠️ Deprecated

> ⚠️ This method name has a typo and is deprecated, please use `disableShaderPick()` instead.

### enableBoxSelect(once?: boolean): void Enable box selection

Enables box selection functionality, allowing users to select an area by dragging a rectangle. The `once` parameter, when `true`, means box selection will automatically close after one trigger.

```javascript
scene.enableBoxSelect(); // Continuous box selection
scene.enableBoxSelect(true); // Auto-close after one box selection
```

Box selection events can be listened to via the `boxselect` event:

```javascript
scene.on('boxselect', (e) => {
  console.log(e.bounds); // Bounding box in latitude/longitude
});
```

### disableBoxSelect(): void Disable box selection

Disables box selection functionality.

```javascript
scene.disableBoxSelect();
```

### boxSelectEnable: boolean Box selection state

Property indicating whether box selection is currently enabled.

### startAnimate(): void Start animation

Starts continuous rendering animation. By default, L7 renders on demand. Calling this method enables a real-time render loop, which is useful for continuous animations or debugging with SpectorJS.

```javascript
scene.startAnimate();
```

### stopAnimate(): void Stop animation

Stops the real-time rendering animation and returns to on-demand rendering mode.

```javascript
scene.stopAnimate();
```

### getPointSizeRange(): Float32Array Get point sprite size range

Gets the size range of WebGL point sprites supported by the current device.

```javascript
const range = scene.getPointSizeRange();
// range[0] minimum, range[1] maximum
```

### getMapService(): IMapService Get map service

Gets the underlying map service instance, which can be used to directly call basemap-specific methods.

```javascript
const mapService = scene.getMapService();
```

### getMapContainer(): HTMLElement Get map container

Gets the main container DOM element of the map.

```javascript
const container = scene.getMapContainer();
```

### getMapCanvasContainer(): HTMLElement Get map canvas container

Gets the map canvas container DOM element.

```javascript
const canvasContainer = scene.getMapCanvasContainer();
```

### getServiceContainer(): IContainer Get service container

Gets the dependency injection container, which can be used to retrieve registered service instances.

```javascript
const container = scene.getServiceContainer();
```

### getType(): string Get map type

Gets the currently used map type.

```javascript
const mapType = scene.getType(); // e.g., 'gaode', 'mapbox', 'map', etc.
```

### getMinZoom(): number Get minimum zoom level

Gets the minimum zoom level supported by the map.

```javascript
const minZoom = scene.getMinZoom();
```

### getMaxZoom(): number Get maximum zoom level

Gets the maximum zoom level supported by the map.

```javascript
const maxZoom = scene.getMaxZoom();
```

### addIconFontGlyphs(fontFamily: string, glyphs: string[]): void Add IconFont glyphs

Adds glyph data for the specified font family, used for SDF text rendering.

- `fontFamily` Font family name
- `glyphs` Glyph data array

```javascript
scene.addIconFontGlyphs('iconfont', ['glyph1', 'glyph2']);
```

### destroy(): void scene destruction

`scene`Destroy method, leave the page, call when you don’t need to use the map, after calling`scene`The resources and resources in will be destroyed.

```javascript
scene.destroy();
```

## iconfont mapping support

### addIconFont(name: string, unicode: string): void Add mapping support

Supports processing of data passed in by users`unicode`mapping, which internally maintains a set of names and corresponding`key`key-value pairs.

```javascript
scene.addIconFont('icon1', '');
scene.addIconFont('icon2', '');
scene.addFontFace(fontFamily, fontPath);
const pointIconFontLayer = new PointLayer({})
  .source(
    [
      {
        j: 140,
        w: 34,
        m: 'icon1',
      },
      {
        j: 140,
        w: 36,
        m: 'icon2',
      },
    ],
    {
      parser: {
        type: 'json',
        x: 'j',
        y: 'w',
      },
    },
  )
  .shape('m', 'text')
  .size(12)
  .color('w', ['#f00', '#f00', '#0f0'])
  .style({
    fontFamily,
    iconfont: true,
    textAllowOverlap: true,
  });
```

### addIconFonts(option: IOption): void Pass in multiple sets of name-unicode key-value pairs at the same time

Incoming multiple groups at the same time`name - unicode`key-value pairs.

```javascript
type IKeyValue = [name: string, unicode: string];
type IOption = Array<IKeyValue>;

scene.addIconFonts([
  ['icon1', ''],
  ['icon2', ''],
]);
```

## global resources

### addImage(id: string, img: IImage): void Add global resources

exist`scene`Add globally`L7`The layer object can use the image resources in .

```javascript
type IImage = HTMLImageElement | string | File；

scene.addImage( '02','https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg');
```

[Example address](/examples/gallery/animate#animate_path_texture)

### hasImage(id: string): boolean determines global image resources

Determine whether the corresponding image resource has been added globally.

```javascript
scene.hasImage('imageID');
```

### removeImage(id: string): void Globally delete image resources

Delete the corresponding image resource globally.

```javascript
scene.removeImage('imageID');
```

### addFontFace(fontFamily: string, fontPath: string): void Add font file

Add to`iconfont`font file.

- `fontFamily`Font name defined by the user for himself
- `fontPath`Imported file address

```javascript
let fontFamily = 'iconfont';
let fontPath = '//at.alicdn.com/t/font_2534097_iiet9d3nekn.woff2?t=1620444089776';
scene.addFontFace(fontFamily, fontPath);
```

## Properties

### loaded: boolean

Whether the scene has finished loading.

```javascript
if (scene.loaded) {
  console.log('Scene loaded');
}
```

### map: IMapInstance

Gets the underlying map instance, which can be used to call basemap-specific APIs.

```javascript
const mapInstance = scene.map;
```

## event

### on(eventName: string, handler: function): void

Bind event listener on `scene`.

- `eventName` Event name.
- `handler` Event callback function.

### off(eventName: string, handler: function): void

Remove event listener bound on `scene`.

- `eventName` Event name.
- `handler` Event callback function.

### once(eventName: string, handler: function): void

Bind a one-time event listener on `scene`, which is automatically removed after being triggered once.

- `eventName` Event name.
- `handler` Event callback function.

### scene events

`scene` Some common scene events will be triggered, and users can monitor them when needed.

#### loaded

`scene` Initialization completion event, we often use `scene` Add after initialization is complete `Layer`。

```javascript
scene.on('loaded', () => {
  scene.addLayer(layer);
});
```

#### maploaded

Basemap loading completion event.

```javascript
scene.on('maploaded', () => {
  console.log('Basemap loaded');
});
```

#### fontloaded

Font loading completion event.

```javascript
scene.on('fontloaded', () => {
  console.log('Font loaded');
});
```

#### resize

Map container change event

```javascript
scene.on('resize', () => {}); // Map container size change event
```

#### destroy

Scene destruction event.

```javascript
scene.on('destroy', () => {
  console.log('Scene destroyed');
});
```

### map events

```javascript
scene.on('loaded', () => {}); //Triggered after map loading is completed
scene.on('mapmove', () => {}); // Event triggered when the map is moved
scene.on('movestart', () => {}); // Triggered when the map pan starts
scene.on('moveend', () => {}); // Triggered after the map movement ends, including translation and zooming when the center point changes. If the map has a dragging and easing effect, it will be triggered after the easing ends.
scene.on('zoomchange', () => {}); // Triggered after the map zoom level changes
scene.on('zoomstart', () => {}); // Triggered when zooming starts
scene.on('zoomend', () => {}); // Triggered when zooming stops
```

For other map events, you can view the event document of the corresponding basemap. Map events can also be viewed through`Scene.map`Make settings.

[Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/#map.event)[Gaode](https://lbs.amap.com/api/javascript-api/reference/map)

### mouse events

```javascript
scene.on('click', (ev) => {}); // Left mouse button click event
scene.on('dblclick', (ev) => {}); // Left mouse button double-click event
scene.on('mousemove', (ev) => {}); // Triggered when the mouse moves on the map
scene.on('mousewheel', (ev) => {}); // Triggered when the mouse wheel starts to zoom the map
scene.on('mouseover', (ev) => {}); // Triggered when the mouse moves into the map container
scene.on('mouseout', (ev) => {}); // Triggered when the mouse moves out of the map container
scene.on('mouseup', (ev) => {}); // Triggered when the mouse is clicked and raised on the map
scene.on('mousedown', (ev) => {}); // Triggered when the mouse is clicked on the map
scene.on('contextmenu', (ev) => {}); // Right mouse click event
scene.on('dragstart', (ev) => {}); //Triggered when you start dragging the map
scene.on('dragging', (ev) => {}); // Triggered during dragging the map
scene.on('dragend', (ev) => {}); //Triggered when stopping dragging the map. If the map has a dragging and easing effect, it will be triggered before dragging stops and easing starts.

scene.on('webglcontextlost', () => {}); // webgl context lost
```

### Drag events

```javascript
scene.on('dragstart', (ev) => {}); // Triggered when you start dragging the map
scene.on('dragging', (ev) => {}); // Triggered during dragging the map
scene.on('dragend', (ev) => {}); // Triggered when stopping dragging the map. If the map has a dragging easing effect, it is triggered before easing starts
scene.on('dragcancel', (ev) => {}); // Triggered when dragging is cancelled
```

### Box selection events

When `scene.enableBoxSelect()` is called, box selection operations trigger the following events:

```javascript
scene.on('boxselect', (ev) => {
  console.log(ev.bounds); // Bounding box in latitude/longitude [[minLng, minLat], [maxLng, maxLat]]
});
scene.on('boxselectstart', (ev) => {}); // Box selection started
scene.on('boxselecting', (ev) => {}); // Box selection in progress
scene.on('boxselectend', (ev) => {}); // Box selection ended
```

## Experimental parameters

Experimental parameters may be discarded.

### offsetCoordinate: boolean

Applicable to Gaode map, whether to turn off the offset coordinate system, the default is`true`。

```js
const scene = new Scene({
  offsetCoordinate: true,
});
```
