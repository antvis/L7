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

export default class CountryLayer extends BaseLayer {
  constructor(scene: Scene, option: Partial<IDistrictLayerOption> = {}) {
    super(scene, option);
    this.loadData().then(
      ([fillData, fillLine, fillLabel, borld1, borld2, island]) => {
        this.addNationBorder(borld1, borld2, island);
        this.addFillLayer(fillData);
        this.addFillLine(fillLine || fillData);
        if (fillLabel && this.options.label?.enable) {
          this.addLableLayer(fillLabel);
        }
      },
    );
  }
  private async loadData() {
    const { depth } = this.options;
    const countryConfig = DataConfig.country.CHN[depth];
    const bordConfig = DataConfig.country.CHN;
    const fillData = await this.fetchData(countryConfig.fill);
    const fillLine = countryConfig.line
      ? await this.fetchData(countryConfig.line)
      : null;
    const fillLabel = countryConfig.label
      ? await this.fetchData(countryConfig.label)
      : null;
    const borld1 = await this.fetchData(bordConfig.nationalBoundaries);
    const borld2 = await this.fetchData(bordConfig.nationalBoundaries2);
    const island = await this.fetchData(bordConfig.island);
    return [fillData, fillLine, fillLabel, borld1, borld2, island];
  }
  // 添加行政区边界
  private addNationBorder(boundaries: any, boundaries2: any, island: any) {
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
      .size('type', (v: number) => {
        return v * 1 === 0 ? coastlineWidth : nationalWidth;
      })
      .shape('line')
      .color('type', (v: number) => {
        return v * 1 === 0 ? coastlineStroke : nationalStroke;
      });
    // 添加未定国界
    const lineLayer2 = new LineLayer({
      zIndex: zIndex + 1,
    })
      .source(boundaries2)
      .size(nationalWidth)
      .shape('line')
      .color('gray')
      .style({
        lineType: 'dash',
        dashArray: [2, 2],
      });

    // 添加岛屿填充
    const fillLayer1 = new PolygonLayer()
      .source(island)
      .color(coastlineStroke)
      .shape('fill')
      .style({
        opacity: 1,
      });
    // 添加岛屿填充
    const fillLayer2 = new LineLayer()
      .source(island)
      .color(coastlineStroke)
      .shape('line')
      .size(1)
      .style({
        opacity: 1,
      });
    this.scene.addLayer(lineLayer);
    this.scene.addLayer(lineLayer2);
    this.scene.addLayer(fillLayer1);
    this.scene.addLayer(fillLayer2);
    this.layers.push(lineLayer, lineLayer2, fillLayer1, fillLayer2);
  }
}
