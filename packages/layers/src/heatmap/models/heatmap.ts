import {
  AttributeType,
  gl,
  IEncodeFeature,
  IFramebuffer,
  IModel,
  IModelUniform,
  IRenderOptions,
  ITexture2D,
} from '@antv/l7-core';
import { generateColorRamp, getCullFace, IColorRamp } from '@antv/l7-utils';
import { mat4 } from 'gl-matrix';
import { injectable } from 'inversify';
import 'reflect-metadata';
import BaseModel from '../../core/BaseModel';
import { IHeatMapLayerStyleOptions } from '../../core/interface';
import { HeatmapTriangulation } from '../../core/triangulation';
import heatmap3DFrag from '../shaders/heatmap_3d_frag.glsl';
import heatmap3DVert from '../shaders/heatmap_3d_vert.glsl';

// 绘制平面热力的 shader
import heatmapColorFrag from '../shaders/heatmap_frag.glsl';
import heatmapColorVert from '../shaders/heatmap_vert.glsl';

import heatmapFramebufferFrag from '../shaders/heatmap_framebuffer_frag.glsl';
import heatmapFramebufferVert from '../shaders/heatmap_framebuffer_vert.glsl';

import { isEqual } from 'lodash';
import { heatMap3DTriangulation } from '../triangulation';
@injectable()
export default class HeatMapModel extends BaseModel {
  protected texture: ITexture2D;
  protected colorTexture: ITexture2D;
  protected heatmapFramerBuffer: IFramebuffer;
  private intensityModel: IModel;
  private colorModel: IModel;
  private shapeType: string;
  private preRampColors: IColorRamp;

  public render(options: Partial<IRenderOptions>) {
    const { clear, useFramebuffer } = this.rendererService;
    const { rampColors } =
      this.layer.getLayerConfig() as IHeatMapLayerStyleOptions;

    useFramebuffer(this.heatmapFramerBuffer, () => {
      clear({
        color: [0, 0, 0, 0],
        depth: 1,
        stencil: 0,
        framebuffer: this.heatmapFramerBuffer,
      });
      this.drawIntensityMode();
    });
    if (!isEqual(this.preRampColors, rampColors)) {
      this.updateColorTexture();
    }
    this.shapeType === 'heatmap'
      ? this.drawColorMode(options)
      : this.draw3DHeatMap(options);
  }

  public getUninforms(): IModelUniform {
    throw new Error('Method not implemented.');
  }

  public async initModels(): Promise<IModel[]> {
    const { createFramebuffer, getViewportSize, createTexture2D } =
      this.rendererService;
    const shapeAttr =
      this.styleAttributeService.getLayerStyleAttribute('shape');
    const shapeType = shapeAttr?.scale?.field || 'heatmap';
    this.shapeType = shapeType as string;
    // 生成热力图密度图
    this.intensityModel = await this.buildHeatMapIntensity();
    // 渲染到屏幕
    this.colorModel =
      shapeType === 'heatmap'
        ? this.buildHeatmapColor() // 2D
        : this.build3dHeatMap(); // 3D

    const { width, height } = getViewportSize();

    // 初始化密度图纹理
    this.heatmapFramerBuffer = createFramebuffer({
      color: createTexture2D({
        width: Math.floor(width / 4),
        height: Math.floor(height / 4),
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
        min: gl.LINEAR,
        mag: gl.LINEAR,
      }),
      depth: false,
    });

    this.updateColorTexture();
    return [this.intensityModel, this.colorModel];
  }

  public async buildModels(): Promise<IModel[]> {
    return this.initModels();
  }

  protected registerBuiltinAttributes() {
    this.styleAttributeService.registerStyleAttribute({
      name: 'dir',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Dir',
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (
          feature: IEncodeFeature,
          featureIdx: number,
          vertex: number[],
        ) => {
          return [vertex[3], vertex[4]];
        },
      },
    });

