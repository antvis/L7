import {
  IInteractionTarget,
  ILayer,
  ILayerService,
  IPickingService,
  IRendererService,
  ITilePickManager,
} from '@antv/l7-core';
import { decodePickingColor } from '@antv/l7-utils';

export default class TilePickManager implements ITilePickManager {
  public isLastPicked: boolean = false;
  private rendererService: IRendererService;
  private pickingService: IPickingService;
  private layerService: ILayerService;
  private children: ILayer[];
  private parent: ILayer;

  constructor(
    parent: ILayer,
    rendererService: IRendererService,
    pickingService: IPickingService,
    children: ILayer[],
    layerService: ILayerService,
  ) {
    this.parent = parent;
    this.rendererService = rendererService;
    this.pickingService = pickingService;
    this.layerService = layerService;
    this.children = children;
  }

  public normalRenderLayer(layers: ILayer[]) {
    layers
      .filter((layer) => layer.inited)
      .filter((layer) => layer.isVisible())
      .map((layer) => {
        layer.hooks.beforeRenderData.call();
        layer.hooks.beforeRender.call();
        if (layer.masks.length > 0) {
          // 清除上一次的模版缓存
          this.rendererService.clear({
            stencil: 0,
            depth: 1,
            framebuffer: null,
          });
          layer.masks.map((m: ILayer) => {
            m.hooks.beforeRenderData.call();
            m.hooks.beforeRender.call();
            m.render();
            m.hooks.afterRender.call();
          });
        }
        layer.render();
        layer.hooks.afterRender.call();
      });
  }

  public pickTileRenderLayer(layers: ILayer[], target: IInteractionTarget) {
    const isPicked = layers
      .filter(
        (layer) =>
          this.parent.needPick(target.type) &&
          layer.inited &&
          layer.isVisible(),
      )
      .some((layer) => {
        layer.hooks.beforePickingEncode.call();
        if (layer.masks.length > 0) {
          // 清除上一次的模版缓存
          this.rendererService.clear({
            stencil: 0,
            depth: 1,
            framebuffer: null,
          });

          layer.masks.map((m: ILayer) => {
            m.hooks.beforeRenderData.call();
            m.hooks.beforeRender.call();
            m.render();
            m.hooks.afterRender.call();
          });
        }
        layer.renderModels(true);
        layer.hooks.afterPickingEncode.call();

        const layerPicked = this.pickingService.pickFromPickingFBO(
          layer,
          target,
        );
        if (layerPicked) {
          const restLayers = this.children.filter((child) => child !== layer);
          // @ts-ignore
          const [r, g, b] = this.pickingService.pickedColors;
          this.pickingService.pickedTileLayers = [this.parent];
          if (target.type === 'click') {
            this.handleSelect(restLayers, [r, g, b]);
          } else {
            this.beforeHighlight([r, g, b]);
          }
        }

        return layerPicked;
      });

    if (!isPicked && this.isLastPicked && target.type !== 'click') {
      // 只有上一次有被高亮选中，本次未选中的时候才需要清除选中状态
      this.pickingService.pickedTileLayers = [];
      this.beforeHighlight([0, 0, 0]);
    }
    this.isLastPicked = isPicked;
    return isPicked;
  }

  public handleSelect(layers: ILayer[], pickedColors: any) {
    layers.map((child) => {
      const { enableSelect } = child.getLayerConfig();
      if (
        enableSelect &&
        pickedColors?.toString() !== [0, 0, 0, 0].toString()
      ) {
        const selectedId = decodePickingColor(pickedColors);

        if (
          child.getCurrentSelectedId() === null ||
          selectedId !== child.getCurrentSelectedId()
        ) {
          this.selectFeature(child, pickedColors);
          child.setCurrentSelectedId(selectedId);
        } else {
          this.selectFeature(child, new Uint8Array([0, 0, 0, 0])); // toggle select
          child.setCurrentSelectedId(null);
        }
      }
    });
    // unselect normal layer
    const renderList = this.layerService.getRenderList();
    renderList
      .filter((layer) => layer.needPick('click'))
      .map((layer) => {
        this.selectFeature(layer, new Uint8Array([0, 0, 0, 0]));
        layer.setCurrentSelectedId(null);
      });
  }

  public highLightLayers(layers: ILayer[]) {
    // @ts-ignore
    const [r, g, b] = this.pickingService.pickedColors;
    layers.map((layer) => {
      layer.hooks.beforeHighlight.call([r, g, b]);
    });
  }

  public clearPick() {
    this.children.map((layer) => {
      layer.hooks.beforeSelect.call([0, 0, 0]);
    });
  }

  public beforeHighlight(pickedColors: any) {
    this.children.map((layer) => {
      layer.hooks.beforeHighlight.call(pickedColors);
    });
  }

  public beforeSelect(pickedColors: any) {
    this.children.map((layer) => {
      layer.hooks.beforeSelect.call(pickedColors);
    });
  }

  private selectFeature(layer: ILayer, pickedColors: Uint8Array | undefined) {
    // @ts-ignore
    const [r, g, b] = pickedColors;
    layer.hooks.beforeSelect.call([r, g, b]);
  }
}
