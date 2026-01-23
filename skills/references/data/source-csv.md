---
skill_id: source-csv
skill_name: CSV 数据源
category: data
difficulty: beginner
tags: [csv, data, source, table, 数据源, 表格]
dependencies: []
version: 2.x
---

# CSV 数据源

## 技能描述

使用 CSV（逗号分隔值）格式的数据作为图层数据源，适合处理表格数据。

## 何时使用

- ✅ 数据来自 Excel、数据库导出
- ✅ 简单的点位数据
- ✅ 统计数据、业务数据
- ✅ 需要在 Excel 中编辑数据
- ✅ 数据量较大但结构简单

## CSV 格式说明

CSV 是一种简单的文本格式，每行代表一条记录，字段之间用逗号分隔。

### 基本格式

```csv
lng,lat,name,value,type
120.19,30.26,杭州,100,city
121.47,31.23,上海,200,city
116.40,39.91,北京,300,capital
```

**格式要求**：

- 第一行为字段名（表头）
- 每行数据字段数量一致
- 使用逗号分隔字段
- 字段值包含逗号时需要用引号包裹

## 代码示例

### 基础用法 - 点数据

```javascript
import { PointLayer } from '@antv/l7';

const csvData = `lng,lat,name,value,type
120.19,30.26,杭州,100,city
121.47,31.23,上海,200,city
116.40,39.91,北京,300,capital`;

const pointLayer = new PointLayer()
  .source(csvData, {
    parser: {
      type: 'csv',
      x: 'lng', // 经度字段
      y: 'lat', // 纬度字段
    },
  })
  .shape('circle')
  .size('value', [5, 20])
  .color('type', {
    city: '#5B8FF9',
    capital: '#FF6B3B',
  });

scene.addLayer(pointLayer);
```

### 从文件加载 CSV

```javascript
fetch('/data/cities.csv')
  .then((res) => res.text())
  .then((csvText) => {
    const layer = new PointLayer()
      .source(csvText, {
        parser: {
          type: 'csv',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('circle')
      .size(10)
      .color('#5B8FF9');

    scene.addLayer(layer);
  });
```

### 使用 fetch 异步加载

```javascript
async function loadCSVData() {
  const response = await fetch('/data/cities.csv');
  const csvText = await response.text();

  const layer = new PointLayer()
    .source(csvText, {
      parser: {
        type: 'csv',
        x: 'lng',
        y: 'lat',
      },
    })
    .shape('circle')
    .size(8)
    .color('#5B8FF9');

  scene.addLayer(layer);
}

scene.on('loaded', () => {
  loadCSVData();
});
```

### 自定义分隔符

```javascript
// 使用制表符分隔的 TSV 文件
const tsvData = `lng\tlat\tname\tvalue
120.19\t30.26\t杭州\t100
121.47\t31.23\t上海\t200`;

const layer = new PointLayer()
  .source(tsvData, {
    parser: {
      type: 'csv',
      x: 'lng',
      y: 'lat',
      delimiter: '\t', // 指定分隔符为制表符
    },
  })
  .shape('circle')
  .size(10)
  .color('#5B8FF9');

scene.addLayer(layer);
```

### 处理带引号的字段

```javascript
const csvData = `lng,lat,name,address,value
120.19,30.26,杭州,"浙江省,杭州市",100
121.47,31.23,上海,"上海市,黄浦区",200`;

const layer = new PointLayer()
  .source(csvData, {
    parser: {
      type: 'csv',
      x: 'lng',
      y: 'lat',
    },
  })
  .shape('circle')
  .size(10)
  .color('#5B8FF9');

scene.addLayer(layer);
```

### 数据类型转换

```javascript
const csvData = `lng,lat,name,value,active
120.19,30.26,杭州,100,true
121.47,31.23,上海,200,false`;

const layer = new PointLayer()
  .source(csvData, {
    parser: {
      type: 'csv',
      x: 'lng',
      y: 'lat',
    },
    transforms: [
      {
        type: 'map',
        callback: (item) => {
          // 转换数据类型
          item.value = Number(item.value);
          item.active = item.active === 'true';
          return item;
        },
      },
    ],
  })
  .shape('circle')
  .size('value', [5, 20])
  .color('active', ['#999', '#5B8FF9']);

scene.addLayer(layer);
```

