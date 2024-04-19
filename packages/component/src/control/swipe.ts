import type { ILayer, L7Container } from '@antv/l7-core';
import { createLayerContainer } from '@antv/l7-core';
import { PolygonLayer } from '@antv/l7-layers';
import { DOM } from '@antv/l7-utils';
import type { IControlOption } from './baseControl';
import { Control } from './baseControl';

export interface ISwipeControlOption extends IControlOption {
  /**
   * 左侧的图层
   */
  layers: ILayer[];
  /**
   * 右侧的图层
   */
  rightLayers: ILayer[];
  /**
   * 设置卷帘的位置，值域为 0 到 1, 默认正中间为 0.5
   */
  ratio?: number;
  /**
   * 卷帘方向设置（'vertical' | 'horizontal'），默认 'vertical'
   */
  orientation?: 'vertical' | 'horizontal';
}

export { Swipe };

export default class Swipe extends Control<ISwipeControlOption> {
  /**
   * 是否正在拖动卷帘
   */
  private isMoving: boolean = false;
  /**
   * 掩模图层实例
   */
  private maskLayer: ILayer;

  public getDefault(): ISwipeControlOption {
    return {
      ...super.getDefault(),
      layers: [],
      rightLayers: [],
      ratio: 0.5,
      orientation: 'vertical',
    };
  }

  public onAdd() {
    const container = DOM.create('div', 'l7-control-swipe');
    DOM.create('button', 'l7-control-swipe__button', container);
    const { orientation = 'vertical', ratio = 0.5 } = this.controlOption;

    if (orientation === 'horizontal') {
      container.style.top = ratio * 100 + '%';
      container.style.left = '';
    } else {
      container.style.left = ratio * 100 + '%';
      container.style.top = '';
    }

    container.classList.add(orientation);

    return container;
  }

  public addTo(sceneContainer: L7Container) {
    // 初始化各个 Service 实例
    this.mapsService = sceneContainer.mapService;
    this.renderService = sceneContainer.rendererService;
    this.layerService = sceneContainer.layerService;
    this.controlService = sceneContainer.controlService;
    this.configService = sceneContainer.globalConfigService;
    this.scene = sceneContainer.sceneService;
    this.sceneContainer = sceneContainer;
    this.isShow = true;

    // 初始化 container
    this.container = this.onAdd();

    const { className, style, layers, rightLayers } = this.controlOption;
    if (className) {
      this.setClassName(className);
    }
    if (style) {
      this.setStyle(style);
    }

    // 将 container 插入容器中
    // this.scene.getSceneContainer().appendChild(this.container);
    this.mapsService.getMarkerContainer().appendChild(this.container);

    this.maskLayer = this.getMaskLayer();

    this.registerEvent();

    // 添加掩模图层到 scene
    const layerContainer = createLayerContainer(sceneContainer);
    this.maskLayer.setContainer(layerContainer);
    this.scene.addLayer(this.maskLayer);

    // 给图层挂载掩模
    this.addMaskToLayers(layers, false);
    this.addMaskToLayers(rightLayers, true);
    this.emit('add', this);
    return this;
  }

  public onRemove() {
    if (this.maskLayer) {
      const { layers, rightLayers } = this.controlOption;
      this.removeMaskFromLayers(layers);
      this.removeMaskFromLayers(rightLayers);
      this.layerService?.remove(this.maskLayer);
    }
    this.unRegisterEvent();
    this.removeAllListeners();
  }

  public show() {
    const container = this.container;
    DOM.removeClass(container, 'l7-control-swipe_hide');
    // 启用掩模
    const { layers, rightLayers } = this.controlOption;
    layers.forEach((layer) => layer.enableMask());
    rightLayers.forEach((layer) => layer.enableMask());
    this.scene?.render();
    this.isShow = true;
    this.emit('show', this);
  }

  public hide() {
    const container = this.container;
    DOM.addClass(container, 'l7-control-swipe_hide');
    // 禁用掩模
    const { layers, rightLayers } = this.controlOption;
    layers.forEach((layer) => layer.disableMask());
    rightLayers.forEach((layer) => layer.disableMask());
    this.scene?.render();
    this.isShow = false;
    this.emit('hide', this);
  }

