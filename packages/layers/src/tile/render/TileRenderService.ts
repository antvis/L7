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
            layer.hooks.beforeRenderData.promise();
            layer.hooks.beforeRender.call();
            if (layer.masks.length > 0) {
              // 清除上一次的模版缓存
              this.rendererService.clear({
                stencil: 0,
                depth: 1,
                framebuffer: null,
              });
              layer.masks.map(async (m: ILayer) => {
                await m.hooks.beforeRenderData.promise();
                m.hooks.beforeRender.call();
                m.render();
                m.hooks.afterRender.call();
              });
            }
            layer.render();
            layer.hooks.afterRender.call();
          });
    }

    public renderMask(layer: ILayer) {
       
        if (layer.inited && layer.isVisible() && layer.masks.length > 0) {
          layer.hooks.beforeRender.call();
          this.rendererService.clear({
            stencil: 0,
            depth: 1,
            framebuffer: null,
          });
          layer.masks.map((m: ILayer) => {
            m.hooks.beforeRender.call();
            m.render();
            m.hooks.afterRender.call();
          });
          layer.hooks.afterRender.call();
        }
    }
}