### OD 数据（起点-终点）

```javascript
const odCsvData = `from_lng,from_lat,to_lng,to_lat,count,type
120.19,30.26,121.47,31.23,100,train
120.19,30.26,116.40,39.91,200,plane`;

const arcLayer = new LineLayer()
  .source(odCsvData, {
    parser: {
      type: 'csv',
      x: 'from_lng',
      y: 'from_lat',
      x1: 'to_lng',
      y1: 'to_lat',
    },
  })
  .shape('arc')
  .size('count', [1, 5])
  .color('type', {
    train: '#5B8FF9',
    plane: '#FF6B3B',
  });

scene.addLayer(arcLayer);
```

## Parser 配置选项

### 必需参数

| 参数   | 类型   | 说明                    |
| ------ | ------ | ----------------------- |
| `type` | string | 必须设置为 'csv'        |
| `x`    | string | 经度字段名（或 X 坐标） |
| `y`    | string | 纬度字段名（或 Y 坐标） |

### 可选参数

| 参数        | 类型   | 默认值 | 说明                    |
| ----------- | ------ | ------ | ----------------------- |
| `x1`        | string | -      | 终点经度字段（OD 数据） |
| `y1`        | string | -      | 终点纬度字段（OD 数据） |
| `delimiter` | string | ','    | 字段分隔符              |

## 数据示例

### 点位数据

```csv
lng,lat,name,type,value,date
120.19382669582967,30.258134,店铺A,restaurant,100,2024-01-01
121.473701,31.230416,店铺B,cafe,200,2024-01-02
116.404,39.915,店铺C,restaurant,150,2024-01-03
```

### 轨迹数据（路径点）

```csv
lng,lat,time,speed,status
120.19,30.26,2024-01-01 10:00:00,60,normal
120.20,30.27,2024-01-01 10:05:00,55,normal
120.21,30.28,2024-01-01 10:10:00,45,slow
```

### 统计数据（区域）

```csv
region_id,region_name,center_lng,center_lat,population,gdp,area
330100,杭州市,120.19,30.26,1200,18000,16850
310100,上海市,121.47,31.23,2400,38000,6340
```

## 从 Excel 导出 CSV

### Excel 导出步骤

1. 打开 Excel 文件
2. 点击"文件" → "另存为"
3. 选择"CSV UTF-8（逗号分隔）(.csv)"
4. 保存文件

### 注意事项

- ✅ 确保第一行是字段名
- ✅ 经纬度列名要明确（如 lng, lat）
- ✅ 使用 UTF-8 编码避免中文乱码
- ✅ 日期格式要统一

## 常见问题

### 1. 中文乱码

**原因**: CSV 文件编码不是 UTF-8

**解决方案**:

```javascript
// 在读取时指定编码
fetch('/data/cities.csv')
  .then((res) => res.arrayBuffer())
  .then((buffer) => {
    const decoder = new TextDecoder('utf-8');
    const csvText = decoder.decode(buffer);

    layer.source(csvText, {
      parser: {
        type: 'csv',
        x: 'lng',
        y: 'lat',
      },
    });
  });
```

或使用工具转换编码：

```bash
# 使用 iconv 转换编码
iconv -f GB2312 -t UTF-8 input.csv > output.csv
```

### 2. 数据不显示

**检查清单**:

- ✅ 字段名是否正确（区分大小写）
- ✅ 坐标值是否为数字
- ✅ 是否有空行或格式错误
- ✅ parser 配置是否正确

```javascript
// 调试：打印解析后的数据
layer.on('add', () => {
  console.log('图层数据:', layer.getSource().data);
});
```

### 3. 数字被当作字符串

CSV 中所有值默认都是字符串，需要手动转换：