  public setOptions(newOptions: Partial<ISwipeControlOption>): void {
    const controlOption = {
      ...this.controlOption,
      ...newOptions,
    };

    if (newOptions.className) {
      this.setClassName(newOptions.className);
    }

    if (newOptions.style) {
      this.setStyle(newOptions.style);
    }

    if (newOptions.orientation || newOptions.ratio !== undefined) {
      this.setOrientationAndRatio(controlOption.orientation, controlOption.ratio);
    }

    if (newOptions.layers) {
      const newLayers = newOptions.layers;
      const oldLayers = this.controlOption.layers;
      this.setLayers(newLayers, oldLayers, false);
    }

    if (newOptions.rightLayers) {
      const newLayers = newOptions.rightLayers;
      const oldLayers = this.controlOption.rightLayers;
      this.setLayers(newLayers, oldLayers, true);
    }

    this.controlOption = controlOption;

    this.updateMask();
  }

  private registerEvent() {
    this.container.addEventListener('mousedown', this.move);
    this.container.addEventListener('touchstart', this.move);

    this.mapsService.on('camerachange', this.updateMask);
  }

  private unRegisterEvent() {
    this.container.removeEventListener('mousedown', this.move);
    this.container.removeEventListener('touchstart', this.move);

    this.mapsService?.off('camerachange', this.updateMask);
  }

  private setOrientationAndRatio(
    orientation: 'vertical' | 'horizontal' = 'vertical',
    ratio: number = 0.5,
  ) {
    this.container.classList.remove('horizontal', 'vertical');
    this.container.classList.add(orientation);
    if (orientation === 'horizontal') {
      this.container.style.top = ratio * 100 + '%';
      this.container.style.left = '';
    } else {
      this.container.style.left = ratio * 100 + '%';
      this.container.style.top = '';
    }
  }

  private setLayers(newLayers: ILayer[], oldLayers: ILayer[], isRightLayer = false) {
    const addLayers = newLayers.filter((layer) => oldLayers.includes(layer) === false);
    const removeLayers = oldLayers.filter((layer) => newLayers.includes(layer) === false);

    this.addMaskToLayers(addLayers, isRightLayer);
    this.removeMaskFromLayers(removeLayers);
  }

  private addMaskToLayers(layers: ILayer[], isRightLayer: boolean) {
    layers.forEach((layer) => {
      layer.updateLayerConfig({
        maskInside: isRightLayer ? false : true,
      });
      layer.addMask(this.maskLayer);
    });
  }

  private removeMaskFromLayers(layers: ILayer[]) {
    layers.forEach((layer) => {
      // reset default is true
      layer.updateLayerConfig({
        maskInside: true,
      });
      layer.removeMask(this.maskLayer);
    });
  }

  private move = (e: MouseEvent | TouchEvent) => {
    // 阻止事件冒泡到地图上
    e.stopPropagation();

    switch (e.type) {
      case 'touchcancel':
      case 'touchend':
      case 'mouseup': {
        this.isMoving = false;
        (['mouseup', 'mousemove', 'touchend', 'touchcancel', 'touchmove'] as const).forEach(
          (eventName) => {
            document.removeEventListener(eventName, this.move);
          },
        );
        this.scene?.render();
        break;
      }
      case 'mousedown':
      case 'touchstart': {
        this.isMoving = true;
        (['mouseup', 'mousemove', 'touchend', 'touchcancel', 'touchmove'] as const).forEach(
          (eventName) => {
            document.addEventListener(eventName, this.move);
          },
        );
        // fallthrough
      }
      case 'mousemove':
      case 'touchmove': {
        if (this.isMoving) {
          if (this.controlOption.orientation === 'vertical') {
            let pageX: number | undefined;

            if ('pageX' in e) {
              pageX = e.pageX;
            } else if (e.touches && e.touches.length && e.touches[0].pageX) {
              pageX = e.touches[0].pageX;
            } else if (e.changedTouches && e.changedTouches.length) {
              pageX = e.changedTouches[0].pageX;
            }

            if (!pageX) {
              break;
            }

            const containerRect = this.getContainerDOMRect();
            const containerSize = this.getContainerSize();
            const containerWidth = containerSize[0];
            const containerRectLeft = containerRect?.left || 0;
            const offsetX =
              pageX - containerRectLeft + window.scrollX - document.documentElement.clientLeft;
            const width =
              containerWidth - Math.min(Math.max(0, containerWidth - offsetX), containerWidth);

            const ratio = width / containerWidth;

            this.setOptions({ ratio });
            this.emit('moving', {
              size: [width, containerSize[1]],
              ratio: [ratio, 0],
            });
          } else {
            let pageY: number | undefined;
            if ('pageY' in e) {
              pageY = e.pageY;
            } else if (e.touches && e.touches.length && e.touches[0].pageY) {
              pageY = e.touches[0].pageY;
            } else if (e.changedTouches && e.changedTouches.length) {
              pageY = e.changedTouches[0].pageY;
            }

            if (!pageY) {
              break;
            }

            const containerRect = this.getContainerDOMRect();
            const containerSize = this.getContainerSize();
            const containerHeight = containerSize[1];
            const containerRectLeft = containerRect?.top || 0;
            const offsetY =
              pageY - containerRectLeft + window.scrollY - document.documentElement.clientTop;
            const height =
              containerHeight - Math.min(Math.max(0, containerHeight - offsetY), containerHeight);
            const ratio = height / containerHeight;

            this.setOptions({ ratio });
            this.emit('moving', {
              size: [containerSize[0], height],
              ratio: [0, ratio],
            });
          }
        }
        break;
      }
      default:
        break;
    }
  };

