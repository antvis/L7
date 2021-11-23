---
title: L7Mini 飞线
order: 4
---

`markdown:docs/common/style.md`

## 案例
<img width="200px" alt="飞线" src='https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*GyYeRp1uOIAAAAAAAAAAAAAAARQnAQ'>

### 飞线

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
  LineLayer,
  dispatchTouchStart,
  dispatchTouchMove,
  dispatchTouchEnd,
  PointLayer,
} from '@antv/l7-mini';
import { getJSON } from '../../request';
import { antvl7, flydata, pointData, worldJSON } from '../../mockData';
import { handleCanvas, LayerCounter } from '../../utils';

let miniScene;
let counter;

Page({
  data: {
    isLoading: true,
    antvl7,
  },
  onLoad() {
    counter = new LayerCounter(3, my, this);
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
        center: [0, 0],
        zoom: 0,
        pitch: 40,
      });
      miniScene = new Scene({
        id: 'canvas',
        canvas,
        map: miniMap,
        hasBaseMap: false,
      });

      miniScene.setBgColor('#222');

      getJSON(worldJSON, function (result, data) {
        if (result) {
          const lineLayer = new LineLayer()
            .source(data)
            .shape('line')
            .size(0.8)
            .color('#41fc9d')

            .style({
              opacity: 0.4,
            });
          miniScene.addLayer(lineLayer);
          counter.loadLayer();
        }
      });

      const flyLine = new LineLayer({ blend: 'normal', zIndex: 2 })
        .source(flydata, {
          parser: {
            type: 'json',
            coordinates: 'coord',
          },
        })
        .color('#b97feb')
        .shape('arc3d')
        .size(2)
        .active(true)
        .animate({
          interval: 2,
          trailLength: 2,
          duration: 1,
        })
        .style({
          opacity: 0.8,
          sourceColor: '#f00',
          targetColor: '#0f0',
        });

      const pointLayer = new PointLayer();
      pointLayer
        .source(pointData, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('circle')
        .color('#ffed11')
        .animate(true)
        .size(40)
        .style({
          opacity: 1.0,
        });

      miniScene.on('loaded', () => {
        miniScene.addLayer(flyLine);
        counter.loadLayer();
        miniScene.addLayer(pointLayer);
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