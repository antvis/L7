import { ILayer, IRendererService, ITileRenderService } from '@antv/l7-core';
/**
 * 主要用于瓦片图层队列的渲染
 */
export class TileRenderService implements ITileRenderService{
    private rendererService: IRendererService;

    constructor(rendererService: IRendererService) {
        this.rendererService = rendererService; 
    }

    public render(layers: ILayer[]) {
        layers
          .filter((layer) => layer.inited)
          .filter((layer) => layer.isVisible())
          .map(async (layer) => {
            if (layer.masks.length > 0) {
              // 清除上一次的模版缓存
              this.rendererService.clear({
                stencil: 0,
                depth: 1,
                framebuffer: null,
              });
              layer.masks.map(async (m: ILayer) => {
                m.render();
              });
            }
            layer.render();
          });
    }
}