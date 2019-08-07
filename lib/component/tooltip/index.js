"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * @fileOverview The class of tooltip
 * @author sima.zhang
 */
var Util = require('../../util');

var Base = require('../../base');

var Global = require('../../global');

var _require = require('@antv/g'),
    DomUtil = _require.DomUtil;

var CONTAINER_CLASS = 'g2-tooltip';
var TITLE_CLASS = 'g2-tooltip-title';
var LIST_CLASS = 'g2-tooltip-list';
var MARKER_CLASS = 'g2-tooltip-marker';
var LIST_ITEM_CLASS = 'g2-tooltip-list-item';

function find(dom, cls) {
  return dom.getElementsByClassName(cls)[0];
}

function refixTooltipPosition(x, y, el, viewWidth, viewHeight) {
  var width = el.clientWidth;
  var height = el.clientHeight;
  var gap = 20;

  if (x + width + gap > viewWidth) {
    x -= width + gap;
    x = x < 0 ? 0 : x;
  } else {
    x += gap;
  }

  if (y + height + gap > viewHeight) {
    y -= height + gap;
    y = x < 0 ? 0 : y;
  } else {
    y += gap;
  }

  return [x, y];
}

function calcTooltipPosition(x, y, position, dom, target) {
  var domWidth = dom.clientWidth;
  var domHeight = dom.clientHeight;
  var rectWidth = 0;
  var rectHeight = 0;
  var gap = 20;

  if (target) {
    var rect = target.getBBox();
    rectWidth = rect.width;
    rectHeight = rect.height;
    x = rect.x;
    y = rect.y;
    gap = 5;
  }

  switch (position) {
    case 'inside':
      x = x + rectWidth / 2 - domWidth / 2;
      y = y + rectHeight / 2 - domHeight / 2;
      break;

    case 'top':
      x = x + rectWidth / 2 - domWidth / 2;
      y = y - domHeight - gap;
      break;

    case 'left':
      x = x - domWidth - gap;
      y = y + rectHeight / 2 - domHeight / 2;
      break;

    case 'right':
      x = x + rectWidth + gap;
      y = y + rectHeight / 2 - domHeight / 2;
      break;

    case 'bottom':
    default:
      x = x + rectWidth / 2 - domWidth / 2;
      y = y + rectHeight + gap;
      break;
  }

  return [x, y];
}

function confineTooltipPosition(x, y, el, plotRange) {
  var gap = 20;
  var width = el.clientWidth;
  var height = el.clientHeight;

  if (x + width > plotRange.tr.x) {
    x -= width + 2 * gap;
  }

  if (x < plotRange.tl.x) {
    x = plotRange.tl.x;
  }

  if (y + height > plotRange.bl.y) {
    y -= height + 2 * gap;
  }

  if (y < plotRange.tl.y) {
    y = plotRange.tl.y;
  }

  return [x, y];
}

