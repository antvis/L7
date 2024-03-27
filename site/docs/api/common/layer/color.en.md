`color`Method used to set the color of the graphic.

### IColor: string

`color`type string.

- The color type can be written in rgb`rgb(200, 100, 100)`、`rgba(255, 0, 0, 1)`
- The color type can be written in hexadecimal`#ffffff`、`#000`
- The color type can be the writing method of color name`red`、`yellow`

### color(color: IColor)

Layers can set color values ​​directly.

```js
layer.color('#f00');
```

### color(field: string)

The colors of a layer can be mapped based on the data values ​​accepted by the layer, accepting fields of incoming data as parameters.

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

### color(field: string, domain: IColor\[])

`color`Method supports simple value mapping and will be based on`field`The values ​​extracted from the data passed into the layer are mapped to`domain`in the value range.

```js
layer.color('type', ['#f00', '#0f0', '#00f']);
```

### color(field: string, callback: () => IColor )

`color`The method supports the writing method of callback function, which will be based on`field`as`callback`method parameters,`callback`The return value of the method is the actual color of the layer.

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
