import type { IEncodeFeature, IModel, IModelUniform, ITexture2D } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import { boundsContains, calculateCentroid, padBounds } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import type { IPointLayerStyleOptions } from '../../core/interface';
import { PointImageTriangulation } from '../../core/triangulation';
import CollisionIndex from '../../utils/collision-index';
import pointImageFrag from '../shaders/image/image_frag.glsl';
import pointImageVert from '../shaders/image/image_vert.glsl';

export default class ImageModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      SIZE: 9,
      UV: 10,
    });
  }

  private texture: ITexture2D;

  // 通过碰撞检测的 feature id 集合，由 filterImages() 填充；null 表示不启用过滤（allowOverlap: true）
  public imageFilterMap: { [key: number]: boolean } | null = null;
  private currentZoom: number = -1;
  private extent: [[number, number], [number, number]];
  private preAllowOverlap: boolean = true;

  public getUninforms(): IModelUniform {
    // ThreeJS 图层兼容
    if (this.rendererService.getDirty()) {
      this.texture?.bind();
    }
    const commonInfo = this.getCommonUniformsInfo();
    const attributeInfo = this.getUniformsBufferInfo(this.getStyleAttribute());
    this.updateStyleUnifoms();

    return {
      ...commonInfo.uniformsOption,
      ...attributeInfo.uniformsOption,
    };
  }

  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
    const { raisingHeight = 0, heightfixed = false } =
      this.layer.getLayerConfig() as IPointLayerStyleOptions;

    const commonOptions = {
      u_textSize: [1024, this.iconService.canvasHeight || 128],
      u_raisingHeight: Number(raisingHeight),
      u_heightfixed: Number(heightfixed),
      u_texture: this.texture,
    };

    this.textures = [this.texture];

    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }

  public async initModels(): Promise<IModel[]> {
    const { allowOverlap = true } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    this.extent = this.imageExtent();
    this.preAllowOverlap = allowOverlap;
    this.iconService.on('imageUpdate', this.updateTexture);
    this.updateTexture();
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    const { allowOverlap = true } = this.layer.getLayerConfig() as IPointLayerStyleOptions;

    this.initUniformsBuffer();

    if (!allowOverlap) {
      this.filterImages();
    } else {
      // 允许压盖时置 null，PointImageTriangulation 检测到 null 则跳过过滤
      this.imageFilterMap = null;
    }

    const model = await this.layer.buildLayerModel({
      moduleName: 'pointImage',
      vertexShader: pointImageVert,
      fragmentShader: pointImageFrag,
      // 绑定 this，让 PointImageTriangulation 能读取 imageFilterMap
      triangulation: PointImageTriangulation.bind(this),
      defines: this.getDefines(),
      inject: this.getInject(),
      depth: { enable: false },
      primitive: gl.POINTS,
    });
    return [model];
  }

  public async needUpdate(): Promise<boolean> {
    const { allowOverlap = true } = this.layer.getLayerConfig() as IPointLayerStyleOptions;

    // allowOverlap 开关发生变化时，强制重建
    if (allowOverlap !== this.preAllowOverlap) {
      this.preAllowOverlap = allowOverlap;
      await this.reBuildModel();
      return true;
    }

    // 允许压盖时无需每帧检测
    if (allowOverlap) {
      return false;
    }

    // 不允许压盖时，zoom 变化 >0.5 或视野超出上次范围则重算碰撞
    const zoom = this.mapService.getZoom();
    const extent = this.mapService.getBounds();
    const flag = boundsContains(this.extent, extent);
    if (Math.abs(this.currentZoom - zoom) > 0.5 || !flag) {
      await this.reBuildModel();
      return true;
    }

    return false;
  }

  public clearModels() {
    this.texture?.destroy();
    this.iconService.off('imageUpdate', this.updateTexture);
  }

  protected registerBuiltinAttributes() {
    // 注册 Position 属性 64 位地位部分，经纬度数据开启双精度，避免大于 20层级以上出现数据偏移
    this.registerPosition64LowAttribute();

    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        shaderLocation: this.attributeLocation.SIZE,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature) => {
          const { size = 5 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });

    // point layer uv;
    this.styleAttributeService.registerStyleAttribute({
      name: 'uv',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Uv',
        shaderLocation: this.attributeLocation.UV,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature) => {
          const iconMap = this.iconService.getIconMap();
          const { shape } = feature;
          const { x, y } = iconMap[shape as string] || { x: -64, y: -64 }; // 非画布区域，默认的图标改为透明
          return [x, y];
        },
      },
    });
  }

  /**
   * 图标碰撞避让：遍历所有 feature，在屏幕空间做 AABB 碰撞检测，
   * 将通过检测的 feature id 写入 imageFilterMap。
   * PointImageTriangulation 绑定 this 后，会跳过不在 map 中的 feature。
   */
  private filterImages() {
    const { padding = [0, 0] } = this.layer.getLayerConfig() as IPointLayerStyleOptions;

    this.imageFilterMap = {};
    this.currentZoom = this.mapService.getZoom();
    this.extent = this.imageExtent();

    const { width, height } = this.rendererService.getViewportSize();
    const collisionIndex = new CollisionIndex(width, height);
    const data = this.layer.getEncodedData();

    data.forEach((feature: IEncodeFeature) => {
      const { id = 0, size = 5 } = feature;
      const iconSize = Array.isArray(size) ? size[0] : (size as number);
      const centroid = calculateCentroid(feature.coordinates) as [number, number];
      const pixels = this.mapService.lngLatToContainer(centroid);

      const { box } = collisionIndex.placeCollisionBox({
        x1: -iconSize - padding[0],
        x2: iconSize + padding[0],
        y1: -iconSize - padding[1],
        y2: iconSize + padding[1],
        anchorPointX: pixels.x,
        anchorPointY: pixels.y,
      });

      if (box && box.length) {
        collisionIndex.insertCollisionBox(box, id as number);
        this.imageFilterMap![id as number] = true;
      }
    });
  }

  private imageExtent(): [[number, number], [number, number]] {
    const bounds = this.mapService.getBounds();
    return padBounds(bounds, 0.5);
  }

  private async reBuildModel() {
    const { allowOverlap = true } = this.layer.getLayerConfig() as IPointLayerStyleOptions;
    if (!allowOverlap) {
      this.filterImages();
    } else {
      this.imageFilterMap = null; // 允许压盖：清空过滤表，全量渲染
    }
    const model = await this.layer.buildLayerModel({
      moduleName: 'pointImage',
      vertexShader: pointImageVert,
      fragmentShader: pointImageFrag,
      triangulation: PointImageTriangulation.bind(this),
      defines: this.getDefines(),
      inject: this.getInject(),
      depth: { enable: false },
      primitive: gl.POINTS,
    });
    this.layer.models = [model];
  }

  private updateTexture = () => {
    const { createTexture2D } = this.rendererService;
    if (this.texture) {
      this.texture.update({
        data: this.iconService.getCanvas(),
        mag: 'linear',
        min: 'linear mipmap nearest',
        mipmap: true,
      });
      // 更新完纹理后在更新的图层的时候需要更新所有的图层
      // this.layer.layerModelNeedUpdate = true;
      setTimeout(() => {
        // 延迟渲染
        this.layerService.throttleRenderLayers();
      });

      return;
    }
    this.texture = createTexture2D({
      data: this.iconService.getCanvas(),
      mag: gl.LINEAR,
      min: gl.LINEAR_MIPMAP_LINEAR,
      premultiplyAlpha: false,
      width: 1024,
      height: this.iconService.canvasHeight || 128,
      mipmap: true,
    });
  };
}
