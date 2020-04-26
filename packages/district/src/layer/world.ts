import {
  ILayer,
  LineLayer,
  PointLayer,
  PolygonLayer,
  Scene,
  StyleAttrField,
} from '@antv/l7';
import { DataConfig } from '../config';
import BaseLayer from './baseLayer';
import { IDistrictLayerOption } from './interface';
export default class WorldLayer extends BaseLayer {
  constructor(scene: Scene, option: Partial<IDistrictLayerOption> = {}) {
    super(scene, option);
    this.loadData().then(([fillData, fillLabel]) => {
      // this.addWorldBorder(borld1, borld2, island);
      this.addFillLayer(fillData);
      this.addFillLine(fillData);
      if (this.options.label?.enable) {
        this.addLableLayer(fillLabel, 'geojson');
      }
    });
  }
  private async loadData() {
    const countryConfig = DataConfig.world;

    const fillData = await this.fetchData(countryConfig.fill);
    const fillLabel = await this.fetchData(countryConfig.label);
    return [fillData, fillLabel];
  }
}
