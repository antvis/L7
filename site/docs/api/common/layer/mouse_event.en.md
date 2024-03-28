## mouse events

Mouse event callback parameter target

```javascript
layer.on(eventName, (target) => console.log(target));
```

- x: number x coordinate of the mouse at the map location
- y: number The y coordinate of the mouse's position on the map
- type: string mouse event type
- lngLat: longitude object {lng:number, lat: number}; the latitude and longitude of the mouse location
- feature: any; geographical feature information selected by the data
- featureId: number | null; ID of the geographical feature selected in the data

### click

click event

```javascript
layer.on('click', (e) => console.log(e));
```

### dblclick

double click

```javascript
layer.on('dblclick', (e) => console.log(e));
```

### mousemove

mouse move event

```javascript
layer.on('mousemove', (e) => console.log(e));
```

### mouseout

mouse removal

```javascript
layer.on('mouseout', (e) => console.log(e));
```

### mouseup

mouse raised

```javascript
layer.on('mouseup', (e) => console.log(e));
```

### mousedown

mouse pressed

```javascript
layer.on('mousedown', (e) => console.log(e));
```

### contextmenu

right click

```javascript
layer.on('contextmenu', (e) => console.log(e));
```

### dblclick

Double click to pick element

```javascript
layer.on('dblclick', (e) => console.log(e));
```

### unclick

No element was picked up by clicking

```javascript
layer.on('unclick', (e) => console.log(e));
```

### unmousemove

Element not picked up by mouse movement

```javascript
layer.on('unmousemove', (e) => console.log(e));
```

### unmouseup

The element is not picked up when the mouse is raised

```javascript
layer.on('unmouseup', (e) => console.log(e));
```

### unmousedown

The element is not picked up when the mouse is pressed

```javascript
layer.on('unmousedown', (e) => console.log(e));
```

### uncontextmenu

Select the element with the right mouse button

```javascript
layer.on('uncontextmenu', (e) => console.log(e));
```

### unpick

All mouse events are not picked up

```javascript
layer.on('unpick', (e) => console.log(e));
```

Usage example

```javascript
layer.on('click', (ev) => {}); // Left mouse button click event on layer
layer.on('mouseenter', (ev) => {}); // The mouse enters the layer element
layer.on('mousemove', (ev) => {}); // Triggered when the mouse moves on the layer
layer.on('mouseout', (ev) => {}); // Triggered when the mouse moves out of the layer element
layer.on('mouseup', (ev) => {}); // Triggered when the mouse is clicked and raised on the layer
layer.on('mousedown', (ev) => {}); // Triggered when the mouse is clicked on the layer
layer.on('contextmenu', (ev) => {}); // Right-click menu of layer elements

//Events when the mouse is outside the layer
layer.on('unclick', (ev) => {}); // Click outside the layer
layer.on('unmousemove', (ev) => {}); // Move outside the layer
layer.on('unmouseup', (ev) => {}); // Mouse up outside the layer
layer.on('unmousedown', (ev) => {}); // Triggered when clicked outside the layer
layer.on('uncontextmenu', (ev) => {}); // Right-click outside the layer
layer.on('unpick', (ev) => {}); // All events for operations outside the layer
```
