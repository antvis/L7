---
title: L7Mini 网格热力
order: 4
---

<embed src="@/docs/common/style.md"></embed>

## 案例
<img width="200px" alt="网格热力" src='https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*7VR6To9TiwsAAAAAAAAAAAAAARQnAQ'>

### 网格热力

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
      热力值:
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

.populationWrap {
  position: absolute;
  bottom: 32px;
  font-size: 0.6em;
  .populationIcons {
    float: left;
    margin-left: 10px;
    .colorLine {
      height: 5px;
      border-radius: 2px;
    }
  }
}
```

index.ts 脚本代码
```javascript
import {
  Map,
  Scene,
  HeatmapLayer,
  dispatchTouchStart,
  dispatchTouchMove,
  dispatchTouchEnd,
  ImageLayer,
} from '@antv/l7-mini';
import { getJSON } from '../../request';
import { antvl7, hexagonData } from '../../mockData';
import { handleCanvas, LayerCounter } from '../../utils';

let miniScene;
let counter;

Page({
  data: {
    isLoading: true,
    antvl7,
    population: [
      { count: '0.1', color: '#CEF8D6' },
      { count: '0.2', color: '#A1EDB8' },
      { count: '0.3', color: '#7BE39E' },
      { count: '0.4', color: '#5FD3A6' },
      { count: '0.5', color: '#4AC5AF' },
      { count: '0.6', color: '#34B6B7' },
      { count: '0.7', color: '#289899' },
      { count: '0.8', color: '#1D7F7E' },
    ],
  },
  onLoad() {
    counter = new LayerCounter(1, my, this);
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
        pitch: 56.499,
        center: [114.06, 22.53],
        rotation: 39.19,
        zoom: 13,
      });
      miniScene = new Scene({
        id: 'canvas',
        canvas,
        map: miniMap,
        hasBaseMap: false,
      });
      miniScene.setBgColor('rgb(240, 243, 246)');

      const w = 0.125;
      const h = w * 0.5;
      const lng = 114.06;
      const lat = 22.53;
      const imageLayer = new ImageLayer();
      imageLayer.source(
        'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*EbL4QIQ3zKoAAAAAAAAAAAAAARQnAQ',
        {
          parser: {
            type: 'image',
            extent: [lng - w, lat - h, lng + w, lat + h],
          },
        },
      );

      getJSON(hexagonData, function (result, data) {
        if (result) {
          const layer = new HeatmapLayer({ zIndex: 1 })
            .source(data, {
              transforms: [
                {
                  type: 'hexagon',
                  size: 100,
                  field: 'h12',
                  method: 'sum',
                },
              ],
            })
            .size('sum', [0, 600])
            .shape('hexagonColumn')
            .style({
              coverage: 0.8,
              angle: 0,
              opacity: 1.0,
            })
            .color(
              'sum',
              [
                '#1D7F7E',
                '#289899',
                '#34B6B7',
                '#4AC5AF',
                '#5FD3A6',
                '#7BE39E',
                '#A1EDB8',
                '#CEF8D6',
              ].reverse(),
            );
          miniScene.addLayer(layer);
          counter.loadLayer();
        }
      });

      miniScene.on('loaded', function () {
        miniScene.addLayer(imageLayer);
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