import {
  AttributeType,
  gl,
  ICameraService,
  IEncodeFeature,
  IFramebuffer,
  ILayer,
  ILayerPlugin,
  ILogService,
  IModel,
  IStyleAttributeService,
  ITexture2D,
  lazyInject,
  TYPES,
} from '@l7/core';
import { mat4 } from 'gl-matrix';
import BaseLayer from '../core/BaseLayer';
import { HeatmapTriangulation } from '../core/triangulation';
import { generateColorRamp, IColorRamp } from '../utils/color';
import heatmap3DFrag from './shaders/heatmap_3d_frag.glsl';
import heatmap3DVert from './shaders/heatmap_3d_vert.glsl';
import heatmapColorFrag from './shaders/heatmap_frag.glsl';
import heatmapFrag from './shaders/heatmap_framebuffer_frag.glsl';
import heatmapVert from './shaders/heatmap_framebuffer_vert.glsl';
import heatmapColorVert from './shaders/heatmap_vert.glsl';
import { heatMap3DTriangulation } from './triangulation';

interface IHeatMapLayerStyleOptions {
  opacity: number;
  intensity: number;
  radius: number;
  rampColors: IColorRamp;
}

export default class HeatMapLayer extends BaseLayer<IHeatMapLayerStyleOptions> {
  public name: string = 'HeatMapLayer';
  protected texture: ITexture2D;
  protected colorTexture: ITexture2D;
  @lazyInject(TYPES.ICameraService)
  protected readonly camera: ICameraService;
  protected heatmapFramerBuffer: IFramebuffer;
  private intensityModel: IModel;
  private colorModel: IModel;

  protected getConfigSchema() {
    return {
      properties: {
        opacity: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
      },
    };
  }

  protected renderModels() {
    const { clear, useFramebuffer } = this.rendererService;
    const shapeAttr = this.styleAttributeService.getLayerStyleAttribute(
      'shape',
    );
    const shapeType = shapeAttr?.scale?.field || 'heatmap';
    useFramebuffer(this.heatmapFramerBuffer, () => {
      clear({
        color: [0, 0, 0, 0],
        depth: 1,
        stencil: 0,
        framebuffer: this.heatmapFramerBuffer,
      });
      this.drawIntensityMode();
    });
    // this.draw3DHeatMap();
    shapeType === 'heatmap' ? this.drawColorMode() : this.draw3DHeatMap();
    // this.drawIntensityMode();
    return this;
  }

  protected buildModels() {
    const shapeAttr = this.styleAttributeService.getLayerStyleAttribute(
      'shape',
    );
    const shapeType = shapeAttr?.scale?.field || 'heatmap';
    this.registerBuiltinAttributes(this);
    this.intensityModel = this.buildHeatMapIntensity();
    this.models = [this.intensityModel];
    this.colorModel =
      shapeType === 'heatmap'
        ? this.buildHeatmapColor()
        : this.build3dHeatMap();
    this.models.push(this.colorModel);
    const { rampColors } = this.getStyleOptions();
    const imageData = generateColorRamp(rampColors as IColorRamp);
    const {
      createFramebuffer,
      clear,
      getViewportSize,
      createTexture2D,
      useFramebuffer,
    } = this.rendererService;

    const { width, height } = getViewportSize();
    this.heatmapFramerBuffer = createFramebuffer({
      color: createTexture2D({
        width,
        height,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
        min: gl.LINEAR,
        mag: gl.LINEAR,
      }),
    });

    this.colorTexture = createTexture2D({
      data: imageData.data,
      width: imageData.width,
      height: imageData.height,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      min: gl.LINEAR,
      mag: gl.LINEAR,
      flipY: true,
    });
  }

