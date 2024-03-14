// import ConfigSchemaValidationPlugin from './ConfigSchemaValidationPlugin';
import DataMappingPlugin from './DataMappingPlugin';
import DataSourcePlugin from './DataSourcePlugin';
import FeatureScalePlugin from './FeatureScalePlugin';
import LayerAnimateStylePlugin from './LayerAnimateStylePlugin';
import LayerMaskPlugin from './LayerMaskPlugin';
import LayerModelPlugin from './LayerModelPlugin';
import LayerStylePlugin from './LayerStylePlugin';
import LightingPlugin from './LightingPlugin';
import MultiPassRendererPlugin from './MultiPassRendererPlugin';
import PixelPickingPlugin from './PixelPickingPlugin';
import RegisterStyleAttributePlugin from './RegisterStyleAttributePlugin';
import ShaderUniformPlugin from './ShaderUniformPlugin';
import UpdateModelPlugin from './UpdateModelPlugin';
import UpdateStyleAttributePlugin from './UpdateStyleAttributePlugin';

export function createPlugins() {
  return [
    new DataSourcePlugin(),
    new RegisterStyleAttributePlugin(),
    new FeatureScalePlugin(),
    new DataMappingPlugin(),
    new LayerStylePlugin(),
    new LayerMaskPlugin(),
    new UpdateStyleAttributePlugin(),
    new UpdateModelPlugin(),
    new MultiPassRendererPlugin(),
    new ShaderUniformPlugin(),
    new LayerAnimateStylePlugin(),
    new LightingPlugin(),
    new PixelPickingPlugin(),
    new LayerModelPlugin(),
  ];
}
