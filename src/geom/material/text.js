import { UniformSemantic, DataType, RenderState, BlendFunc } from '@ali/r3-base';
import { Material, RenderTechnique } from '@ali/r3-material';
import point_frag from '../shader/text_frag.glsl';
import point_vert from '../shader/text_vert.glsl';
export class TextMaterial extends Material {
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
          type: DataType.FLOAT_VEC4
        },
        a_color: {
          name: 'a_color',
          semantic: 'COLOR',
          type: DataType.FLOAT_VEC4
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
        u_model: {
          name: 'u_model',
          semantic: UniformSemantic.MODEL,
          type: DataType.FLOAT_MAT4
        },
        u_view: {
          name: 'u_view',
          semantic: UniformSemantic.VIEW,
          type: DataType.FLOAT_MAT4
        },
        u_projection: {
          name: 'u_projection',
          semantic: UniformSemantic.PROJECTION,
          type: DataType.FLOAT_MAT4
        },
        u_texture: {
          name: 'u_texture',
          type: DataType.SAMPLER_2D
        },
        u_stroke: {
          name: 'u_stroke',
          type: DataType.FLOAT_VEC4
        },
        u_strokeWidth: {
          name: 'u_strokeWidth',
          type: DataType.FLOAT
        },
        u_textSize: {
          name: 'u_textSize',
          type: DataType.FLOAT_VEC2
        },
        u_color: {
          name: 'u_color',
          type: DataType.FLOAT_VEC4
        },
        u_buffer: {
          name: 'u_buffer',
          type: DataType.FLOAT
        },
        u_scale: {
          name: 'u_scale',
          type: DataType.FLOAT_MAT4
        },
        u_gamma: {
          name: 'u_gamma',
          type: DataType.FLOAT
        }
      }
    };

    // 创建 Technique
    const tech = new RenderTechnique('TextMaterial');
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