  private registerBuiltinAttributes(layer: ILayer) {
    layer.styleAttributeService.registerStyleAttribute({
      name: 'dir',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Dir',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          return [vertex[3], vertex[4]];
        },
      },
    });

    // point layer size;
    layer.styleAttributeService.registerStyleAttribute({
      name: 'size',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Size',
        buffer: {
          // give the WebGL driver a hint that this buffer may change
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 1,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
          attributeIdx: number,
        ) => {
          const { size = 2 } = feature;
          return [size as number];
        },
      },
    });
  }

  private buildHeatMapIntensity(): IModel {
    return this.buildLayerModel({
      moduleName: 'heatmapintensity',
      vertexShader: heatmapVert,
      fragmentShader: heatmapFrag,
      triangulation: HeatmapTriangulation,
      depth: {
        enable: false,
      },
      blend: {
        enable: true,
        func: {
          srcRGB: gl.ONE,
          srcAlpha: gl.ONE_MINUS_SRC_ALPHA,
          dstRGB: gl.ONE,
          dstAlpha: gl.ONE_MINUS_SRC_ALPHA,
        },
      },
    });
  }

  private buildHeatmapColor(): IModel {
    this.shaderModuleService.registerModule('heatmapColor', {
      vs: heatmapColorVert,
      fs: heatmapColorFrag,
    });

    const { vs, fs, uniforms } = this.shaderModuleService.getModule(
      'heatmapColor',
    );
    const {
      createAttribute,
      createElements,
      createBuffer,
      createModel,
    } = this.rendererService;
    return createModel({
      vs,
      fs,
      attributes: {
        a_Position: createAttribute({
          buffer: createBuffer({
            data: [-1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0],
            type: gl.FLOAT,
          }),
          size: 3,
        }),
        a_Uv: createAttribute({
          buffer: createBuffer({
            data: [0, 1, 1, 1, 0, 0, 1, 0],
            type: gl.FLOAT,
          }),
          size: 2,
        }),
      },
      uniforms: {
        ...uniforms,
      },
      depth: {
        enable: false,
      },
      blend: {
        enable: true,
        func: {
          srcRGB: gl.SRC_ALPHA,
          srcAlpha: 1,
          dstRGB: gl.ONE_MINUS_SRC_ALPHA,
          dstAlpha: 1,
        },
      },
      count: 6,
      elements: createElements({
        data: [0, 2, 1, 2, 3, 1],
        type: gl.UNSIGNED_INT,
        count: 6,
      }),
    });
  }
  private drawIntensityMode() {
    const { opacity, intensity = 10, radius = 5 } = this.getStyleOptions();
    this.intensityModel.draw({
      uniforms: {
        u_opacity: opacity || 1.0,
        u_radius: radius,
        u_intensity: intensity,
      },
    });
  }

  private drawColorMode() {
    const { opacity } = this.getStyleOptions();
    this.colorModel.draw({
      uniforms: {
        u_opacity: opacity || 1.0,
        u_colorTexture: this.colorTexture,
        u_texture: this.heatmapFramerBuffer,
      },
    });
  }
  private draw3DHeatMap() {
    const { opacity } = this.getStyleOptions();
    const invert = mat4.invert(
      mat4.create(),
      // @ts-ignore
      mat4.fromValues(...this.camera.getViewProjectionMatrix()),
    ) as mat4;
    this.colorModel.draw({
      uniforms: {
        u_opacity: opacity || 1.0,
        u_colorTexture: this.colorTexture,
        u_texture: this.heatmapFramerBuffer,
        u_InverseViewProjectionMatrix: [...invert],
      },
    });
  }
  private build3dHeatMap() {
    const { getViewportSize } = this.rendererService;
    const { width, height } = getViewportSize();
    const triangulation = heatMap3DTriangulation(width / 2.0, height / 2.0);
    this.shaderModuleService.registerModule('heatmap3dColor', {
      vs: heatmap3DVert,
      fs: heatmap3DFrag,
    });

    const { vs, fs, uniforms } = this.shaderModuleService.getModule(
      'heatmap3dColor',
    );
    const {
      createAttribute,
      createElements,
      createBuffer,
      createModel,
    } = this.rendererService;
    return createModel({
      vs,
      fs,
      attributes: {
        a_Position: createAttribute({
          buffer: createBuffer({
            data: triangulation.vertices,
            type: gl.FLOAT,
          }),
          size: 3,
        }),
        a_Uv: createAttribute({
          buffer: createBuffer({
            data: triangulation.uvs,
            type: gl.FLOAT,
          }),
          size: 2,
        }),
      },
      primitive: gl.TRIANGLES,
      uniforms: {
        ...uniforms,
      },
      depth: {
        enable: true,
      },
      blend: {
        enable: true,
        func: {
          srcRGB: gl.SRC_ALPHA,
          srcAlpha: 1,
          dstRGB: gl.ONE_MINUS_SRC_ALPHA,
          dstAlpha: 1,
        },
      },
      elements: createElements({
        data: triangulation.indices,
        type: gl.UNSIGNED_INT,
        count: triangulation.indices.length,
      }),
    });
  }
}
