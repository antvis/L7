import type {
  IBuffer,
  IEncodeFeature,
  IFramebuffer,
  IModel,
  IModelUniform,
  IRenderOptions,
  ITexture2D,
} from '@antv/l7-core';
import { AttributeType, TextureUsage, gl } from '@antv/l7-core';
import type { IColorRamp } from '@antv/l7-utils';
import { generateColorRamp, lodashUtil } from '@antv/l7-utils';
import { mat4 } from 'gl-matrix';
import BaseModel from '../../core/BaseModel';
import type { IHeatMapLayerStyleOptions } from '../../core/interface';
import { HeatmapTriangulation } from '../../core/triangulation';
import heatmap_3d_frag from '../shaders/heatmap/heatmap_3d_frag.glsl';
import heatmap_3d_vert from '../shaders/heatmap/heatmap_3d_vert.glsl';

// 绘制平面热力的 shader
import heatmap_frag from '../shaders/heatmap/heatmap_frag.glsl';
import heatmap_vert from '../shaders/heatmap/heatmap_vert.glsl';

import heatmap_framebuffer_frag from '../shaders/heatmap/heatmap_framebuffer_frag.glsl';
import heatmap_framebuffer_vert from '../shaders/heatmap/heatmap_framebuffer_vert.glsl';
import { heatMap3DTriangulation } from '../triangulation';
const { isEqual } = lodashUtil;

export default class HeatMapModel extends BaseModel {
  protected get attributeLocation() {
    return Object.assign(super.attributeLocation, {
      MAX: super.attributeLocation.MAX,
      SIZE: 9,
      UV: 10,
      DIR: 11,
    });
  }

  protected texture: ITexture2D;
  protected colorTexture: ITexture2D;
  protected heatmapFramerBuffer: IFramebuffer;
  protected heatmapTexture: ITexture2D;
  private intensityModel: IModel;
  private colorModel: IModel;
  private shapeType: string;
  private preRampColors: IColorRamp;
  private colorModelUniformBuffer: IBuffer[] = [];
  private heat3DModelUniformBuffer: IBuffer[] = [];

  public prerender() {
    const { clear, useFramebuffer } = this.rendererService;
    useFramebuffer(this.heatmapFramerBuffer, () => {
      clear({
        color: [0, 0, 0, 0],
        depth: 1,
        stencil: 0,
        framebuffer: this.heatmapFramerBuffer,
      });
      this.drawIntensityMode(); // 密度图
    });
  }

  public render(options: Partial<IRenderOptions>) {
    const { rampColors } = this.layer.getLayerConfig() as IHeatMapLayerStyleOptions;

    if (!isEqual(this.preRampColors, rampColors)) {
      this.updateColorTexture();
    }
    this.shapeType === 'heatmap'
      ? this.drawHeatMap(options) // 2D
      : this.draw3DHeatMap(options); // 3D
  }

  public getUninforms(): IModelUniform {
    throw new Error('Method not implemented.');
  }

