import BaseLayer from '../core/BaseLayer';
import BaseEarthModel from './models/base';

export type EarthType = 'base';
interface IEarthLayerStyleOptions {
  setEarthTime(time: number): void;
}

const EarthModels: { [key in EarthType]: any } = {
  base: BaseEarthModel,
};

export default class EarthLayer extends BaseLayer<IEarthLayerStyleOptions> {
  public type: string = 'EarthLayer';

  public buildModels() {
    const shape = 'base';
    this.layerModel = new EarthModels[shape](this);
    this.models = this.layerModel.initModels();
  }

  /**
   * 设置当前地球时间
   * @param time
   */
  public setEarthTime(time: number) {
    if (this.layerModel && this.layerModel.setEarthTime) {
      this.layerModel.setEarthTime(time);
    } else {
      console.error('请在 scene loaded 之后执行该方法！');
    }
  }
}