```javascript
layer.source(csvData, {
  parser: {
    type: 'csv',
    x: 'lng',
    y: 'lat',
  },
  transforms: [
    {
      type: 'map',
      callback: (item) => {
        // 转换为数字类型
        item.value = Number(item.value);
        item.population = parseInt(item.population);
        item.price = parseFloat(item.price);
        return item;
      },
    },
  ],
});
```

### 4. 特殊字符处理

包含逗号、引号、换行符的字段需要特殊处理：

```csv
name,description,value
"产品A","价格:1,000元",100
"产品B","说明:包含""引号""",200
```

## 性能优化

### 1. 大文件处理

```javascript
// 使用 Web Worker 处理大文件
const worker = new Worker('csv-parser-worker.js');

worker.postMessage({ csvText: largeCSVData });

worker.onmessage = (e) => {
  const data = e.data;
  layer.source(data, {
    parser: {
      type: 'json', // Worker 已经解析过，使用 json
      x: 'lng',
      y: 'lat',
    },
  });
};
```

### 2. 数据抽稀

```javascript
layer.source(csvData, {
  parser: {
    type: 'csv',
    x: 'lng',
    y: 'lat',
  },
  transforms: [
    {
      type: 'filter',
      callback: (item, index) => {
        // 只显示每 10 条数据
        return index % 10 === 0;
      },
    },
  ],
});
```

## CSV 转 GeoJSON

```javascript
function csvToGeoJSON(csvText, xField, yField) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');

  const features = lines.slice(1).map((line) => {
    const values = line.split(',');
    const properties = {};

    headers.forEach((header, i) => {
      properties[header] = values[i];
    });

    return {
      type: 'Feature',
      properties: properties,
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(properties[xField]), parseFloat(properties[yField])],
      },
    };
  });

  return {
    type: 'FeatureCollection',
    features: features,
  };
}

// 使用
const csvText = `lng,lat,name,value
120.19,30.26,杭州,100
121.47,31.23,上海,200`;

const geojson = csvToGeoJSON(csvText, 'lng', 'lat');

layer.source(geojson, {
  parser: { type: 'geojson' },
});
```

## 使用第三方库

### PapaParse（推荐）

```javascript
import Papa from 'papaparse';

Papa.parse(csvText, {
  header: true, // 第一行作为字段名
  dynamicTyping: true, // 自动类型转换
  complete: (results) => {
    layer.source(results.data, {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    });
  },
});
```

### D3.js

```javascript
import * as d3 from 'd3';

d3.csv('/data/cities.csv').then((data) => {
  layer.source(data, {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
    },
  });
});
```

## 最佳实践

### 1. 字段命名规范

```csv
# 推荐：使用英文字段名
lng,lat,name,value,type

# 不推荐：使用中文字段名
经度,纬度,名称,数值,类型
```

### 2. 数据验证

```javascript
function validateCSVData(data) {
  return data.every((item) => {
    return (
      !isNaN(item.lng) &&
      !isNaN(item.lat) &&
      item.lng >= -180 &&
      item.lng <= 180 &&
      item.lat >= -90 &&
      item.lat <= 90
    );
  });
}
```

### 3. 错误处理

```javascript
fetch('/data/cities.csv')
  .then((res) => {
    if (!res.ok) {
      throw new Error('Failed to load CSV file');
    }
    return res.text();
  })
  .then((csvText) => {
    layer.source(csvText, {
      parser: {
        type: 'csv',
        x: 'lng',
        y: 'lat',
      },
    });
  })
  .catch((error) => {
    console.error('Error loading CSV:', error);
  });
```

## 相关技能

- [GeoJSON 数据源](./source-geojson.md)
- [JSON 数据源](./source-json.md)
- [数据解析配置](./source-parser.md)
- [点图层](../03-layers/point-layer.md)
- [线图层](../03-layers/line-layer.md)

## 参考资源

- [RFC 4180 - CSV 规范](https://tools.ietf.org/html/rfc4180)
- [PapaParse - CSV 解析库](https://www.papaparse.com/)
- [D3.js - CSV 函数](https://github.com/d3/d3-dsv)
