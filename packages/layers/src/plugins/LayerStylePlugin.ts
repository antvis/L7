import { ILayer, ILayerPlugin, IMapService, TYPES } from '@antv/l7-core';
import Source from '@antv/l7-source';
import { injectable } from 'inversify';
import { encodePickingColor, rgb2arr } from '../utils/color';
@injectable()
export default class LayerStylePlugin implements ILayerPlugin {
  public apply(layer: ILayer) {
    layer.hooks.afterInit.tap('LayerStylePlugin', () => {
      layer.updateLayerConfig({});
      const { autoFit } = layer.getLayerConfig();
      if (autoFit) {
        layer.fitBounds();
      }
    });

    layer.hooks.beforeRender.tap('LayerStylePlugin', () => {
      const {
        highlightColor = 'red',
        pickedFeatureID = -1,
      } = layer.getLayerConfig();
      layer.models.forEach((model) =>
        model.addUniforms({
          u_PickingStage: 2.0,
          u_PickingColor: encodePickingColor(pickedFeatureID),
          u_HighlightColor: rgb2arr(highlightColor as string),
        }),
      );
    });
  }
}
