### data


### parser

#### format

`format` 方法用于从传入的栅格文件二进制数据中提取波段数据。

- 第一个参数是栅格文件二进制数据

- 第二个参数是第一个参数指定的栅格文件中应该提取的波段

- `format` 是一个 `async` 方法。

#### operation 快捷计算
 归一化指数

 ```ts
 {
    type:'nd'
 }
 ```

#### operation 表达式

- 示例一 

```ts
// band1 * 0.5
{
  operation: ['*', ['band', 1], 0.5],
};
```

- 示例二 嵌套使用

```ts
// band0 * 0.2 + band1
{
  operation:['+', ['*', ['band', 0], 0.2], ['band', 1]]]
};
```

- 示例三 归一化指数

```ts
// 植被指数计算
{
  operation:['/',
    ['-', ['band', 1], ['band', 0]], // R > NIR
    ['+', ['band', 1], ['band', 0]]
  ]
};
```

- operation 表达式类型

    - *`['*', value1, value2]` 返回  `value1 * value2`
    - / `['/', value1, value2]` 返回 `value1 / value2`
    - +`['+', value1, value2]` 返回 `value1 + value2`
    - -`['-', value1, value2]` 返回 `value2 - value1`
    - % `['%', value1, value2]` 返回 `value1 % value2`
    - ^ `['^', value1, value2]` 返回  `value1 ^ value2`
    - abs`['abs', value1]`       返回  `Math.abs(value1)`
    - floor `['floor', value1]`     返回  `Math.floor(value1)`
    - round `['round', value1]`     返回  `Math.round(value1)`
    - ceil `['ceil', value1]`      返回  `Math.ceil(value1)`
    - sin `['sin', value1]`       返回  `Math.sin(value1)`
    - cos `['cos', value1]`       返回  `Math.cos(value1)`
    - atan `['atan', value1, value2]` 返回  `n1===-1?Math.atan(n1): 

  

