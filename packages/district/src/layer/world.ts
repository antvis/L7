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
    this.loadData().then(([fillData, lineData, fillLabel]) => {
      // this.addWorldBorder(border1, border2, island);
      this.addFillLayer(fillData);
      this.addFillLine(lineData);
      if (this.options.label?.enable) {
        this.addLableLayer(fillLabel, 'geojson');
      }
    });
  }

  public addFillLine(data: any) {
    // 未定国界
    const bord1 = data.features.filter((feature: any) => {
      return (
        feature.properties.type === '10' ||
        feature.properties.type === '1' ||
        feature.properties.type === '11'
      );
    });
    const bordFc = {
      type: 'FeatureCollection',
      features: bord1,
    };
    const nationalBorder = data.features.filter((feature: any) => {
      return (
        feature.properties.type !== '10' &&
        feature.properties.type !== '1' &&
        feature.properties.type !== '11'
      );
    });
    const nationalFc = {
      type: 'FeatureCollection',
      features: nationalBorder,
    };
    this.addNationBorder(nationalFc, bordFc);
  }

  private async loadData() {
    const countryConfig = DataConfig.world;

    const fillData = await this.fetchData(countryConfig.fill);
    const lineData = await this.fetchData(countryConfig.line);
    const fillLabel = await this.fetchData(countryConfig.label);
    return [fillData, lineData, fillLabel];
  }
  private addNationBorder(boundaries: any, boundaries2: any) {
    const {
      nationalStroke,
      nationalWidth,
      coastlineStroke,
      coastlineWidth,
      zIndex,
    } = this.options;
    // 添加国界线
    const lineLayer = new LineLayer({
      zIndex: zIndex + 1,
    })
      .source(boundaries)
      .size(0.6)
      .color('type', (v: string) => {
        if (v === '0') {
          return 'rgb(99,100, 99)'; // 中国国界线
        } else if (v === '2') {
          return 'rgb(0,136, 191)'; // 中国海岸线
        } else if (v === '9') {
          return 'rgb(0,136, 191)'; // 国外海岸线
        } else if (v === '7') {
          return '#9ecae1'; // 国外国界
        } else {
          return '#9ecae1';
        }
      });
    // 添加未定国界
    const lineLayer2 = new LineLayer({
      zIndex: zIndex + 1,
    })
      .source(boundaries2)
      .size(nationalWidth)
      .shape('line')
      .color('type', (v: string) => {
        if (v === '1') {
          return 'rgb(99,100, 99)';
        } else {
          return '#9ecae1';
        }
      })
      .style({
        lineType: 'dash',
        dashArray: [2, 2],
      });

    this.scene.addLayer(lineLayer);
    this.scene.addLayer(lineLayer2);

    this.layers.push(lineLayer, lineLayer2);
  }
}
