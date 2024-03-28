## Layer update method

If a layer has been added and you need to modify the layer display style, you can call the graphics mapping method again, and then call`scene.render()`Just update the rendering

### scale update

Recall the scale method

```tsx
layer.scale('value', {
  type: 'quantile',
});
scene.render();
```

### data mapping

Recall color/size/filter/shape and other methods

```javascript
layer.color('blue');
layer.size(10);

scene.render();
```

### layer.style

```javascript
layer.style({
  opacity: 1,
});

scene.render();
```

### setData(data, option?: {})

Update Source data

parameter:

- data data
- option defaults to the same as the initial configuration item. If the data format is the same, it does not need to be set.

Calling the setData method will automatically update the layer rendering

```javascript
layer.setData(data);
```

### setBlend(type: string)

Set layer overlay method
parameter:

- type blend 类型 normal ｜ additive ｜ subtractive ｜ max
