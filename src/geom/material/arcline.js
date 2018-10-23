import { UniformSemantic, DataType, RenderState, BlendFunc } from '@ali/r3-base';
import { Material, RenderTechnique } from '@ali/r3-material';
export function ArclineMaterial() {
  const tech = requireGeometryTechnique();
  const newMtl = new Material('MeshlineTech_mtl');
  newMtl.technique = tech;
  newMtl.setValue('segmentNumber', 50.0);
  return newMtl;
}

function requireGeometryTechnique() {
  // 顶点着色器
  const VERT_SHADER = `
    precision mediump float;
    attribute vec3 a_position;
    attribute vec3 a_color;
    attribute vec4 a_instance;
    uniform mat4 matModelViewProjection;
    uniform float segmentNumber;  
    varying vec3 v_color;

    float getSegmentRatio(float index) {
      return smoothstep(0.0, 1.0, index / (segmentNumber - 1.0));
    }

    float paraboloid(vec2 source, vec2 target, float ratio) {
        vec2 x = mix(source, target, ratio);
        vec2 center = mix(source, target, 0.5);
        float dSourceCenter = distance(source, center);
        float dXCenter = distance(x, center);
        return (dSourceCenter + dXCenter) * (dSourceCenter - dXCenter)*0.6;
    }

    vec3 getPos(vec2 source, vec2 target, float height, float segmentRatio) {
        return vec3(
        mix(source, target, segmentRatio),
        sqrt(max(0.0, height))
        );
    }

    void main() {
      vec2 source = a_instance.rg;
      vec2 target = a_instance.ba;
      float segmentIndex = a_position.x;
      float segmentRatio = getSegmentRatio(segmentIndex);
      vec3 c1 = vec3(0.929,0.972,0.917);
      vec3 c2 = vec3(0.062,0.325,0.603); 
      v_color = mix(c1, c2, segmentRatio);
      float height = paraboloid(source, target, segmentRatio);
      vec3 position = getPos(source,target,height,segmentRatio);
      gl_Position = matModelViewProjection * vec4(position, 1.0);
    }
  `;

  // 片元着色器
  const FRAG_SHADER = `
  precision mediump float;
  varying vec3 v_color;

  void main() {
    gl_FragColor = vec4(v_color,1.0);
  }
  `;

  // Technique 配置信息
  const cfg = {
    attributes: {
      a_position: {
        name: 'a_position',
        semantic: 'POSITION',
        type: DataType.FLOAT_VEC3
      },
      a_color: {
        name: 'a_color',
        semantic: 'COLOR',
        type: DataType.FLOAT_VEC3
      },
      a_instance: {
        name: 'a_instance',
        semantic: 'INSPOS',
        type: DataType.FLOAT_VEC4
      }
    },
    uniforms: {
      matModelViewProjection: {
        name: 'matModelViewProjection',
        semantic: UniformSemantic.MODELVIEWPROJECTION,
        type: DataType.FLOAT_MAT4
      },
      segmentNumber: {
        name: 'segmentNumber',
        type: DataType.FLOAT
      }
    }
  };

  // 创建 Technique
  const tech = new RenderTechnique('MeshlineTech');
  tech.states = {
    enable: [ RenderState.BLEND ],
    functions: { blendFunc: [ BlendFunc.SRC_ALPHA, BlendFunc.ONE_MINUS_SRC_ALPHA ] }//
  };
  tech.isValid = true;
  tech.uniforms = cfg.uniforms;
  tech.attributes = cfg.attributes;
  tech.vertexShader = VERT_SHADER;
  tech.fragmentShader = FRAG_SHADER;

  return tech;
}
