## layer events

### inited

Parameter option

- target current layer
- type event type

Triggered after layer initialization is completed

```javascript
layer.on('inited', (option) => {});
```

### add

Add layer to scene

Parameter option

- target current layer
- type event type

```javascript
layer.on('add', (type) => console.log(type));
```

### remove

Fires when a layer is removed

Parameter option

- target current layer
- type event type

```javascript
layer.on('remove', (type) => console.log(type));
```

### legend

Data mapping is updated, the legend changes, mainly color and size

### legend:color

The data mapping is updated, the legend changes, and the color changes
Parameter option

- type legend type
- field mapping field
- items legend items

```js
layer.on('legend:color', (ev) => console.log(ev));
```

### legend:size

The data mapping is updated, the legend changes, and the size changes
Parameter option

- type legend type
- field mapping field
- items legend items

```js
layer.on('legend:size', (ev) => console.log(ev));
```

## Layer selection

### boxSelect

Parameter option

- box \[x1: number, y1: number, x2: number, y2: number] compared to
- cb (...args: any\[]) => void callback method passed in, returns the feature inside the box selection

```javascript
layer.boxSelect(box, cb);
// (x1, y1), (x2, y2) The pixel coordinates of the upper left corner and lower right corner of the selected box relative to the upper left corner of the map
//cb is the callback function passed in. The parameter returned by the callback function is the selected feature object array. The fields of the object are related to the data passed in by the user.
```
