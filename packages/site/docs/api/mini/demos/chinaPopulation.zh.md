---
title: L7Mini 中国人口分布地图
order: 4
---

`markdown:docs/common/style.md`

## 案例

<img width="200px" alt="中国人口地图" src='https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/
A*65N9Sbw7f1AAAAAAAAAAAAAAARQnAQ'>

### 中国人口地图

index.axml 页面结构代码
```javascript

<view class="isLoading" style="height: 100vh" a:if="{{isLoading}}">
  <view class="loadItem" a:for="{{10}}">
  </view>
</view>

<view id="box" class="wrap" 
  onTouchStart="onTouchStart" 
  onTouchMove="onTouchMove"
  onTouchEnd="onTouchEnd"
  >
  <canvas onReady="onCanvasReady" type="webgl" id="canvas" />
  <view class="populationWrap">
    <view class="populationIcons">
      人口/千万:
    </view>
    <view class="populationIcons" a:for="{{population}}">
      <view> {{item.count}}  </view>
      <view class="colorLine" style="background:{{item.color}}"></view>
    </view>
  </view>
</view>
<image class="antvl7" mode="scaleToFill" src="{{antvl7}}" />

```
index.less 样式代码
```less
.wrap {
  height: 100vh;
  #canvas {
    height: 100%;
    width: 100%;
  }
}
```

index.ts 脚本代码
```javascript
import {
  Map,
  Scene,
  PolygonLayer,
  LineLayer,
  dispatchTouchStart,
  dispatchTouchMove,
  dispatchTouchEnd,
  PointLayer,
} from '@antv/l7-mini';
import { getJSON } from '../../request';
import { antvl7, chinaJSON, chinaBorderLine, population, provinceCenter } from '../../mockData';
import { handleCanvas, LayerCounter } from '../../utils';

let miniScene;
let counter;

Page({
  data: {
    isLoading: true,
    antvl7,
    population: [
      { count: '> 9', color: '#662506' },
      { count: '> 7', color: '#993404' },
      { count: '> 6', color: '#cc4c02' },
      { count: '> 5', color: '#ec7014' },
      { count: '> 3', color: '#fe9929' },
      { count: '> 2', color: '#fec44f' },
      { count: '<= 2', color: '#fee391' },
    ],
  },
  onLoad() {
    counter = new LayerCounter(4, my, this);
    my.showLoading();
  },
  onTouchStart(e) {
    dispatchTouchStart(e);
  },
  onTouchMove(e) {
    dispatchTouchMove(e);
  },
  onTouchEnd(e) {
    dispatchTouchEnd(e);
  },
  onCanvasReady() {
    handleCanvas(this, my, (canvas) => {
      const miniMap = new Map({
        center: [105, 30.279383],
        zoom: 2,
        pitch: 0,
      });
      miniScene = new Scene({
        id: 'canvas',
        canvas,
        map: miniMap,
        hasBaseMap: false,
      });
      getJSON(chinaJSON, function (result, data) {
        if (result) {
          const polygonLayer = new PolygonLayer({})
            .source(data)
            .size('name', [0, 10000, 50000, 30000, 100000])
            .color('name', (name) => {
              const count = population[name];
              if (count && count > 90000000) {
                return '#662506';
              } else if (count && count > 70000000) {
                return '#993404';
              } else if (count && count > 65000000) {
                return '#cc4c02';
              } else if (count && count > 50000000) {
                return '#ec7014';
              } else if (count && count > 30000000) {
                return '#fe9929';
              } else if (count && count > 20000000) {
                return '#fec44f';
              } else {
                return '#fee391';
              }
            })
            .shape('fill')
            .style({
              opacity: 0.8,
            });

          miniScene.addLayer(polygonLayer);
          counter.loadLayer();

          const provinceLine = new PolygonLayer({})
            .source(data)
            .size(0.4)
            .color('#fff')
            .shape('line')
            .style({
              opacity: 0.8,
            });

          miniScene.addLayer(provinceLine);
          counter.loadLayer();
        }
      });

      getJSON(chinaBorderLine, function (result, data) {
        if (result) {
          const borderlineLayer = new LineLayer({ zIndex: 2 })
            .source(data)
            .shape('line')
            .size(0.6)
            .color('rgb(93,112,146)')
            .style({
              opacity: 0.8,
            });
          miniScene.addLayer(borderlineLayer);
          counter.loadLayer();
        }
      });

      const provinceName = new PointLayer({ zIndex: 1 })
        .source(provinceCenter, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('n', 'text')
        .size(12)
        .color('#000')
        .style({
          stroke: '#fff',
          strokeWidth: 1,
          opacity: 0.8,
          textAllowOverlap: true,
        });

      miniScene.on('loaded', function () {
        miniScene.addLayer(provinceName);
        counter.loadLayer();
      });
    });
  },
  onUnload() {
    // 页面被关闭
    miniScene.destroy();
  },
});
```
方法代码
```javascript
function getJSON(url, callback) {
  my.request({
    url,
    method: 'GET',
    data: {
      from: '支付宝',
      production: 'AlipayJSAPI',
    },
    headers: {
      'content-type': 'application/json', // 默认值
    },
    dataType: 'json',
    fail() {
      callback(false, null);
    },
    complete(res) {
      callback(true, res.data);
    },
  });
}

function handleCanvas(_that, my, callback) {
  const selector = my.createSelectorQuery();
  const domSelector = selector.select('#canvas');
  domSelector
    .fields(
      {
        node: true,
        context: false,
        rect: true,
        computedStyle: ['height', 'width'],
      },
      function (res) {
        res.node.left = res.left;
        res.node.top = res.top;

        const DPR = my.getSystemInfoSync().pixelRatio;
        res.node.width *= DPR;
        res.node.height *= DPR;

        callback(res.node);
      },
    )
    .exec();
}

class LayerCounter {
  private loadedLayer = 0;

  private totalLayers: number;

  private my: any;

  private context: any;

  constructor(totalLayers: number, my: any, context: any) {
    this.totalLayers = totalLayers;
    this.my = my;
    this.context = context;
  }

  loadLayer() {
    this.loadedLayer++;
    const that = this;
    if (this.loadedLayer >= this.totalLayers) {
      this.my.hideLoading({
        page: that, // 防止执行时已经切换到其它页面，page 指向不准确
      });
      this.context.setData({
        isLoading: false,
      });
    }
  }
}
```