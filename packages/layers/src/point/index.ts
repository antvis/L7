import {
  gl,
  ILayer,
  IRendererService,
  IShaderModuleService,
  lazyInject,
  packCircleVertex,
  TYPES,
} from '@l7/core';
import { featureEach } from '@turf/meta';
import BaseLayer from '../core/BaseLayer';
import circleFrag from './shaders/circle_frag.glsl';
import circleVert from './shaders/circle_vert.glsl';

export interface IPointLayerStyleOptions {
  pointShape: string;
  pointColor: [number, number, number];
  pointRadius: number;
  pointOpacity: number;
  strokeWidth: number;
  strokeColor: [number, number, number];
  strokeOpacity: number;
}

interface IPointFeature {
  coordinates: [number, number] | [number, number];
  [key: string]: any;
}

/**
 * PointLayer
 */
export default class PointLayer extends BaseLayer {
  public styleOptions: IPointLayerStyleOptions = {
    pointShape: 'circle',
    pointColor: [81, 187, 214],
    pointRadius: 10,
    pointOpacity: 1,
    strokeWidth: 2,
    strokeColor: [255, 255, 255],
    strokeOpacity: 1,
  };

  public name: string = 'pointLayer';

  @lazyInject(TYPES.IShaderModuleService)
  private readonly shaderModule: IShaderModuleService;

  @lazyInject(TYPES.IRendererService)
  private readonly renderer: IRendererService;

  private pointFeatures: IPointFeature[] = [];

  // public style(options: Partial<IPointLayerStyleOptions>) {
  //   // this.layerStyleService.update(options);
  //   // this.styleOptions = {
  //   //   ...this.styleOptions,
  //   //   ...options,
  //   // };
  // }

  public render(): ILayer {
    this.models.forEach((model) =>
      model.draw({
        uniforms: {
          u_ModelMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
          u_stroke_width: 1,
          u_blur: 0,
          u_opacity: 1,
          u_stroke_color: [1, 1, 1, 1],
          u_stroke_opacity: 1,
        },
      }),
    );
    return this;
  }

  protected buildModels() {
    this.shaderModule.registerModule('circle', {
      vs: circleVert,
      fs: circleFrag,
    });

    this.models = [];
    const { vs, fs, uniforms } = this.shaderModule.getModule('circle');
    // TODO: fix me
    const source = this.getSource();
    featureEach(
      // @ts-ignore
      source.originData,
      ({ geometry: { coordinates }, properties }) => {
        this.pointFeatures.push({
          coordinates,
        });
      },
    );

    const {
      packedBuffer,
      packedBuffer2,
      packedBuffer3,
      indexBuffer,
      positionBuffer,
      // @ts-ignore
    } = this.buildPointBuffers(this.pointFeatures);

    const {
      createAttribute,
      createBuffer,
      createElements,
      createModel,
    } = this.renderer;

    this.models.push(
      createModel({
        attributes: {
          a_Position: createAttribute({
            buffer: createBuffer({
              data: positionBuffer,
              type: gl.FLOAT,
            }),
          }),
          a_packed_data: createAttribute({
            buffer: createBuffer({
              data: packedBuffer,
              type: gl.FLOAT,
            }),
          }),
        },
        uniforms,
        fs,
        vs,
        count: indexBuffer.length,
        primitive: gl.TRIANGLES,
        elements: createElements({
          data: indexBuffer,
          type: gl.UNSIGNED_INT,
        }),
        depth: { enable: false },
        blend: {
          enable: true,
          func: {
            srcRGB: gl.SRC_ALPHA,
            srcAlpha: 1,
            dstRGB: gl.ONE_MINUS_SRC_ALPHA,
            dstAlpha: 1,
          },
        },
      }),
    );
  }

  private buildPointBuffers(pointFeatures: IPointFeature[]) {
    const packedBuffer: number[][] = [];
    const packedBuffer2: number[][] = [];
    const packedBuffer3: number[][] = [];
    const positionBuffer: number[][] = [];
    const indexBuffer: Array<[number, number, number]> = [];

    const {
      pointColor,
      pointRadius,
      pointShape,
      pointOpacity,
      strokeColor,
      strokeWidth,
      strokeOpacity,
    } = this.styleOptions;

    let i = 0;
    pointFeatures.forEach((pointFeature) => {
      // TODO: 判断是否使用瓦片坐标
      const [tileX, tileY] = pointFeature.coordinates;

      // 压缩顶点数据
      // TODO: 某些变量通过 uniform 而非 vertex attribute 传入
      const {
        packedBuffer: packed1,
        packedBuffer2: packed2,
        packedBuffer3: packed3,
      } = packCircleVertex({
        color: [...pointColor, 255],
        radius: pointRadius,
        tileX: 0,
        tileY: 0,
        shape: pointShape,
        opacity: pointOpacity,
        strokeColor: [...strokeColor, 255],
        strokeOpacity,
        strokeWidth,
      });
      packedBuffer.push(...packed1);
      packedBuffer2.push(...packed2);
      packedBuffer3.push(...packed3);

      // 经纬度坐标
      positionBuffer.push([tileX, tileY]);
      positionBuffer.push([tileX, tileY]);
      positionBuffer.push([tileX, tileY]);
      positionBuffer.push([tileX, tileY]);

      // 构造 index
      indexBuffer.push([0 + i, 1 + i, 2 + i]);
      indexBuffer.push([2 + i, 3 + i, 0 + i]);
      i += 4;
    });

    return {
      packedBuffer,
      packedBuffer2,
      packedBuffer3,
      indexBuffer,
      positionBuffer,
    };
  }
}
