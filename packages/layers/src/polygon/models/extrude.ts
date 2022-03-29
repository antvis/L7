import { AttributeType, gl, IEncodeFeature, IModel, ITexture2D } from '@antv/l7-core';
import { getMask } from '@antv/l7-utils';
import { isNumber } from 'lodash';
import BaseModel from '../../core/BaseModel';
import { IPolygonLayerStyleOptions } from '../../core/interface';
import { PolygonExtrudeTriangulation } from '../../core/triangulation';
// texture
import polygonExtrudeTexVert from '../shaders/extrude/polygon_extrudetex_vert.glsl';
import polygonExtrudeTexFrag from '../shaders/extrude/polygon_extrudetex_frag.glsl';
// extrude
import polygonExtrudeVert from '../shaders/extrude/polygon_extrude_vert.glsl';
import polygonExtrudeFrag from '../shaders/extrude/polygon_extrude_frag.glsl';
// extrude picking

import polygonExtrudePickLightFrag from '../shaders/extrude/polygon_extrude_picklight_frag.glsl';
import polygonExtrudePickLightVert from '../shaders/extrude/polygon_extrude_picklight_vert.glsl';

export default class ExtrudeModel extends BaseModel {
  protected texture: ITexture2D;
  public getUninforms() {
    const {
      opacity = 1,
      heightfixed = false,
      raisingHeight = 0,
    } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;

    if (this.dataTextureTest && this.dataTextureNeedUpdate({ opacity })) {
      this.judgeStyleAttributes({ opacity });
      const encodeData = this.layer.getEncodedData();
      const { data, width, height } = this.calDataFrame(
        this.cellLength,
        encodeData,
        this.cellProperties,
      );
      this.rowCount = height; // 当前数据纹理有多少行

      this.dataTexture =
        this.cellLength > 0 && data.length > 0
          ? this.createTexture2D({
              flipY: true,
              data,
              format: gl.LUMINANCE,
              type: gl.FLOAT,
              width,
              height,
            })
          : this.createTexture2D({
              flipY: true,
              data: [1],
              format: gl.LUMINANCE,
              type: gl.FLOAT,
              width: 1,
              height: 1,
            });
    }

    return {
      u_heightfixed: Number(heightfixed),
      u_dataTexture: this.dataTexture, // 数据纹理 - 有数据映射的时候纹理中带数据，若没有任何数据映射时纹理是 [1]
      u_cellTypeLayout: this.getCellTypeLayout(),
      u_raisingHeight: Number(raisingHeight),
      u_opacity: isNumber(opacity) ? opacity : 1.0,

      u_texture: this.texture
    };
  }

  public initModels(): IModel[] {
    this.loadTexture();
    return this.buildModels();
  }

  public buildModels(): IModel[] {
    const {
      mask = false,
      maskInside = true,
    } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;

    const { frag, vert, type } = this.getShaders();

    return [
      this.layer.buildLayerModel({
        moduleName: type,
        vertexShader: vert,
        fragmentShader: frag,
        triangulation: PolygonExtrudeTriangulation,
        stencil: getMask(mask, maskInside),
        cull: {
          enable: true,
          face: gl.BACK, //gl.FRONT | gl.BACK;
        }
      }),
    ];
  }

  public getShaders() {
    const {
      pickLight,
      mapTexture
    } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;
    if(mapTexture) {
      return {
        frag: polygonExtrudeTexFrag,
        vert: polygonExtrudeTexVert,
        type: 'polygonExtrudeTexture'
      }
    }
    if (pickLight) {
      return {
        frag: polygonExtrudePickLightFrag,
        vert: polygonExtrudePickLightVert,
        type: 'polygonExtrude',
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
    this.dataTexture?.destroy();
    this.texture?.destroy()
  }

  protected registerBuiltinAttributes() {
    const {
      mapTexture
    } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;

    if(mapTexture) {
      const bbox = this.layer.getSource().extent;
      const [minLng, minLat, maxLng, maxLat] = bbox;
      const lngLen = maxLng - minLng;
      const latLen = maxLat - minLat;
      // this.styleAttributeService.registerStyleAttribute({
      //   name: 'extrudeTopUv',
      //   type: AttributeType.Attribute,
      //   descriptor: {
      //     name: 'a_uv',
      //     buffer: {
      //       // give the WebGL driver a hint that this buffer may change
      //       usage: gl.STATIC_DRAW,
      //       data: [],
      //       type: gl.FLOAT,
      //     },
      //     size: 2,
      //     update: (
      //       feature: IEncodeFeature,
      //       featureIdx: number,
      //       vertex: number[],
      //       attributeIdx: number,
      //       normal: number[],
      //     ) => {
      //       const lng = vertex[0];
      //       const lat = vertex[1];
      //       return [(lng - minLng) / lngLen, (lat - minLat) / latLen];
      //     },
      //   },
      // });
      // 计算出来只有侧边值有效
      this.styleAttributeService.registerStyleAttribute({
        name: 'uvs',
        type: AttributeType.Attribute,
        descriptor: {
          name: 'a_uvs',
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
            const lng = vertex[0];
            const lat = vertex[1];
            return [(lng - minLng) / lngLen, (lat - minLat) / latLen, vertex[4]];
          },
        },
      });
    }
    // point layer size;
    this.styleAttributeService.registerStyleAttribute({
      name: 'normal',
      type: AttributeType.Attribute,
      descriptor: {
        name: 'a_Normal',
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
          const { size = 10 } = feature;
          return Array.isArray(size) ? [size[0]] : [size as number];
        },
      },
    });
  }

  private loadTexture() {
    const {
      mapTexture,
    } = this.layer.getLayerConfig() as IPolygonLayerStyleOptions;

    const { createTexture2D } = this.rendererService;
    this.texture = createTexture2D({
      height: 0,
      width: 0,
    });
    if(mapTexture) {
      const image = new Image();
      image.crossOrigin = '';
      image.src = mapTexture;
  
      image.onload = () => {
        this.texture = createTexture2D({
          data: image,
          width: image.width,
          height: image.height,
          wrapS: gl.CLAMP_TO_EDGE,
          wrapT: gl.CLAMP_TO_EDGE,
          min: gl.LINEAR,
          mag: gl.LINEAR,
        });
        this.layerService.updateLayerRenderList();
        this.layerService.renderLayers();
      };
    }
   
  }
}
