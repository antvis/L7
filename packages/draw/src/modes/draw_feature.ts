import {
  IInteractionTarget,
  ILayer,
  ILngLat,
  IPopup,
  LineLayer,
  PointLayer,
  PolygonLayer,
  Popup,
  Scene,
} from '@antv/l7';
import turfCircle from '@turf/circle';
import turfDistance from '@turf/distance';
import {
  Feature,
  FeatureCollection,
  featureCollection,
  point,
} from '@turf/helpers';
import EditLayer from '../render/edit';
import RenderLayer from '../render/render';
import SelectLayer from '../render/selected';
import { DrawEvent, DrawModes, unitsType } from '../util/constant';
import DrawEdit from './draw_edit';
import DrawMode, { IDrawOption } from './draw_mode';
import DrawSelected from './draw_selected';
let CircleFeatureId = 0;

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
  protected selectLayer: SelectLayer;
  protected editLayer: EditLayer;
  protected centerLayer: ILayer;

  // 编辑过程中显示
  protected drawLayer: ILayer;
  protected drawLineLayer: ILayer;
  constructor(scene: Scene, options: Partial<IDrawFeatureOption> = {}) {
    super(scene, options);
    this.renderLayer = new RenderLayer(this);
    this.selectLayer = new SelectLayer(this);
    this.editLayer = new EditLayer(this);
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

  protected abstract createFeature(e: ILngLat): FeatureCollection;

  protected abstract moveFeature(e: ILngLat): Feature;

  protected abstract editFeature(e: any): FeatureCollection;

  protected ondrawLayerClick = () => {
    if (this.currentFeature === null) {
      return;
    }
    this.currentFeature = null;
    this.renderLayer.updateData();
    this.centerLayer.setData([]);
    this.drawLayer.setData(InitFeature);
    this.drawLineLayer.setData(InitFeature);
    return;
  };
  protected initDrawFillLayer() {
    const style = this.getStyle('active_fill');
    const linestyle = this.getStyle('active_line');
    this.drawLayer = new PolygonLayer()
      .source(InitFeature)
      .color(style.color)
      .shape('fill')
      .style(style.style);
    this.drawLineLayer = new PolygonLayer()
      .source(InitFeature)
      .color(linestyle.color)
      .size(linestyle.size)
      .shape('line')
      .style(linestyle.style);
    this.scene.addLayer(this.drawLayer);
    this.scene.addLayer(this.drawLineLayer);
  }

  protected updateDrawFillLayer(currentData: any) {
    this.drawLayer.setData(currentData);
    this.drawLineLayer.setData(currentData);
  }

  private removeDrawLayer() {
    this.scene.removeLayer(this.drawLayer);
    this.scene.removeLayer(this.drawLineLayer);
    this.scene.removeLayer(this.centerLayer);
  }

  private createCircleData(center: ILngLat, endPoint: ILngLat) {
    const radius = turfDistance(
      point([center.lng, center.lat]),
      point([endPoint.lng, endPoint.lat]),
      this.getOption('units'),
    );
    const feature = turfCircle([center.lng, center.lat], radius, {
      units: this.getOption('units'),
      steps: this.getOption('steps'),
      properties: {
        id: `${CircleFeatureId++}`,
        active: true,
        radius,
        center,
        endPoint,
      },
    });
    this.currentFeature = feature as Feature;
    return featureCollection([feature]);
  }

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
        this.selectLayer.hide();
        this.editMode.setEditFeature(this.currentFeature as Feature);
        this.editLayer.updateData(
          featureCollection([this.currentFeature as Feature]),
        );
        this.editLayer.show();
        break;
      case DrawModes.SIMPLE_SELECT:
        this.renderLayer.updateData();
        this.selectMode.setSelectedFeature(this.currentFeature as Feature);
        this.selectLayer.updateData(
          featureCollection([this.currentFeature as Feature]),
        );
        this.selectLayer.show();
        break;
      case DrawModes.STATIC:
        this.source.setFeatureUnActive(this.currentFeature as Feature);
        this.renderLayer.updateData();
        break;
    }
  };

  private onDrawCreate = (feature: Feature) => {
    this.source.addFeature(feature);
    if (this.popup) {
      this.popup.remove();
    }
    this.removeDrawLayer();
  };

  private onDrawUpdate = (feature: Feature) => {
    this.source.updateFeature(this.currentFeature as Feature);
  };

  private onDrawMove = (delta: ILngLat) => {
    const feature = this.moveFeature(delta);
    this.currentFeature = feature;
    this.selectLayer.updateData(featureCollection([feature]));
  };

  private onDrawEdit = (endpoint: ILngLat) => {
    const feature = this.editFeature(endpoint);
    this.currentFeature = feature.features[0];
    this.editLayer.updateData(feature);
  };
}
