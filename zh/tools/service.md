---
title: "数据服务"
description: "数据服务"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/tools/service/"
---

[资料索引](/llms.txt)

[Interactive content](<https://l7.antv.antgroup.com/zh/tools/service/>)



## 简介

数据服务托管在 npm 上，并且采用 pbf 数据格式进行编码压缩，减少数据量。数据解码需要安装 geobuf、Pbf 模块

### 数据服务

```ts
`https://unpkg.com/xingzhengqu@${version}/data/${level}.pbf`;
```

version 为 2024 及以上时也可使用以下数据服务

```ts
`https://unpkg.com/xingzhengqu@${version}/data/${type}/${level}.pbf`;
```

#### level 类型

- 'country'
- 'province'
- 'city'
- 'district'
- 'jiuduanxian'

#### version 数据版本

- 2023
- 2022
- 2021
- 2020
- 2019
- 2018
- 2017
- 2016
- 2015

#### type 坐标系

- 'gcj02'

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



运行示例前，先在含有 #container 的页面中等待以下初始化完成。相关文件附于文末。

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/docs/tools/demo/bianjieview.tsx" });
```

```ts
import { createRoot } from 'react-dom/client';
// https://unpkg.com/xinzhengqu@1.0.0/data/2023_xian.pbf

// @ts-ignore
import { LineLayer, Scene } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';
import { useEffect } from 'react';

const Example = () => {
  // @ts-ignore
  useEffect(() => {
    let disposed = false;
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [121.4, 31.258134],
        zoom: 2,
        pitch: 0,
        maxZoom: 4,
        style: 'normal',
        doubleClickZoom: false,
      }),
    });

    const fetchData = () => {
      fetch(
        'https://mdn.alipayobjects.com/afts/file/A*zMVuS7mKBI4AAAAAAAAAAAAADrd2AQ/%E5%85%A8%E5%9B%BD%E8%BE%B9%E7%95%8C.json',
      )
        .then((response) => response.json())
        .then((data) => {
          if (disposed) return;
          const line = new LineLayer({})
            .source(data)
            .size(1)
            .shape('line')
            .color('type', ['#e41a1c', '#ff7f00', '#4daf4a', '#377eb8', '#984ea3', '#377eb8'])
            .scale('type', {
              type: 'cat',
              domain: ['haishangshengjie', 'xianggangjie', 'haianxian', 'guojiexian'],
            })
            .style({ opacity: 1.0 });

          scene.addLayer(line);
        });
    };
    fetchData();
    return () => {
      disposed = true;
      scene.destroy();
    };
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};

createRoot(document.getElementById('container')!).render(<Example />);
```





运行示例前，先在含有 #container 的页面中等待以下初始化完成。相关文件附于文末。

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/docs/tools/demo/bianjie.tsx" });
```

```ts
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

interface DataType {
  name: string;
  adcode: number;
  name_en: string;
  name_var: string;
  city_type: string;
  city_adcode: string;
  province: string;
  province_adcode: string;
  province_type: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'NAME',
    dataIndex: 'NAME',
    sorter: true,
  },
  {
    title: 'type',
    dataIndex: 'type',
  },
];

interface IProps {
  onDataLoad: (data: any) => void;
}

const App: React.FC<IProps> = () => {
  const [data, setData] = useState<DataType[]>();

  const fetchData = () => {
    fetch(
      `https://mdn.alipayobjects.com/afts/file/A*zMVuS7mKBI4AAAAAAAAAAAAADrd2AQ/%E5%85%A8%E5%9B%BD%E8%BE%B9%E7%95%8C.json`,
    )
      .then((response) => response.json())
      .then((data) => {
        // 数据解码为geojson
        // @ts-ignore
        const results = data.features.map((feature: any) => {
          return feature.properties;
        });
        setData(results);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Table
      columns={columns}
      rowKey={(record) => record.adcode}
      dataSource={data}
      size="small"
      scroll={{ x: 1000, y: 500 }}
      pagination={{
        pageSize: 20,
        simple: true,
      }}
    />
  );
};

export default App;

createRoot(document.getElementById('container')!).render(<Example />);
```



[数据下载](https://mdn.alipayobjects.com/afts/file/A*zMVuS7mKBI4AAAAAAAAAAAAADrd2AQ/%E5%85%A8%E5%9B%BD%E8%BE%B9%E7%95%8C.json)
### src/demo/setup.ts

```ts
import type { DemoSetupContext } from '@antv/astro-theme-antv';
import * as District from 'district-data';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default async function setup({ container, path }: DemoSetupContext) {
  // Tool pages provide their own React layout and SDK imports.
  if (!path.startsWith('/examples/')) return;
  // Retain only the original globals still used by gallery examples.
  Object.assign(window, { District, GLTFLoader });
  const map = document.createElement('div');
  map.id = 'map';
  container.append(map);
  await import('./map.css');
  // Match the original gallery's shared AMap environment, including raw AMap demos.
  await import('./amap');
}
```
### src/demo/map.css

```css
#map {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 320px;
}

.labelclass {
  position: absolute;
  display: inline;
  cursor: pointer;
  background: rgb(255, 228, 120);
  border: solid 2px #fff;
  padding: 4px;
  white-space: nowrap;
  font:
    bold 12px/18px arial,
    sans-serif;
  color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  line-height: 30px;
  /* opacity: 0.7; */
  text-align: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```
### src/demo/amap.ts

```ts
import AMapLoader from '@amap/amap-jsapi-loader';

// Preserve the site's development and production SDK registrations.
const credentials = import.meta.env.DEV
  ? { key: '6f025e700cbacbb0bb866712d20bb35c', securityJsCode: '290ddc4b0d33be7bc9b354bc6a4ca614' }
  : { key: 'f59bcf249433f8b05caaee19f349b3d7', securityJsCode: '2653011adeb04230b3a26cc9a780a800' };
window._AMapSecurityConfig = { securityJsCode: credentials.securityJsCode };
await AMapLoader.load({ key: credentials.key, version: '2.0', plugins: ['Map3D'] });
```
