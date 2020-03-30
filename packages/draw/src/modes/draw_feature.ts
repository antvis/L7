import { IInteractionTarget, ILayer, ILngLat, Popup, Scene } from '@antv/l7';
import turfCircle from '@turf/circle';
import turfDistance from '@turf/distance';
import {
  Feature,
  FeatureCollection,
  featureCollection,
  point,
} from '@turf/helpers';
import DrawRender from '../render/draw';
import RenderLayer from '../render/draw_result';
import DrawVertexLayer from '../render/draw_vertex';
import { DrawEvent, DrawModes, unitsType } from '../util/constant';
import DrawEdit from './draw_edit';
import DrawMode, { IDrawOption } from './draw_mode';
import DrawSelected from './draw_selected';
export interface IDrawFeatureOption extends IDrawOption {
  units: unitsType;
  steps: number;
}
const InitFeature = {
  type: 'FeatureCollection',
  features: [],
};
export default abstract class DrawFeature extends DrawMode {
  // 绘制完成之后显示
  public selectMode: DrawSelected;
  public editMode: DrawEdit;
  protected renderLayer: RenderLayer;
  protected drawRender: DrawRender;
  protected drawVertexLayer: DrawVertexLayer;
  protected centerLayer: ILayer;

  // 编辑过程中显示
  protected drawLayer: ILayer;
  protected drawLineLayer: ILayer;
  constructor(scene: Scene, options: Partial<IDrawFeatureOption> = {}) {
    super(scene, options);
    this.drawRender = new DrawRender(this);
    this.drawVertexLayer = new DrawVertexLayer(this);
    this.renderLayer = new RenderLayer(this);

    // this.editLayer = new EditLayer(this);
    this.selectMode = new DrawSelected(this.scene, {});
    this.editMode = new DrawEdit(this.scene, {});
    this.selectMode.on(DrawEvent.UPDATE, this.onDrawUpdate);
    this.selectMode.on(DrawEvent.Move, this.onDrawMove);
    this.editMode.on(DrawEvent.MODE_CHANGE, this.onModeChange);
    this.editMode.on(DrawEvent.UPDATE, this.onDrawUpdate);
    this.editMode.on(DrawEvent.Edit, this.onDrawEdit);
    this.selectMode.on(DrawEvent.MODE_CHANGE, this.onModeChange);
    this.on(DrawEvent.CREATE, this.onDrawCreate);
    this.on(DrawEvent.MODE_CHANGE, this.onModeChange);
  }
  public abstract drawFinish(): void;
  public addVertex(feature: Feature): void {
    throw new Error('子类未实现该方法');
  }
  protected getDefaultOptions() {
    return {
      steps: 64,
      units: 'kilometres',
      cursor: 'crosshair',
    };
  }
  protected abstract onDragStart(e: IInteractionTarget): void;

  protected abstract onDragging(e: IInteractionTarget): void;

  protected abstract onDragEnd(e: IInteractionTarget): void;

  protected abstract createFeature(e?: any): FeatureCollection;

  protected abstract moveFeature(e: ILngLat): Feature;

  protected abstract editFeature(e: any): FeatureCollection;

  protected abstract hideOtherLayer(): void;

  protected abstract showOtherLayer(): void;

  private addDrawPopup(lnglat: ILngLat, dis: number) {
    const popup = new Popup({
      anchor: 'left',
      closeButton: false,
    })
      .setLnglat(lnglat)
      .setText(`半径:${dis.toFixed(2)}千米`);
    this.scene.addPopup(popup);
    this.popup = popup;
  }

  private onModeChange = (mode: DrawModes[any]) => {
    switch (mode) {
      case DrawModes.DIRECT_SELECT:
        this.editMode.enable();
        this.editMode.setEditFeature(this.currentFeature as Feature);
        this.drawVertexLayer.show();
        this.drawVertexLayer.enableEdit();
        break;
      case DrawModes.SIMPLE_SELECT:
        this.selectMode.setSelectedFeature(this.currentFeature as Feature);
        this.selectMode.enable();
        this.drawRender.enableDrag();
        this.drawVertexLayer.disableEdit();
        this.drawVertexLayer.show();
        this.drawRender.show();
        this.showOtherLayer();
        break;
      case DrawModes.STATIC:
        this.source.setFeatureUnActive(this.currentFeature as Feature);
        this.drawVertexLayer.hide();
        this.drawVertexLayer.disableEdit();
        this.hideOtherLayer();
        this.renderLayer.update(this.source.data);
        this.renderLayer.enableDrag();
        break;
    }
  };

  private onDrawCreate = (feature: Feature) => {
    this.source.addFeature(feature);
    if (this.popup) {
      this.popup.remove();
    }
    // this.removeDrawLayer();
  };

  private onDrawUpdate = (feature: Feature) => {
    this.source.updateFeature(this.currentFeature as Feature);
  };

  private onDrawMove = (delta: ILngLat) => {
    this.moveFeature(delta);
  };

  private onDrawEdit = (endpoint: ILngLat) => {
    this.editFeature(endpoint);
  };
}
