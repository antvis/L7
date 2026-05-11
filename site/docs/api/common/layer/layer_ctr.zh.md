## 图层控制方法

### show()

图层显示

```javascript
layer.show();
```

### hide()

图层隐藏

```javascript
layer.hide();
```

### isVisible(): boolean

图层是否可见

```javascript
layer.isVisible();
```

### setIndex(zIndex: int)

设置图层绘制顺序

```javascript
layer.setIndex(1);
```

### fitBounds()

缩放到图层范围

```javascript
layer.fitBounds();
```

### setMinZoom(zoom: number)

设置图层最小缩放等级

```javascript
layer.setMinZoom(zoom);
```

### setMaxZoom(zoom: number)

设置图层最大缩放等级

参数

- zoom {number}

```javascript
layer.setMaxZoom(zoom);
```

### getMinZoom(): number

获取图层最小缩放等级

```javascript
const minZoom = layer.getMinZoom();
```

### getMaxZoom(): number

获取图层最大缩放等级

```javascript
const maxZoom = layer.getMaxZoom();
```

### destroy()

销毁图层，释放相关资源。场景调用 `removeLayer` 时会自动销毁图层，一般不需要手动调用。

```javascript
layer.destroy();
```