  private getMaskGeoData() {
    const { ratio = 0.5, orientation = 'vertical' } = this.controlOption;
    const isVertical = orientation === 'vertical';
    const [sw, ne] = this.getBounds();
    const [swLng, swLat] = sw;
    const [neLng, neLat] = ne;

    let coordinate: number[][];
    if (isVertical) {
      const centerLng = swLng + (neLng - swLng) * ratio;
      coordinate = [[swLng, neLat], [centerLng, neLat], [centerLng, swLat], sw, [swLng, neLat]];
    } else {
      const size = this.getContainerSize();
      const lngLat = this.mapsService.containerToLngLat([size[0], size[1] * ratio]);
      const centerLat = lngLat.lat;
      coordinate = [[swLng, neLat], ne, [neLng, centerLat], [swLng, centerLat], [swLng, neLat]];
    }

    const geoJSON = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [coordinate],
          },
        },
      ],
    };

    return geoJSON;
  }

  private getMaskLayer = () => {
    console.log(this.getMaskGeoData());

    return new PolygonLayer({
      visible: false,
    })
      .source(this.getMaskGeoData())
      .shape('fill')
      .color('red')
      .style({
        opacity: 0.1,
      });
  };

  private updateMask = () => {
    if (!this.mapsService) return;

    const geoJSON = this.getMaskGeoData();
    this.maskLayer?.setData(geoJSON);
  };

  private getContainerDOMRect() {
    const rect = this.mapsService.getContainer()?.getBoundingClientRect();
    return rect;
  }

  private getContainerSize() {
    const size = this.mapsService.getSize();
    return size;
  }

  private getBounds() {
    const bounds = this.mapsService.getBounds();

    return bounds;
  }

  /**
   * 添加要剪裁的图层
   * @param layer 剪裁的图层
   * @param addRight 是否添加图层到右侧, 默认添加到左侧.
   */
  public addLayer(layer: ILayer | ILayer[], addRight: boolean = false) {
    const layers = Array.isArray(layer) ? layer : [layer];
    if (addRight) {
      const rightLayers = this.controlOption.rightLayers.concat(...layers);
      this.setOptions({ rightLayers });
    } else {
      const leftLayers = this.controlOption.layers.concat(...layers);
      this.setOptions({ layers: leftLayers });
    }
  }

  /**
   * 移除剪裁的图层
   */
  public removeLayer(layer: ILayer | ILayer[]) {
    const layers = Array.isArray(layer) ? layer : [layer];
    const leftLayers = this.controlOption.layers.filter((layer) => layers.includes(layer));
    const rightLayers = this.controlOption.rightLayers.filter((layer) => layers.includes(layer));

    this.setOptions({ layers: leftLayers, rightLayers });
  }

  /**
   * 清除所有图层
   */
  public removeLayers() {
    this.setOptions({ layers: [], rightLayers: [] });
  }
}
