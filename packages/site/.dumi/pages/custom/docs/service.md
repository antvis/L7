---
title: 数据服务
nav:
  order: 2
---

## 简介

数据服务托管在 npm 上，并且采用 pbf 数据格式进行编码压缩，减少数据量。数据解码需要安装 geobuf、Pbf 模块

### 数据服务

```ts
`https://unpkg.com/xingzhengqu@${version}/data/${level}.pbf`;
```


#### level 类型

 -  'country' 
 -  'province'
 -  'city'
 -  'district'
 -  'jiuduanxian'

#### version

 - 2023
 - 2022
 - 2021
 - 2020
 - 2019
 - 2018
 - 2017
 - 2016
 - 2015


### 数据获取

数据服务进行了 pbf 压缩使用前需要先解析

```ts
const url = 'https://unpkg.com/xingzhengqu@2023/data/country.pbf`
fetch(url)
  .then((response) => response.arrayBuffer())
  .then((data) => {
    // 数据解码为geojson
    const gejson = geobuf.decode(new Pbf(data));

  });

```

### 中国边界数据

边界数据包括

- 国界线、九段线
- 海岸线
- 未定国界
- 海上省界
- 香港界

#### 数据预览

<code src="../demo/bianjieview.tsx"></code>

<code src="../demo/bianjie.tsx"></code>

[数据下载](https://mdn.alipayobjects.com/afts/file/A*zMVuS7mKBI4AAAAAAAAAAAAADrd2AQ/%E5%85%A8%E5%9B%BD%E8%BE%B9%E7%95%8C.json)

