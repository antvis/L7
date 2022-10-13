import {
  IInteractionTarget,
  ILayer,
  ITileLayer,
  ITileLayerManager,
  ITileLayerOPtions,
} from '@antv/l7-core';
import { decodePickingColor } from '@antv/l7-utils';
import { TileLayerManager } from '../manager/layerManager';
import { Base } from './base';
import { setSelect, setHighlight, selectFeature } from '../interaction/utils';

export class TileLayer extends Base implements ITileLayer {
  public get children() {
    return this.tileLayerManager.children;
  }
  public tileLayerManager: ITileLayerManager;

  private pickColors: {
    select: any;
    active: any;
  } = {
    select: null,
    active: null,
  };

  constructor({
    parent,
    rendererService,
    mapService,
    layerService,
    pickingService,
    transforms
  }: ITileLayerOPtions) {
    super();
    const parentSource = parent.getSource();
    const { sourceLayer } =
      parentSource?.data?.tilesetOptions || {};
    this.sourceLayer = sourceLayer;
    this.parent = parent;
    this.mapService = mapService;
    this.layerService = layerService;

    this.tileLayerManager = new TileLayerManager(
      parent,
      mapService,
      rendererService,
      pickingService,
      transforms
    );

    this.initTileSetManager();
    this.bindSubLayerEvent();
    this.bindSubLayerPick();

    this.scaleField = this.parent.getScaleOptions();
  }

  public clearPick(type: string) {
    if (type === 'mousemove') {
      this.tileLayerManager.tilePickService.clearPick();
    }
  }

  /**
   * 清除 select 的选中状态
   */
  public clearPickState() {
    this.children
      .filter((child) => child.inited && child.isVisible())
      .filter((child) => child.getCurrentSelectedId() !== null)
      .map((child) => {
        selectFeature(child, new Uint8Array([0, 0, 0, 0]));
        child.setCurrentSelectedId(null);
      });
  }

  /**
   * 瓦片图层独立的拾取逻辑
   * @param target
   * @returns
   */
  public pickLayers(target: IInteractionTarget) {
    return this.tileLayerManager.pickLayers(target);
  }

  public setPickState(layers: ILayer[]) {
    if (this.pickColors.select) {
      const selectedId = decodePickingColor(this.pickColors.select);
      layers.map((layer) => {
        selectFeature(layer, this.pickColors.select);
        layer.setCurrentSelectedId(selectedId);
      });
    }

    if (this.pickColors.active) {
      const selectedId = decodePickingColor(this.pickColors.active);
      layers
        .filter((layer) => layer.inited && layer.isVisible())
        .map((layer) => {
          layer.hooks.beforeHighlight.call(this.pickColors.active);
          layer.setCurrentPickId(selectedId);
        });
    }
  }

  private bindSubLayerPick() {
    this.tileLayerManager.tilePickService.on('pick', (e) => {
      // @ts-ignore
      const [r, g, b] = e.pickedColors;

      if (e.type === 'click') {
        const restLayers = this.children
          .filter(
            (child) => child.inited && child.isVisible() && child.isVector,
          )
          .filter((child) => child !== e.layer);

        const renderList = this.layerService.getRenderList();
        const color = setSelect(restLayers, [r, g, b], renderList)
        this.pickColors.select = color;
      } else {
        setHighlight(this.children, [r, g, b]);
        this.pickColors.active = [r, g, b];
      }
    });

    this.tileLayerManager.tilePickService.on('unpick', () => {
      this.pickColors.active = null;
    });
  }

  protected bindSubLayerEvent() {
    /**
     * layer.on('click', (ev) => {}); // 鼠标左键点击图层事件
     * layer.on('mouseenter', (ev) => {}); // 鼠标进入图层要素
     * layer.on('mousemove', (ev) => {}); // 鼠标在图层上移动时触发
     * layer.on('mouseout', (ev) => {}); // 鼠标移出图层要素时触发
     * layer.on('mouseup', (ev) => {}); // 鼠标在图层上单击抬起时触发
     * layer.on('mousedown', (ev) => {}); // 鼠标在图层上单击按下时触发
     * layer.on('contextmenu', (ev) => {}); // 图层要素点击右键菜单
     *
     *  鼠标在图层外的事件
     * layer.on('unclick', (ev) => {}); // 图层外点击
     * layer.on('unmousemove', (ev) => {}); // 图层外移动
     * layer.on('unmouseup', (ev) => {}); // 图层外鼠标抬起
     * layer.on('unmousedown', (ev) => {}); // 图层外单击按下时触发
     * layer.on('uncontextmenu', (ev) => {}); // 图层外点击右键
     * layer.on('unpick', (ev) => {}); // 图层外的操作的所有事件
     */
    this.parent.on('subLayerClick', (e) => {
      this.parent.emit('click', { ...e });
    });
    this.parent.on('subLayerMouseMove', (e) =>
      this.parent.emit('mousemove', { ...e }),
    );
    this.parent.on('subLayerMouseUp', (e) =>
      this.parent.emit('mouseup', { ...e }),
    );
    this.parent.on('subLayerMouseEnter', (e) =>
      this.parent.emit('mouseenter', { ...e }),
    );
    this.parent.on('subLayerMouseOut', (e) =>
      this.parent.emit('mouseout', { ...e }),
    );
    this.parent.on('subLayerMouseDown', (e) =>
      this.parent.emit('mousedown', { ...e }),
    );
    this.parent.on('subLayerContextmenu', (e) =>
      this.parent.emit('contextmenu', { ...e }),
    );

    // vector layer 图层外事件
    this.parent.on('subLayerUnClick', (e) =>
      this.parent.emit('unclick', { ...e }),
    );
    this.parent.on('subLayerUnMouseMove', (e) =>
      this.parent.emit('unmousemove', { ...e }),
    );
    this.parent.on('subLayerUnMouseUp', (e) =>
      this.parent.emit('unmouseup', { ...e }),
    );
    this.parent.on('subLayerUnMouseDown', (e) =>
      this.parent.emit('unmousedown', { ...e }),
    );
    this.parent.on('subLayerUnContextmenu', (e) =>
      this.parent.emit('uncontextmenu', { ...e }),
    );
  }
}
