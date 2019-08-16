"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArclineMaterial = ArclineMaterial;

var _r3Base = require("@ali/r3-base");

var _r3Material = require("@ali/r3-material");

function ArclineMaterial() {
  var tech = requireGeometryTechnique();
  var newMtl = new _r3Material.Material('MeshlineTech_mtl');
  newMtl.technique = tech;
  newMtl.setValue('segmentNumber', 50.0);
  return newMtl;
}

function requireGeometryTechnique() {
  // 顶点着色器
  var VERT_SHADER = "\n    precision mediump float;\n    attribute vec3 a_position;\n    attribute vec3 a_color;\n    attribute vec4 a_instance;\n    uniform mat4 matModelViewProjection;\n    uniform float segmentNumber;  \n    varying vec3 v_color;\n\n    float getSegmentRatio(float index) {\n      return smoothstep(0.0, 1.0, index / (segmentNumber - 1.0));\n    }\n\n    float paraboloid(vec2 source, vec2 target, float ratio) {\n        vec2 x = mix(source, target, ratio);\n        vec2 center = mix(source, target, 0.5);\n        float dSourceCenter = distance(source, center);\n        float dXCenter = distance(x, center);\n        return (dSourceCenter + dXCenter) * (dSourceCenter - dXCenter)*0.6;\n    }\n\n    vec3 getPos(vec2 source, vec2 target, float height, float segmentRatio) {\n        return vec3(\n        mix(source, target, segmentRatio),\n        sqrt(max(0.0, height))\n        );\n    }\n\n    void main() {\n      vec2 source = a_instance.rg;\n      vec2 target = a_instance.ba;\n      float segmentIndex = a_position.x;\n      float segmentRatio = getSegmentRatio(segmentIndex);\n      vec3 c1 = vec3(0.929,0.972,0.917);\n      vec3 c2 = vec3(0.062,0.325,0.603); \n      v_color = mix(c1, c2, segmentRatio);\n      float height = paraboloid(source, target, segmentRatio);\n      vec3 position = getPos(source,target,height,segmentRatio);\n      gl_Position = matModelViewProjection * vec4(position, 1.0);\n    }\n  "; // 片元着色器

  var FRAG_SHADER = "\n  precision mediump float;\n  varying vec3 v_color;\n\n  void main() {\n    gl_FragColor = vec4(v_color,1.0);\n  }\n  "; // Technique 配置信息

  var cfg = {
    attributes: {
      a_position: {
        name: 'a_position',
        semantic: 'POSITION',
        type: _r3Base.DataType.FLOAT_VEC3
      },
      a_color: {
        name: 'a_color',
        semantic: 'COLOR',
        type: _r3Base.DataType.FLOAT_VEC3
      },
      a_instance: {
        name: 'a_instance',
        semantic: 'INSPOS',
        type: _r3Base.DataType.FLOAT_VEC4
      }
    },
    uniforms: {
      matModelViewProjection: {
        name: 'matModelViewProjection',
        semantic: _r3Base.UniformSemantic.MODELVIEWPROJECTION,
        type: _r3Base.DataType.FLOAT_MAT4
      },
      segmentNumber: {
        name: 'segmentNumber',
        type: _r3Base.DataType.FLOAT
      }
    }
  }; // 创建 Technique

  var tech = new _r3Material.RenderTechnique('MeshlineTech');
  tech.states = {
    enable: [_r3Base.RenderState.BLEND],
    functions: {
      blendFunc: [_r3Base.BlendFunc.SRC_ALPHA, _r3Base.BlendFunc.ONE_MINUS_SRC_ALPHA] //

    }
  };
  tech.isValid = true;
  tech.uniforms = cfg.uniforms;
  tech.attributes = cfg.attributes;
  tech.vertexShader = VERT_SHADER;
  tech.fragmentShader = FRAG_SHADER;
  return tech;
}