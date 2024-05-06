import type { IEncodeFeature, IModel, ITexture2D } from '@antv/l7-core';
import { AttributeType, gl } from '@antv/l7-core';
import { rgb2arr } from '@antv/l7-utils';
import BaseModel from '../../core/BaseModel';
import type { IPolygonLayerStyleOptions } from '../../core/interface';
import { PolygonExtrudeTriangulation } from '../../core/triangulation';
import { loadImage } from '../../utils/load-image';
import polygonExtrudeFrag from '../shaders/extrude/polygon_extrude_frag.glsl';
import polygonExtrudePickLightFrag from '../shaders/extrude/polygon_extrude_picklight_frag.glsl';
import polygonExtrudePickLightVert from '../shaders/extrude/polygon_extrude_picklight_vert.glsl';
import polygonExtrudeVert from '../shaders/extrude/polygon_extrude_vert.glsl';
import polygonExtrudeTexFrag from '../shaders/extrude/polygon_extrudetex_frag.glsl';
import polygonExtrudeTexVert from '../shaders/extrude/polygon_extrudetex_vert.glsl';

export default class ExtrudeModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      SIZE: 9,
      NORMAL: 10,
      UV: 11,
    });
  }

  protected texture: ITexture2D;
  public getUninforms() {
    const commoninfo = this.getCommonUniformsInfo();
    const attributeInfo = this.getUniformsBufferInfo(this.getStyleAttribute());
    this.updateStyleUnifoms();
    return {
      ...commoninfo.uniformsOption,
      ...attributeInfo.uniformsOption,
    };
  }
  protected getCommonUniformsInfo(): {
    uniformsArray: number[];
    uniformsLength: number;
    uniformsOption: { [key: string]: any };
  } {
    const {
      mapTexture,
      heightfixed = false,
      raisingHeight = 0,
      topsurface = true,
      sidesurface = true,
      sourceColor,
      targetColor,
    } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;

    // 转化渐变色
    let useLinearColor = 0; // 默认不生效
    let sourceColorArr = [1, 1, 1, 1];
    let targetColorArr = [1, 1, 1, 1];
    if (sourceColor && targetColor) {
      sourceColorArr = rgb2arr(sourceColor);
      targetColorArr = rgb2arr(targetColor);
      useLinearColor = 1;
    }
    const commonOptions = {
      u_sourceColor: sourceColorArr,
      u_targetColor: targetColorArr,
      u_linearColor: useLinearColor,
      // 控制侧面和顶面的显示隐藏
      u_topsurface: Number(topsurface),
      u_sidesurface: Number(sidesurface),
      u_heightfixed: Number(heightfixed),
      u_raisingHeight: Number(raisingHeight),
    };
    if (mapTexture && this.texture) {
      // @ts-ignore
      commonOptions.u_texture = this.texture;
      this.textures = [this.texture];
    }
    const commonBufferInfo = this.getUniformsBufferInfo(commonOptions);
    return commonBufferInfo;
  }

  public async initModels(): Promise<IModel[]> {
    await this.loadTexture();
    return this.buildModels();
  }

  public async buildModels(): Promise<IModel[]> {
    const { frag, vert, type } = this.getShaders();
    this.initUniformsBuffer();
    const model = await this.layer.buildLayerModel({
      moduleName: type,
      vertexShader: vert,
      fragmentShader: frag,
      depth: { enable: true },
      defines: this.getDefines(),
      inject: this.getInject(),
      triangulation: PolygonExtrudeTriangulation,
    });
    return [model];
  }

  public getShaders() {
    const { pickLight, mapTexture } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;
    if (mapTexture) {
      return {
        frag: polygonExtrudeTexFrag,
        vert: polygonExtrudeTexVert,
        type: 'polygonExtrudeTexture',
      };
    }
    if (pickLight) {
      return {
        frag: polygonExtrudePickLightFrag,
        vert: polygonExtrudePickLightVert,
        type: 'polygonExtrudePickLight',
      };
    } else {
      return {
        frag: polygonExtrudeFrag,
        vert: polygonExtrudeVert,
        type: 'polygonExtrude',
      };
    }
  }

  public clearModels() {
    this.texture?.destroy();
    this.textures = [];
  }

  protected registerBuiltinAttributes() {
    const bounds = this.layer.getSource().extent;
    const lngLen = bounds[2] - bounds[0];
    const latLen = bounds[3] - bounds[1];

    // 注册 Position 属性 64 位地位部分，经纬度数据开启双精度，避免大于 22 层级以上出现数据偏移
    this.registerPosition64LowAttribute();

    this.styleAttributeService.registerStyleAttribute({
      name: 'uvs',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_uvs',
        shaderLocation: this.attributeLocation.UV,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          const lng = vertex[0];
          const lat = vertex[1];
          // 临时 兼容高德V2
          return [(lng - bounds[0]) / lngLen, (lat - bounds[1]) / latLen, vertex[4]];
        },
      },
    });
    this.styleAttributeService.registerStyleAttribute({
      name: 'normal',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Normal',
        shaderLocation: this.attributeLocation.NORMAL,
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.STATIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 3,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
          normal: number[],
        ) => {
          return normal;
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        shaderLocation: this.attributeLocation.SIZE,
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (feature: IEncodeFeature) => {
          const { size = 10 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });
  }

  private async loadTexture() {
    const { mapTexture } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;

    const { createTexture2D } = this.rendererService;
    this.texture = createTexture2D({
      height: 1,
      width: 1,
    });
    if (mapTexture) {
      const image = await loadImage(mapTexture);
      this.texture = createTexture2D({
        data: image,
        width: image.width,
        height: image.height,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
        min: gl.LINEAR,
        mag: gl.LINEAR,
      });
    }
  }
}
