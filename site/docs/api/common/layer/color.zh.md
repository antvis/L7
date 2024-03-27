`color` 方法用于设置图形的颜色。

### IColor: string

`color` 类型的字符串。

- color 类型可以为 rgb 的写法 `rgb(200, 100, 100)`、`rgba(255, 0, 0, 1)`
- color 类型可以为十六进制的写法 `#ffffff`、`#000`
- color 类型可以是颜色名称的写法 `red`、`yellow`

### color(color: IColor)

图层可以直接设置颜色值。

```js
layer.color('#f00');
```

### color(field: string)

图层的颜色可以根据图层接受的数据值进行映射，接受传入数据的字段作为参数。

```js
layer.source([
  {
    lng: 120,
    lat: 30,
    c: '#f00',
  },
]);
layer.color('c');
```

### color(field: string, domain: IColor[])

`color` 方法支持简单的值映射，将根据 `field` 从传入图层的数据中提取的值映射到 `domain` 值域中。

```js
layer.color('type', ['#f00', '#0f0', '#00f']);
```

### color(field: string, callback: () => IColor )

`color` 方法支持回调函数的写法，将根据 `field` 作为 `callback` 方法的参数，`callback` 方法的返回值作为图层实际的颜色。

```js
layer.color('type', (value) => {
  switch (value) {
    case 'water':
      return '#f00';
    case 'wood':
      return '#0f0';
  }
});
```
