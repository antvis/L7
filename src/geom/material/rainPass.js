import { UniformSemantic, DataType, RenderState, BlendFunc } from '@ali/r3-base';
import { Material, RenderTechnique } from '@ali/r3-material';
import point_frag from '../shader/rainPass_frag.glsl';
import point_vert from '../shader/rainPass_vert.glsl';
export class RainPassMaterial extends Material {
  constructor(opt) {
    super(opt.name);

    // this._generateTechnique();

    for (const item in opt) {
      if (item.substr(0, 2) === 'u_') {
        this.setValue(item, opt[item]);
      }
    }
  }
  _generateTechnique() {

    const VERT_SHADER = point_vert;
    // 片元着色器
    const FRAG_SHADER = point_frag;
    // Technique 配置信息
    const cfg = {
      attributes: {
        a_position: {
          name: 'a_position',
          semantic: 'POSITION',
          type: DataType.FLOAT_VEC3
        },
        a_uv: {
          name: 'a_uv',
          semantic: 'TEXCOORD_0',
          type: DataType.FLOAT_VEC2
        }
      },
      uniforms: {
        matModelViewProjection: {
          name: 'matModelViewProjection',
          semantic: UniformSemantic.MODELVIEWPROJECTION,
          type: DataType.FLOAT_MAT4
        },
        u_texture: {
          name: 'u_texture',
          type: DataType.SAMPLER_2D
        },
        u_colorTexture: {
          name: 'u_colorTexture',
          type: DataType.SAMPLER_2D
        }

      }
    };

    // 创建 Technique
    const tech = new RenderTechnique('PointMaterial');
    tech.states = {
      disable: [ RenderState.CULL_FACE, RenderState.DEPTH_TEST ],
      enable: [ RenderState.BLEND ],
      functions: { blendFunc: [ BlendFunc.SRC_ALPHA, BlendFunc.ONE_MINUS_SRC_ALPHA ] }
    };
    tech.isValid = true;
    tech.uniforms = cfg.uniforms;
    tech.attributes = cfg.attributes;
    tech.vertexShader = VERT_SHADER;
    tech.fragmentShader = FRAG_SHADER;
    tech.customMacros = this._macros;
    this._technique = tech;
  }

  prepareDrawing(camera, component, primitive) {

    this.getAttributeDefines(camera, component, primitive);
    if (!this._technique) { this._generateTechnique(); }
    super.prepareDrawing(camera, component, primitive);

  }
  getAttributeDefines(camera, component, primitive) {
    this._macros = [];
    if (!primitive) return this._macros;

    const attribNames = Object.keys(primitive.vertexAttributes);
    if (attribNames.indexOf('SHAPE') !== -1) {
      this._macros.push('SHAPE');
    }
    if (attribNames.indexOf('TEXCOORD_0') !== -1) {
      this._macros.push('TEXCOORD_0');
    }

  }

}
