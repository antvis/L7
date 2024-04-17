### data

### parser

#### format

`format`Method used to extract band data from the incoming raster file binary data.

- The first parameter is the raster file binary data

- The second parameter is the band that should be extracted from the raster file specified by the first parameter.

- `format`Is a`async`method.

#### operation quick calculation

normalized index

```ts
{
  type: 'nd';
}
```

#### operation expression

- Example 1

```ts
// band1 * 0.5
{
  operation: ['*', ['band', 1], 0.5],
};
```

- Example 2 Nested use

```ts
// band0 * 0.2 + band1
{
  operation:['+', ['*', ['band', 0], 0.2], ['band', 1]]]
};
```

- Example 3 Normalized Index

```ts
// Vegetation index calculation
{
  operation: [
    '/',
    ['-', ['band', 1], ['band', 0]], // R > NIR
    ['+', ['band', 1], ['band', 0]],
  ];
}
```

- operation expression type

  - \*`['*', value1, value2]`return`value1 * value2`
  - /`['/', value1, value2]`return`value1 / value2`
  - +`['+', value1, value2]`return`value1 + value2`
  - -`['-', value1, value2]`return`value2 - value1`
  - %`['%', value1, value2]`return`value1 % value2`
  - ^`['^', value1, value2]`return`value1 ^ value2`
  - abs`['abs', value1]`return`Math.abs(value1)`
  - floor `['floor', value1]`return`Math.floor(value1)`
  - round `['round', value1]`return`Math.round(value1)`
  - ceil `['ceil', value1]`return`Math.ceil(value1)`
  - sin `['sin', value1]`return`Math.sin(value1)`
  - cos `['cos', value1]`return`Math.cos(value1)`
  - atan `['atan', value1, value2]`Return \`n1===-1?Math.atan(n1):