var Tooltip =
/*#__PURE__*/
function (_Base) {
  _inherits(Tooltip, _Base);

  _createClass(Tooltip, [{
    key: "getDefaultCfg",
    value: function getDefaultCfg() {
      return {
        /**
         * 右下角坐标
         * @type {Number}
         */
        x: 0,

        /**
         * y 右下角坐标
         * @type {Number}
         */
        y: 0,

        /**
         * tooltip 记录项
         * @type {Array}
         */
        items: null,

        /**
         * 是否展示 title
         * @type {Boolean}
         */
        showTitle: true,

        /**
         * tooltip 辅助线配置
         * @type {Object}
         */
        crosshairs: null,

        /**
         * 视图范围
         * @type {Object}
         */
        plotRange: null,

        /**
         * x轴上，移动到位置的偏移量
         * @type {Number}
         */
        offset: 10,

        /**
         * 时间戳
         * @type {Number}
         */
        timeStamp: 0,

        /**
         * tooltip 容器模板
         * @type {String}
         */
        containerTpl: '<div class="' + CONTAINER_CLASS + '">' + '<div class="' + TITLE_CLASS + '"></div>' + '<ul class="' + LIST_CLASS + '"></ul>' + '</div>',

        /**
         * tooltip 列表项模板
         * @type {String}
         */
        itemTpl: '<li data-index={index}>' + '<span style="background-color:{color};" class=' + MARKER_CLASS + '></span>' + '{name}: {value}</li>',

        /**
         * 将 tooltip 展示在指定区域内
         * @type {Boolean}
         */
        inPlot: true,

        /**
         * tooltip 内容跟随鼠标移动
         * @type {Boolean}
         */
        follow: true,

        /**
         * 是否允许鼠标停留在 tooltip 上，默认不允许
         * @type {Boolean}
         */
        enterable: false
      };
    }
  }, {
    key: "_initTooltipWrapper",
    value: function _initTooltipWrapper() {
      var self = this;
      var containerTpl = self.get('containerTpl');
      var outterNode = self.get('canvas').get('el').parentNode;
      var container;

      if (/^\#/.test(containerTpl)) {
        // 如果传入 dom 节点的 id
        var id = containerTpl.replace('#', '');
        container = document.getElementById(id);
      } else {
        container = DomUtil.createDom(containerTpl);
        DomUtil.modifyCSS(container, self.get(CONTAINER_CLASS));
        outterNode.appendChild(container);
        outterNode.style.position = 'relative';
      }

      self.set('container', container);
    }
  }, {
    key: "_init",
    value: function _init() {
      var crosshairs = this.get('crosshairs');
      var frontPlot = this.get('frontPlot');
      var backPlot = this.get('backPlot');
      var crosshairsGroup;

      if (crosshairs) {
        if (crosshairs.type === 'rect') {
          this.set('crosshairs', Util.deepMix({}, Global.tooltipCrosshairsRect, crosshairs));
          crosshairsGroup = backPlot.addGroup({
            zIndex: 0
          });
        } else {
          this.set('crosshairs', Util.deepMix({}, Global.tooltipCrosshairsLine, crosshairs));
          crosshairsGroup = frontPlot.addGroup();
        }
      }

      this.set('crosshairsGroup', crosshairsGroup);

      this._initTooltipWrapper();
    }
  }]);

  function Tooltip(cfg) {
    var _this;

    _classCallCheck(this, Tooltip);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Tooltip).call(this, cfg));

    _this._init(); // 初始化属性


    if (_this.get('items')) {
      _this._renderTooltip();
    }

    _this._renderCrosshairs();

    return _this;
  }

  _createClass(Tooltip, [{
    key: "_clearDom",
    value: function _clearDom() {
      var container = this.get('container');
      var titleDom = find(container, TITLE_CLASS);
      var listDom = find(container, LIST_CLASS);

      if (titleDom) {
        titleDom.innerHTML = '';
      }

      if (listDom) {
        listDom.innerHTML = '';
      }
    }
  }, {
    key: "_addItem",
    value: function _addItem(item, index) {
      var itemTpl = this.get('itemTpl'); // TODO: 有可能是个回调函数

      var itemDiv = Util.substitute(itemTpl, Util.mix({
        index: index
      }, item));
      var itemDOM = DomUtil.createDom(itemDiv);
      DomUtil.modifyCSS(itemDOM, this.get(LIST_ITEM_CLASS));
      var markerDom = find(itemDOM, MARKER_CLASS);

      if (markerDom) {
        DomUtil.modifyCSS(markerDom, this.get(MARKER_CLASS));
      }

      return itemDOM;
    }
  }, {
    key: "_renderTooltip",
    value: function _renderTooltip() {
      var self = this;
      var showTitle = self.get('showTitle');
      var titleContent = self.get('titleContent');
      var container = self.get('container');
      var titleDom = find(container, TITLE_CLASS);
      var listDom = find(container, LIST_CLASS);
      var items = self.get('items');

      self._clearDom();

      if (titleDom && showTitle) {
        DomUtil.modifyCSS(titleDom, self.get(TITLE_CLASS));
        titleDom.innerHTML = titleContent;
      }

      if (listDom) {
        DomUtil.modifyCSS(listDom, self.get(LIST_CLASS));
        Util.each(items, function (item, index) {
          listDom.appendChild(self._addItem(item, index));
        });
      }
    }
  }, {
    key: "_clearCrosshairsGroup",
    value: function _clearCrosshairsGroup() {
      var crosshairsGroup = this.get('crosshairsGroup');
      this.set('crossLineShapeX', null);
      this.set('crossLineShapeY', null);
      this.set('crosshairsRectShape', null);
      crosshairsGroup.clear();
    }
  }, {
    key: "_renderCrosshairs",
    value: function _renderCrosshairs() {
      var crosshairs = this.get('crosshairs');
      var canvas = this.get('canvas');
      var plotRange = this.get('plotRange');
      var isTransposed = this.get('isTransposed');

      if (crosshairs) {
        this._clearCrosshairsGroup();

        switch (crosshairs.type) {
          case 'x':
            this._renderHorizontalLine(canvas, plotRange);

            break;

          case 'y':
            this._renderVerticalLine(canvas, plotRange);

            break;

          case 'cross':
            this._renderHorizontalLine(canvas, plotRange);

            this._renderVerticalLine(canvas, plotRange);

            break;

          case 'rect':
            this._renderBackground(canvas, plotRange);

            break;

          default:
            isTransposed ? this._renderHorizontalLine(canvas, plotRange) : this._renderVerticalLine(canvas, plotRange);
        }
      }
    }
  }, {
    key: "_addCrossLineShape",
    value: function _addCrossLineShape(attrs, type) {
      var crosshairsGroup = this.get('crosshairsGroup');
      var shape = crosshairsGroup.addShape('line', {
        attrs: attrs
      });
      shape.hide();
      this.set('crossLineShape' + type, shape);
      return shape;
    }
  }, {
    key: "_renderVerticalLine",
    value: function _renderVerticalLine(canvas, plotRange) {
      var _this$get = this.get('crosshairs'),
          style = _this$get.style;

      var attrs = Util.mix({
        x1: 0,
        y1: plotRange ? plotRange.bl.y : canvas.get('height'),
        x2: 0,
        y2: plotRange ? plotRange.tl.y : 0
      }, style);

      this._addCrossLineShape(attrs, 'Y');
    }
  }, {
    key: "_renderHorizontalLine",
    value: function _renderHorizontalLine(canvas, plotRange) {
      var _this$get2 = this.get('crosshairs'),
          style = _this$get2.style;

      var attrs = Util.mix({
        x1: plotRange ? plotRange.bl.x : canvas.get('width'),
        y1: 0,
        x2: plotRange ? plotRange.br.x : 0,
        y2: 0
      }, style);

      this._addCrossLineShape(attrs, 'X');
    }
  }, {
    key: "_renderBackground",
    value: function _renderBackground(canvas, plotRange) {
      var _this$get3 = this.get('crosshairs'),
          style = _this$get3.style;

      var crosshairsGroup = this.get('crosshairsGroup');
      var attrs = Util.mix({
        x: plotRange ? plotRange.tl.x : 0,
        y: plotRange ? plotRange.tl.y : canvas.get('height'),
        width: plotRange ? plotRange.br.x - plotRange.bl.x : canvas.get('width'),
        height: plotRange ? Math.abs(plotRange.tl.y - plotRange.bl.y) : canvas.get('height')
      }, style);
      var shape = crosshairsGroup.addShape('rect', {
        attrs: attrs
      });
      shape.hide();
      this.set('crosshairsRectShape', shape);
      return shape;
    }
  }, {
    key: "isContentChange",
    value: function isContentChange(title, items) {
      var titleContent = this.get('titleContent');
      var lastItems = this.get('items');
      var isChanged = !(title === titleContent && lastItems.length === items.length);

      if (!isChanged) {
        Util.each(items, function (item, index) {
          var preItem = lastItems[index];
          isChanged = item.value !== preItem.value || item.color !== preItem.color || item.name !== preItem.name || item.title !== preItem.title;

          if (isChanged) {
            return false;
          }
        });
      }

      return isChanged;
    }
  }, {
    key: "setContent",
    value: function setContent(title, items) {
      // const isChange = this.isContentChange(title, items);
      // if (isChange) {
      // 在外面进行判断是否内容发生改变
      var timeStamp = +new Date();
      this.set('items', items);
      this.set('titleContent', title);
      this.set('timeStamp', timeStamp);

      this._renderTooltip(); // }


      return this;
    }
  }, {
    key: "setMarkers",
    value: function setMarkers(markerItems, markerCfg) {
      var self = this;
      var markerGroup = self.get('markerGroup');
      var frontPlot = self.get('frontPlot');

      if (!markerGroup) {
        markerGroup = frontPlot.addGroup({
          zIndex: 1,
          capture: false // 不进行拾取

        });
        self.set('markerGroup', markerGroup);
      } else {
        markerGroup.clear();
      }

      Util.each(markerItems, function (item) {
        markerGroup.addShape('marker', {
          color: item.color,
          attrs: Util.mix({}, markerCfg, {
            x: item.x,
            y: item.y
          })
        });
      });
      this.set('markerItems', markerItems);
    }
  }, {
    key: "clearMarkers",
    value: function clearMarkers() {
      var markerGroup = this.get('markerGroup');
      markerGroup && markerGroup.clear();
    }
  }, {
    key: "setPosition",
    value: function setPosition(x, y, target) {
      var container = this.get('container');
      var crossLineShapeX = this.get('crossLineShapeX');
      var crossLineShapeY = this.get('crossLineShapeY');
      var crosshairsRectShape = this.get('crosshairsRectShape');
      var endx = x;
      var endy = y; // const outterNode = this.get('canvas').get('el').parentNode;

      var outterNode = this.get('canvas').get('el');
      var viewWidth = DomUtil.getWidth(outterNode);
      var viewHeight = DomUtil.getHeight(outterNode);
      var offset = this.get('offset');
      var position;

      if (this.get('position')) {
        position = calcTooltipPosition(x, y, this.get('position'), container, target);
        x = position[0];
        y = position[1];
      } else if (!this.get('position')) {
        position = refixTooltipPosition(x, y, container, viewWidth, viewHeight);
        x = position[0];
        y = position[1];
      }

      if (this.get('inPlot')) {
        // tooltip 必须限制在绘图区域内
        var plotRange = this.get('plotRange');
        position = confineTooltipPosition(x, y, container, plotRange);
        x = position[0];
        y = position[1];
      }

      if (this.get('x') !== x || this.get('y') !== y) {
        var markerItems = this.get('markerItems');

        if (!Util.isEmpty(markerItems)) {
          endx = markerItems[0].x;
          endy = markerItems[0].y;
        }

        if (crossLineShapeY) {
          // 第一次进入时，画布需要单独绘制，所以需要先设定corss的位置
          crossLineShapeY.move(endx, 0);
        }

        if (crossLineShapeX) {
          crossLineShapeX.move(0, endy);
        }

        if (crosshairsRectShape) {
          // 绘制矩形辅助框，只在直角坐标系下生效
          var isTransposed = this.get('isTransposed');
          var items = this.get('items');
          var firstItem = items[0];
          var lastItem = items[items.length - 1];
          var dim = isTransposed ? 'y' : 'x';
          var attr = isTransposed ? 'height' : 'width';
          var startDim = firstItem[dim];

          if (items.length > 1 && firstItem[dim] > lastItem[dim]) {
            startDim = lastItem[dim];
          }

          if (this.get('crosshairs').width) {
            // 用户定义了 width
            crosshairsRectShape.attr(dim, startDim - this.get('crosshairs').width / 2);
            crosshairsRectShape.attr(attr, this.get('crosshairs').width);
          } else {
            if (Util.isArray(firstItem.point[dim]) && !firstItem.size) {
              // 直方图
              var width = firstItem.point[dim][1] - firstItem.point[dim][0];
              crosshairsRectShape.attr(dim, firstItem.point[dim][0]);
              crosshairsRectShape.attr(attr, width);
            } else {
              offset = 3 * firstItem.size / 4;
              crosshairsRectShape.attr(dim, startDim - offset);

              if (items.length === 1) {
                crosshairsRectShape.attr(attr, 3 * firstItem.size / 2);
              } else {
                crosshairsRectShape.attr(attr, Math.abs(lastItem[dim] - firstItem[dim]) + 2 * offset);
              }
            }
          }
        }

        var follow = this.get('follow');
        container.style.left = follow ? x + 'px' : 0;
        container.style.top = follow ? y + 'px' : 0;
      }
    }
  }, {
    key: "show",
    value: function show() {
      var crossLineShapeX = this.get('crossLineShapeX');
      var crossLineShapeY = this.get('crossLineShapeY');
      var crosshairsRectShape = this.get('crosshairsRectShape');
      var markerGroup = this.get('markerGroup');
      var container = this.get('container');
      var canvas = this.get('canvas');
      crossLineShapeX && crossLineShapeX.show();
      crossLineShapeY && crossLineShapeY.show();
      crosshairsRectShape && crosshairsRectShape.show();
      markerGroup && markerGroup.show();

      _get(_getPrototypeOf(Tooltip.prototype), "show", this).call(this);

      container.style.visibility = 'visible'; // canvas.sort();

      canvas.draw();
    }
  }, {
    key: "hide",
    value: function hide() {
      var self = this;
      var container = self.get('container');
      var crossLineShapeX = self.get('crossLineShapeX');
      var crossLineShapeY = self.get('crossLineShapeY');
      var crosshairsRectShape = this.get('crosshairsRectShape');
      var markerGroup = self.get('markerGroup');
      var canvas = self.get('canvas');
      container.style.visibility = 'hidden';
      crossLineShapeX && crossLineShapeX.hide();
      crossLineShapeY && crossLineShapeY.hide();
      crosshairsRectShape && crosshairsRectShape.hide();
      markerGroup && markerGroup.hide();

      _get(_getPrototypeOf(Tooltip.prototype), "hide", this).call(this);

      canvas.draw();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var self = this;
      var crossLineShapeX = self.get('crossLineShapeX');
      var crossLineShapeY = self.get('crossLineShapeY');
      var markerGroup = self.get('markerGroup');
      var crosshairsRectShape = self.get('crosshairsRectShape');
      var container = self.get('container');
      var containerTpl = self.get('containerTpl');

      if (container && !/^\#/.test(containerTpl)) {
        container.parentNode.removeChild(container);
      }

      crossLineShapeX && crossLineShapeX.remove();
      crossLineShapeY && crossLineShapeY.remove();
      markerGroup && markerGroup.remove();
      crosshairsRectShape && crosshairsRectShape.remove(); // super.remove();

      _get(_getPrototypeOf(Tooltip.prototype), "destroy", this).call(this);
    }
  }]);

  return Tooltip;
}(Base);

module.exports = Tooltip;