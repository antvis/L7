import {
  feature,
  Feature,
  featureCollection,
  FeatureCollection,
  Point,
  Properties,
} from '@turf/helpers';
import midPoint from '@turf/midpoint';
import { renderFeature } from '../util/renderFeature';
import BaseRender from './base_render';
export default class DrawVertexLayer extends BaseRender {
  public update(pointFeatures: FeatureCollection) {
    this.removeLayers();
    const midFeatures = this.calcMidPointData(pointFeatures);
    const style = this.draw.getStyle('mid_point');
    this.drawLayers = renderFeature(midFeatures, style);
    this.addLayers();
    this.enableEdit();
  }
  public updateData(data: any) {
    const midFeatures = this.calcMidPointData(data);
    this.drawLayers.forEach((layer) => layer.setData(midFeatures));
  }
  public enableEdit() {
    const layer = this.drawLayers[0];
    layer.on('mouseenter', this.onMouseEnter);
    layer.on('mouseout', this.onMouseOut);
    layer.on('click', this.onClick);
  }

  public disableEdit() {
    const layer = this.drawLayers[0];
    layer.off('mouseenter', this.onMouseEnter);
    layer.off('mouseout', this.onMouseOut);
    layer.off('click', this.onClick);
  }

  private onMouseEnter = (e: any) => {
    this.draw.setCursor('pointer');
    // this.draw.editMode.enable();
  };
  private onMouseOut = (e: any) => {
    this.draw.resetCursor();
    // this.draw.editMode.disable();
  };
  private onClick = (e: any) => {
    // 添加一个顶点 1.更新顶点 2.更新重点
  };

  private calcMidPointData(fe: FeatureCollection) {
    const midFeatures: Feature[] = [];
    fe.features.forEach((item, index) => {
      const preFeature = (item as unknown) as Feature<Point, Properties>;
      const nextFeature =
        index !== fe.features.length - 1
          ? ((fe.features[index + 1] as unknown) as Feature<Point, Properties>)
          : ((fe.features[0] as unknown) as Feature<Point, Properties>);
      // @ts-ignore
      midFeatures.push(midPoint(preFeature, nextFeature));
    });
    return featureCollection(midFeatures);
  }
}
