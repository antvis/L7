---
title: JSON
order: 1
---

GeoJSON 虽然是通用的的地理数据格式，在具体使用场景中，数据服务人员可能并不熟悉GeoJON,或者没有生成GeoJON的工具，因此L7 对数据定义了Parser的概念，你的数据可以是任何格式，使用指定数据对应的地理信息字段即可。

## JSON 

⚠️ json 不是标准的地理数据结构，因此在使用时务必要设置Parser

json 数据解析使用对应JSON parser

## parser

支持两种解析方式

### 简易解析方式

该方式只支持解析的点数据，或者只有两个点的线段，或者弧线数据

- type  ```string``` 必选  `json`
- x  ```string```  点数据表示 经度
- y  ```string``` 点数据表示 纬度
- x1  ```string```  经度 
- x2 ```string``` 纬度 

如果数据是点数据，只需要设置x,y字段即可

如果是线段，弧线数据，需要知道起始点坐标既，x,y,x1,y1

```javascript

layer.source(data,{
  parser:{
    type: 'json',
    x:'lng',
    y:'lat',
  }
})


```

### 通用解析方式
可也解析任意复杂的点，线面

- type  ```string``` 必选  `json`
- coordinates ```array```  必选，主要用于表达比较复杂的格式，等同于 geojson coordinates 属性

```javascript

layer.source(data,{
  parser:{
    type: 'json',
    coordinates:'coord',
  }
})


```

##  使用示例

### 点数据

#### 简易解析
- type json
- x: 经度字段
- y: 纬度字段

```javascript
const data = [
  {
    lng: 112.345,
    lat: 30.455,
    value: 10,
  },
  {
    lng: 114.345,
    lat: 31.455,
    value: 10,
  },
];

layer.source(data, {
  parser: {
    type: 'json',
    x: 'lng',
    y: 'lat',
  },
});
```

####  通用解析
 [ 点 coodinates数据格式](./geojson##point)

```javascript
const data = [
  {
    coord: [112.345, 30.455],
    value: 10,
  },
  {
    coord: [114.345, 32.455],
    value: 10,
  },
];

layer.source(data, {
  parser: {
    type: 'json',
    coordinates:'coord'
  },
});
```


### 线数据 

#### 简易解析

- type: json
- x  ```string```  经度
- y  ```string```  纬度
- x1  ```string```  经度 
- x2 ```string``` 纬度 

简易解析只支持两个点组成的线段，主要再绘制弧线的时候比较常用，只需指定线段的起始点坐标

```javascript
const data = [{
   lng1:112.345,
   lat1:30.455,
   lng2:112.345,
   lat2:30.455,
   value: 10
  },
  {
   lng1:114.345,
   lat1:31.455,
   lng2:112.345,
   lat2:30.455,
   value: 10
  }
];

layer.source(
  data,
   {
    parser:{
        type:'json',
        x:'lng1',
        y:'lat1' ,
        x1:'lng1',
        y1:'lat2' ,
    }
  }
})
```

#### 通用解析

绘制线段、弧线也支持使用coordinates组织数据

coordinates 包含两个坐标，
第一个坐标 对应 x, y
第二个坐标 对应 x1, y1

``` javascript
 const data = [
   {
  "id": "1",
  "coord": [
      [
        101.953125,
        50.51342652633956
      ],
      [
        119.17968749999999,
        33.137551192346145
      ]
    ]
   }

layer.source(
  data,
   {
    parser:{
        type:'json',
        coordinates: "coord",
        
    }
  }
})

```

如果需要使用绘制轨迹数据，需要通过coodinates指定线的点序列。

coordinate 格式geojson的 coordinate 字段 支持LineString, MultiLineString
 
 [ 线 coodinates数据格式](./geojson#linesring)

```javascript

const data = {
 "name": "path1",
 "path": [
          [
            58.00781249999999,
            32.84267363195431
          ],
          [
            85.78125,
            25.16517336866393
          ],
          [
            101.953125,
            41.77131167976407
          ],
          [
            114.9609375,
            39.639537564366684
          ],
          [
            117.42187500000001,
            28.613459424004414
          ]
        ]
}

```

使用时通过coordinates指定

```javascript
layer.source(
  data,
   {
    parser:{
        type:'json',
        coordinates:'path'
    }
  }
})

```

### 面数据

面数据coordinates字段比较复杂不支持简易的解析方式

####  通用解析

需要指定 coordinates 字段, 格式同GeoJSON的coordinates字段

 [面 coodinates数据格式](./geojson/#polygon)

**注意面数据 coord  是三层数据结构**

```javascript
[
  {
    type: 'Polygon',
    geometryCoord: [
      [
        [115.1806640625, 30.637912028341123],
        [114.9609375, 29.152161283318915],
        [117.79541015625001, 27.430289738862594],
        [118.740234375, 29.420460341013133],
        [117.46582031249999, 31.50362930577303],
        [115.1806640625, 30.637912028341123],
      ],
    ],
  },
];

layer.source(data, {
  parser: {
    type: 'json',
    coordinates: 'geometryCoord',
  },
});
```
