import BaseLayer from '../core/BaseLayer';
import EarthAtomSphereModel from './models/atmosphere';
import BaseEarthModel from './models/base';
import EarthBloomSphereModel from './models/bloomsphere';

interface IEarthLayerStyleOptions {
  opacity: number;
  setEarthTime(time: number): void;
}

export type EarthModelType = 'base' | 'atomSphere' | 'bloomSphere';

const EarthModels: { [key in EarthModelType]: any } = {
  base: BaseEarthModel,
  atomSphere: EarthAtomSphereModel,
  bloomSphere: EarthBloomSphereModel,
};

const earthLayerTypes = ['base', 'atomSphere', 'bloomSphere'];

export default class EarthLayer extends BaseLayer<IEarthLayerStyleOptions> {
  public type: string = 'EarthLayer';

  public buildModels() {
    const shape = this.getModelType();
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

  protected getModelType(): EarthModelType {
    const shapeAttribute = this.styleAttributeService.getLayerStyleAttribute(
      'shape',
    );
    let shape = (shapeAttribute?.scale?.field || 'base') as string;
    if (earthLayerTypes.indexOf(shape) < 0) {
      shape = 'base';
    }
    return shape as EarthModelType;
  }
}
