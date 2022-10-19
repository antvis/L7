import {
  IInteractionTarget,
  ILayer,
  ITileLayer,
  ITileLayerManager,
  ITileLayerOPtions,
} from '@antv/l7-core';
import  { TileLayerService } from '../service/TileLayerService';
import { TilePickService } from '../service/TilePickService'
import { Base } from './base';

import { setSelect, setHighlight, setPickState, clearPickState } from '../interaction/utils';


export class TileLayer extends Base implements ITileLayer {
  public get children() {
    return this.tileLayerManager.children;
  }
  public tileLayerManager: ITileLayerManager;
  public tilePickService:TilePickService;


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
  }: ITileLayerOPtions) {
    super();
    
    this.sourceLayer = parent.getLayerConfig()?.sourceLayer as string;
    
    this.parent = parent;
    this.mapService = mapService;
    this.layerService = layerService;
    // 初始化瓦片管理服务
    this.tileLayerService = new TileLayerService({
      rendererService,
      layerService,
      parent
    })
    // 初始化拾取服务
    this.tilePickService = new TilePickService({
      tileLayerService:  this.tileLayerService,
      layerService,
    })

    // this.tileLayerManager = new TileLayerManager(
    //   parent,
    //   mapService,
    //   rendererService,
    //   pickingService,
    //   transforms
    // );

    this.initTileSetManager();
    // this.bindSubLayerEvent();
    // this.bindSubLayerPick();

    // this.scaleField = this.parent.getScaleOptions();
  }

  public clearPick(type: string) {
    // Tip: 瓦片只有在 mousemove 的时候需要设置清除
    if (type === 'mousemove') {
      this.tileLayerManager.tilePickService.clearPick();
    }
  }

  /**
   * 清除 select 的选中状态
   */
  public clearPickState() {
    clearPickState(this.children)
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
    setPickState(layers, this.pickColors);
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