    this.styleAttributeService.registerStyleAttribute({
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
        update: (feature: IEncodeFeature) => {
          const { size = 1 } = feature;
          return [size as number];
        },
      },
    });
  }
  private async buildHeatMapIntensity() {
    this.layer.triangulation = HeatmapTriangulation;
    const model = await this.layer.buildLayerModel({
      moduleName: 'heatmapIntensity',
      vertexShader: heatmapFramebufferVert,
      fragmentShader: heatmapFramebufferFrag,
      triangulation: HeatmapTriangulation,
      depth: {
        enable: false,
      },
      cull: {
        enable: true,
        face: getCullFace(this.mapService.version),
      },
    });
    return model;
  }

  private buildHeatmapColor(): IModel {
    this.shaderModuleService.registerModule('heatmapColor', {
      vs: heatmapColorVert,
      fs: heatmapColorFrag,
    });

    const { vs, fs, uniforms } =
      this.shaderModuleService.getModule('heatmapColor');
    const { createAttribute, createElements, createBuffer, createModel } =
      this.rendererService;
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
      elements: createElements({
        data: [0, 2, 1, 2, 3, 1],
        type: gl.UNSIGNED_INT,
        count: 6,
      }),
    });
  }

  private drawIntensityMode() {
    const {
      opacity,
      intensity = 10,
      radius = 5,
    } = this.layer.getLayerConfig() as IHeatMapLayerStyleOptions;

    this.layerService.beforeRenderData(this.layer);
    this.layer.hooks.beforeRender.call();
    // 绘制密度图
    this.intensityModel?.draw({
      uniforms: {
        u_opacity: opacity || 1.0,
        u_radius: radius,
        u_intensity: intensity,
      },
      blend: {
        enable: true,
        func: {
          srcRGB: gl.ONE,
          srcAlpha: 1,
          dstRGB: gl.ONE,
          dstAlpha: 1,
        },
      },
      stencil: {
        enable: false,
        mask: 0xff,
        func: {
          cmp: 514, // gl.EQUAL,
          ref: 1,
          mask: 0xff,
        },
      },
    });

    this.layer.hooks.afterRender.call();
  }

  private drawColorMode(options: Partial<IRenderOptions>) {
    const { opacity } =
      this.layer.getLayerConfig() as IHeatMapLayerStyleOptions;
    this.colorModel?.draw({
      uniforms: {
        u_opacity: opacity || 1.0,
        u_colorTexture: this.colorTexture,
        u_texture: this.heatmapFramerBuffer,
      },
      blend: this.getBlend(),
      stencil: this.getStencil(options),
    });
  }

  private draw3DHeatMap(options: Partial<IRenderOptions>) {
    const { opacity } =
      this.layer.getLayerConfig() as IHeatMapLayerStyleOptions;

    // const invert = mat4.invert(
    //   mat4.create(),
    //   mat4.fromValues(
    //     // @ts-ignore
    //     ...this.cameraService.getViewProjectionMatrixUncentered(),
    //   ),
    // ) as mat4;
    const invert = mat4.create();
    mat4.invert(
      invert,
      this.cameraService.getViewProjectionMatrixUncentered() as mat4,
    );

    this.colorModel?.draw({
      uniforms: {
        u_opacity: opacity || 1.0,
        u_colorTexture: this.colorTexture,
        u_texture: this.heatmapFramerBuffer,
        u_ViewProjectionMatrixUncentered:
          this.cameraService.getViewProjectionMatrixUncentered(),
        u_InverseViewProjectionMatrix: [...invert],
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
      stencil: this.getStencil(options),
    });
  }
  private build3dHeatMap() {
    const { getViewportSize } = this.rendererService;
    const { width, height } = getViewportSize();
    const triangulation = heatMap3DTriangulation(width / 4.0, height / 4.0);
    this.shaderModuleService.registerModule('heatmap3dColor', {
      vs: heatmap3DVert,
      fs: heatmap3DFrag,
    });

    const { vs, fs, uniforms } =
      this.shaderModuleService.getModule('heatmap3dColor');
    const { createAttribute, createElements, createBuffer, createModel } =
      this.rendererService;
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
  private updateStyle() {
    this.updateColorTexture();
  }

  private updateColorTexture() {
    const { createTexture2D } = this.rendererService;
    if (this.texture) {
      this.texture.destroy();
    }

    const { rampColors } =
      this.layer.getLayerConfig() as IHeatMapLayerStyleOptions;
    const imageData = generateColorRamp(rampColors as IColorRamp);
    this.colorTexture = createTexture2D({
      data: new Uint8Array(imageData.data),
      width: imageData.width,
      height: imageData.height,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      min: gl.NEAREST,
      mag: gl.NEAREST,
      flipY: false,
    });

    this.preRampColors = rampColors;
  }
}