  public async initModels(): Promise<IModel[]> {
    const { createFramebuffer, getViewportSize, createTexture2D } = this.rendererService;
    const shapeAttr = this.styleAttributeService.getLayerStyleAttribute('shape');
    const shapeType = shapeAttr?.scale?.field || 'heatmap';
    this.shapeType = shapeType as string;
    // 生成热力图密度图
    this.intensityModel = await this.buildHeatMapIntensity();
    // 渲染到屏幕
    this.colorModel =
      shapeType === 'heatmap'
        ? this.buildHeatmap() // 2D
        : this.build3dHeatMap(); // 3D

    const { width, height } = getViewportSize();

    // 初始化密度图纹理
    this.heatmapTexture = createTexture2D({
      width: Math.floor(width / 4),
      height: Math.floor(height / 4),
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      min: gl.LINEAR,
      mag: gl.LINEAR,
      usage: TextureUsage.RENDER_TARGET,
    });
    this.heatmapFramerBuffer = createFramebuffer({
      color: this.heatmapTexture,
      depth: true,
      width: Math.floor(width / 4),
      height: Math.floor(height / 4),
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
        shaderLocation: this.attributeLocation.DIR,
        buffer: {
          usage: gl.DYNAMIC_DRAW,
          data: [],
          type: gl.FLOAT,
        },
        size: 2,
        update: (feature: IEncodeFeature, featureIdx: number, vertex: number[]) => {
          return [vertex[3], vertex[4]];
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

  /**
   * 热力图密度图
   */
  private async buildHeatMapIntensity() {
    this.uniformBuffers = [
      this.rendererService.createBuffer({
        // opacity
        data: new Float32Array(4).fill(0), // 长度需要大于等于 4
        isUBO: true,
      }),
    ];
    this.layer.triangulation = HeatmapTriangulation;
    const model = await this.layer.buildLayerModel({
      moduleName: 'heatmapIntensity',
      vertexShader: heatmap_framebuffer_vert,
      fragmentShader: heatmap_framebuffer_frag,
      triangulation: HeatmapTriangulation,
      defines: this.getDefines(),

      depth: {
        enable: false,
      },
      cull: {
        enable: true,
        face: gl.FRONT,
      },
    });
    return model;
  }

  private buildHeatmap(): IModel {
    this.shaderModuleService.registerModule('heatmapColor', {
      vs: heatmap_vert,
      fs: heatmap_frag,
    });

    this.colorModelUniformBuffer = [
      this.rendererService.createBuffer({
        // opacity
        data: new Float32Array(4).fill(0), // 长度需要大于等于 4
        isUBO: true,
      }),
    ];
    const { vs, fs, uniforms } = this.shaderModuleService.getModule('heatmapColor');
    const { createAttribute, createElements, createBuffer, createModel } = this.rendererService;
    return createModel({
      vs,
      fs,
      uniformBuffers: [...this.colorModelUniformBuffer, ...this.rendererService.uniformBuffers],
      attributes: {
        a_Position: createAttribute({
          shaderLocation: this.attributeLocation.POSITION,
          buffer: createBuffer({
            data: [-1, 1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0],
            type: gl.FLOAT,
          }),
          size: 3,
        }),
        a_Uv: createAttribute({
          shaderLocation: this.attributeLocation.UV,
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

  private build3dHeatMap() {
    const { getViewportSize } = this.rendererService;
    const { width, height } = getViewportSize();
    const triangulation = heatMap3DTriangulation(width / 4.0, height / 4.0);
    this.shaderModuleService.registerModule('heatmap3dColor', {
      vs: heatmap_3d_vert,
      fs: heatmap_3d_frag,
    });

    this.heat3DModelUniformBuffer = [
      this.rendererService.createBuffer({
        // opacity
        data: new Float32Array(16 * 2 + 4).fill(0), // 长度需要大于等于 4
        isUBO: true,
      }),
    ];
    const { vs, fs, uniforms } = this.shaderModuleService.getModule('heatmap3dColor');
    const { createAttribute, createElements, createBuffer, createModel } = this.rendererService;

    return createModel({
      vs,
      fs,
      attributes: {
        a_Position: createAttribute({
          shaderLocation: this.attributeLocation.POSITION,
          buffer: createBuffer({
            data: triangulation.vertices,
            type: gl.FLOAT,
          }),
          size: 3,
        }),
        a_Uv: createAttribute({
          shaderLocation: this.attributeLocation.UV,
          buffer: createBuffer({
            data: triangulation.uvs,
            type: gl.FLOAT,
          }),
          size: 2,
        }),
      },
      primitive: gl.TRIANGLES,
      uniformBuffers: [...this.heat3DModelUniformBuffer, ...this.rendererService.uniformBuffers],
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

  // 绘制密度图
  private drawIntensityMode() {
    const { intensity = 10, radius = 5 } = this.layer.getLayerConfig() as IHeatMapLayerStyleOptions;
    const commonOptions = {
      u_radius: radius,
      u_intensity: intensity,
    };

    this.uniformBuffers[0].subData({
      offset: 0,
      data: [radius, intensity],
    });
    this.layerService.beforeRenderData(this.layer);
    this.layer.hooks.beforeRender.call();

    // 绘制密度图
    this.intensityModel?.draw({
      uniforms: commonOptions,
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

  private drawHeatMap(options: Partial<IRenderOptions>) {
    const { opacity = 1.0 } = this.layer.getLayerConfig() as IHeatMapLayerStyleOptions;
    const commonOptions = {
      u_opacity: opacity,
      u_colorTexture: this.colorTexture,
      u_texture: this.heatmapFramerBuffer,
    };
    const textures = [this.heatmapTexture, this.colorTexture];
    this.colorModelUniformBuffer[0].subData({
      offset: 0,
      data: [opacity],
    });
    this.colorModel?.draw({
      uniforms: commonOptions,
      textures,
      blend: this.getBlend(),
      stencil: this.getStencil(options),
    });
  }

  private draw3DHeatMap(options: Partial<IRenderOptions>) {
    const { opacity = 1.0 } = this.layer.getLayerConfig() as IHeatMapLayerStyleOptions;

    const invert = mat4.create();
    mat4.invert(invert, this.cameraService.getViewProjectionMatrixUncentered() as mat4);

    const commonOptions = {
      u_opacity: opacity,
      u_colorTexture: this.colorTexture,
      u_texture: this.heatmapFramerBuffer,
      u_ViewProjectionMatrixUncentered: this.cameraService.getViewProjectionMatrixUncentered(),
      u_InverseViewProjectionMatrix: [...invert],
    };

    this.heat3DModelUniformBuffer[0].subData({
      offset: 0,
      data: [
        ...commonOptions.u_ViewProjectionMatrixUncentered,
        ...commonOptions.u_InverseViewProjectionMatrix,
        opacity,
      ],
    });
    const textures = [this.heatmapTexture, this.colorTexture];
    this.colorModel?.draw({
      uniforms: commonOptions,
      textures,
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

  private updateColorTexture() {
    const { createTexture2D } = this.rendererService;
    if (this.texture) {
      this.texture.destroy();
    }

    const { rampColors } = this.layer.getLayerConfig() as IHeatMapLayerStyleOptions;
    const imageData = generateColorRamp(rampColors as IColorRamp);
    this.colorTexture = createTexture2D({
      data: imageData.data,
      usage: TextureUsage.SAMPLED,
      width: imageData.width,
      height: imageData.height,
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      min: gl.NEAREST,
      mag: gl.NEAREST,
      flipY: false,
      unorm: true,
    });

    this.preRampColors = rampColors;
  }
}
