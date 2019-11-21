---
title: Source
order: 0
---


# Source


### 概述

source 地理数据处理模块，主要包含数据解析（parser)，和数据处理(transform);

**parser:**

不同数据类型处理成统一数据格式。矢量数据包括 GeoJON, CSV，Json等不同数据格式，栅格数据，包括Raster，Image数据。将来还会支持瓦片格式数据。

**transform:**

数据转换，数据统计，网格布局，数据聚合等数据操作。


## API

### parser

空间数据分矢量数据和栅格数据两大类

- 矢量数据 支持 csv，geojson，json 三种数据类型

- 栅格数据  支持 image，Raster



#### geojson

[geojson](https://www.yuque.com/antv/l7/dm2zll) 数据为默认数据格式，可以

不需要设置parser 参数

```javascript
layer.source(data);
```


#### json

json  不是标准的地理数据结构，因此需要设置对应的经纬度字段

**点数据**

x: 经度字段 

y: 纬度字段

```javascript

const data = [{
   lng:112.345,
   lat:30.455,
   value: 10
 },{
   lng:114.345,
   lat:31.455,
   value: 10
  }    
]

layer.source(
  data, 
   {
    parser: {
        type:'json',
        x:'lng',
        y:'lat', 
    }
})
```

**线段数据**

 type: json

这里的直线表示有两个点组成的线段，主要绘制弧线的时候比较常用，只需指定线段的起始点坐标

 x:经度字段 起点经度
 y:纬度字段 起点纬度
 x1:经度字段  终点经度
 y1:纬度字段   终点纬度

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

**面数据**

需要指定coordinates 字段, coordinates据格式

**注意面数据 coord  是三层数据结构**

```javascript

[ {
  		type: "Polygon",
        'geometryCoord': [
          [
            [
              115.1806640625,
              30.637912028341123
            ],
            [
              114.9609375,
              29.152161283318915
            ],
            [
              117.79541015625001,
              27.430289738862594
            ],
            [
              118.740234375,
              29.420460341013133
            ],
            [
              117.46582031249999,
              31.50362930577303
            ],
            [
              115.1806640625,
              30.637912028341123
            ]
          ]
        ]
    }
  ];
  
  layer.source(data,{
      parser:{
        type:'json',
        coordinates:'geometryCoord'
      }
   });
```




#### csv
点，线数据配置项同json数据类型

```javascript
layer.source(
   data,
  {
    parser:{
        type:'csv',
        x:'lng1',
        y:'lat1' , 
        x1:'lng1',
        y1:'lat2' , 
    }
})
```

**栅格数据类型****

#### image
 根据图片的经纬度范围，将图片添加到地图上。 配置项

-  type: image
-  extent: 图像的经纬度范围 []

```javascript
layer.source('https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg',{
     parser:{
          type:'image',
          extent: [ 121.1680, 30.2828, 121.3840, 30.4219 ]
       }
  });
```
 

#### raster
栅格数据类型，主要表示遥感数据类型data 栅格数据的二维矩阵数据parser 配置项

- type  raster
- width  数据宽度二维矩阵 columns 
- height 数据高度
- min 数据最大值
- max 数据最小值
- extent 经纬度范围

```javascript
 source(values, {
       parser: {
         type: 'raster',
         width: n,
         height: m,
         min: 0,
         max: 8000,
         extent: [ 73.482190241, 3.82501784112, 135.106618732, 57.6300459963 ]
       }
     });
```


### transforms

目前支持三种数据处理方法 map，grid，hexagon transform配置项

- type 数据处理类型
-  tansform cfg  数据处理配置项


#### map
数据处理，支持自定义callback函数

- callback:function 回调函数

```javascript
 layer.source(data, {
      transforms:[
        {
          type: 'map',
          callback:function(item){
            const [x, y] = item.coordinates;
            item.lat = item.lat*1;
            item.lng = item.lng*1;
            item.v = item.v *1;
            item.coordinates = [x*1,y*1];
            return item;
          }
        }
      ]
 });
```


#### grid

生成方格网布局，根据数据字段统计，主要在网格热力图中使用

-  type: 'grid',
-  size: 网格半径
-  field: 数据统计字段
-  method:聚合方法  count,max,min,sum,mean5个统计维度

```javascript
 layer.source(data, {
      transforms:[
        {
        type: 'grid',
        size: 15000,
        field:'v',
        method:'sum'
      }
      ],
    })
```


#### hexagon
生成六边形网格布局，根据数据字段统计

-  type: 'hexagon',
-  size: 网格半径
-  field: 数据统计字段
-  method:聚合方法  count,max,min,sum,mean5个统计维度

```



