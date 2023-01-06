const vert = `
#define TILE_SIZE 512.0
#define PI 3.1415926536
#define WORLD_SCALE TILE_SIZE / (PI * 2.0)

#define COORDINATE_SYSTEM_P20 5.0           // amap
#define COORDINATE_SYSTEM_P20_OFFSET 6.0    // amap offset

layout(std140) uniform ub_SceneParams {
  mat4 u_ProjectionMatrix;
  mat4 u_ViewMatrix;
  vec3 u_CameraPosition;
  float u_DevicePixelRatio;
  vec2 u_Viewport;
  float u_IsOrtho;
};

layout(std140) uniform ub_MaterialParams {
  mat4 u_ViewProjectionMatrix;
  float u_Zoom;
  float u_ZoomScale;
  float u_CoordinateSystem;
  vec2 u_ViewportCenter;
  vec4 u_ViewportCenterProjection;
  vec3 u_PixelsPerDegree;
  vec3 u_PixelsPerDegree2;
};

layout(location = ${VertexAttributeLocation.MODEL_MATRIX0}) in vec4 a_ModelMatrix0;
layout(location = ${VertexAttributeLocation.MODEL_MATRIX1}) in vec4 a_ModelMatrix1;
layout(location = ${VertexAttributeLocation.MODEL_MATRIX2}) in vec4 a_ModelMatrix2;
layout(location = ${VertexAttributeLocation.MODEL_MATRIX3}) in vec4 a_ModelMatrix3;
layout(location = ${VertexAttributeLocation.POSITION}) in vec3 a_Position;
layout(location = ${VertexAttributeLocation.MAX}) in vec3 a_Extrude;

vec2 project_mercator(vec2 lnglat) {
  float x = lnglat.x;
  return vec2(
    radians(x) + PI,
    PI - log(tan(PI * 0.25 + radians(lnglat.y) * 0.5))
  );
}

// offset coords -> world coords 偏移坐标转成世界坐标
vec4 project_offset(vec4 offset) {
  float dy = offset.y;
  dy = clamp(dy, -1., 1.);
  vec3 pixels_per_unit = u_PixelsPerDegree + u_PixelsPerDegree2 * dy;
  return vec4(offset.xy * pixels_per_unit.xy, 0.0, 1.0);
}

// 投影方法 - 将经纬度转化为平面坐标（xy 平面）
vec4 project_position(vec4 position) {

  if (u_CoordinateSystem == COORDINATE_SYSTEM_P20_OFFSET) {
    float X = position.x - u_ViewportCenter.x;
    float Y = position.y - u_ViewportCenter.y;
    return project_offset(vec4(X, Y, 0.0, 1.0));
  }

  if (u_CoordinateSystem == COORDINATE_SYSTEM_P20) {
    return vec4(
      (project_mercator(position.xy) * WORLD_SCALE * u_ZoomScale - vec2(215440491., 106744817.)) * vec2(1., -1.),
      0.0,
      1.0
    );
  }
  return position;
}

vec2 project_pixel(vec2 pixel) {
  // P20 坐标系下，为了和 Web 墨卡托坐标系统一，zoom 默认减1
  return pixel * pow(2.0, (19.0 - u_Zoom));
}


void main() {
  vec2 offset = a_Extrude.xy * 10.0;
  
  offset = project_pixel(offset);

  vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0));

  vec4 worldPos = u_ViewProjectionMatrix *  vec4(project_pos.xy + offset, 0.0, 1.0) + u_ViewportCenterProjection;
  gl_Position = worldPos;
}
`;
const frag = `
layout(std140) uniform ub_SceneParams {
  mat4 u_ProjectionMatrix;
  mat4 u_ViewMatrix;
  vec3 u_CameraPosition;
  float u_DevicePixelRatio;
  vec2 u_Viewport;
  float u_IsOrtho;
};

layout(std140) uniform ub_MaterialParams {
  mat4 u_ViewProjectionMatrix;
  float u_Zoom;
  float u_ZoomScale;
  float u_CoordinateSystem;
  vec2 u_ViewportCenter;
  vec4 u_ViewportCenterProjection;
  vec3 u_PixelsPerDegree;
  vec3 u_PixelsPerDegree2;
};

out vec4 outputColor;

void main() {
  outputColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

import { Canvas } from '@antv/g';
import {
  BufferGeometry,
  Format,
  Mesh,
  Plugin,
  ShaderMaterial,
  VertexAttributeBufferIndex,
  VertexAttributeLocation,
  VertexBufferFrequency,
} from '@antv/g-plugin-3d';
import { Renderer } from '@antv/g-webgl';
import { injectable } from 'inversify';
import 'reflect-metadata';

// import {polyfillContext} from '@luma.gl/gltools';

/**
 * 
 *  使用 luma 的低级模式进行替换实验
 https://luma.gl/docs/getting-started/hello-instancing-low

import { Model} from '@luma.gl/engine';
import {Buffer, clear} from '@luma.gl/webgl';
 const positionBuffer = new Buffer(gl, new Float32Array([
      -0.5, -0.5,
      0.5, -0.5,
      0.0, 0.5
    ]));

    const model = new Model(gl, {
      vs,
      fs,
      attributes: {
        position: positionBuffer,
        color: colorBuffer
      },
      vertexCount: 3,

       uniforms: {
        uTexture: texture
      }

    });
    clear(gl, {color: [0, 0, 0, 1]});

     model.setUniforms({uMVP: mvpMatrix})
      

    model.draw();
 */
@injectable()
export default class ReglRendererService {
  private canvas: Canvas;
  private device: Device;

  public async init(canvas: HTMLCanvasElement) {
    const renderer = new Renderer();
    renderer.registerPlugin(new Plugin());

    this.canvas = new Canvas({
      canvas,
      renderer,
    });

    /**
     * Wait for canvas ready.
     * @see https://g.antv.antgroup.com/api/canvas/scenegraph-lifecycle#ready
     */
    await this.canvas.ready;

    const plugin = renderer.getPlugin('device-renderer');
    /**
     * Use device to create BufferGeometry & ShaderMaterial.
     * @see https://g.antv.antgroup.com/plugins/device-renderer#device
     */
    this.device = plugin.getDevice();
  }

  public createModel = () => {
    return new ReglModel(this.canvas, this.device);
  };

  public clear = () => {
    // const reglClearOptions: any = {
    //   color: [0, 0, 0, 0],
    //   depth: 1,
    //   stencil: 0,
    // };
    // this.gl?.clear(reglClearOptions);
  };
}

// 程序对象
class ReglModel {
  private uniforms: any = {};
  private shaderMaterial: ShaderMaterial;

  constructor(canvas: Canvas, device: Device) {
    const uniforms = {
      u_CoordinateSystem: 0,
      u_ViewProjectionMatrix: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      u_PixelsPerDegree: [0, 0, 0],
      u_PixelsPerDegree2: [0, 0, 0],
      u_Zoom: 1,
      u_ZoomScale: 1,
      u_ViewportCenter: [0, 0],
      u_ViewportCenterProjection: [0, 0, 0, 0],
    };
    this.uniforms = this.extractUniforms(uniforms);

    /**
     * @see https://g.antv.antgroup.com/api/3d/material
     */
    const shaderMaterial = new ShaderMaterial(device, {
      vertexShader: vert,
      fragmentShader: frag,
    });
    // @see https://g.antv.antgroup.com/api/3d/material#setuniforms
    shaderMaterial.setUniforms(uniforms);
    this.shaderMaterial = shaderMaterial;

    /**
     * @see https://g.antv.antgroup.com/api/3d/geometry
     */
    const bufferGeometry = new BufferGeometry(device);
    bufferGeometry.setVertexBuffer({
      bufferIndex: VertexAttributeBufferIndex.POSITION,
      byteStride: 4 * 3,
      frequency: VertexBufferFrequency.PerVertex,
      attributes: [
        {
          format: Format.F32_RGB,
          bufferByteOffset: 4 * 0,
          location: VertexAttributeLocation.POSITION,
        },
      ],
      // use 6 vertices
      data: Float32Array.from([
        120, 30, 0, 120, 30, 0, 120, 30, 0, 120, 30, 0, 120, 30, 0, 120, 30, 0,
      ]),
    });
    bufferGeometry.setVertexBuffer({
      bufferIndex: VertexAttributeBufferIndex.MAX,
      byteStride: 4 * 3,
      frequency: VertexBufferFrequency.PerVertex,
      attributes: [
        {
          format: Format.F32_RGB,
          bufferByteOffset: 4 * 0,
          location: VertexAttributeLocation.MAX,
        },
      ],
      // use 6 vertices
      data: Float32Array.from([
        1, 1, 0, -1, 1, 0, -1, -1, 0, -1, -1, 0, 1, -1, 0, 1, 1, 0,
      ]),
    });
    // draw 6 vertices
    bufferGeometry.vertexCount = 6;

    /**
     * @see https://g.antv.antgroup.com/api/3d/mesh
     */
    const mesh = new Mesh({
      style: {
        fill: '#1890FF',
        opacity: 1,
        geometry: bufferGeometry,
        material: shaderMaterial,
      },
    });
    canvas.appendChild(mesh);
    // const reglUniforms: any = {};

    // Object.keys(uniforms).forEach((uniformName) => {
    //   // pass data into regl
    //   reglUniforms[uniformName] = reGl.prop(uniformName);
    // });
    // // [{
    // //   coordinates: [120, 30],
    // //   id: 0,
    // // }],
    // console.log(reglUniforms);
    // const drawParams: any = {
    //   attributes: {
    //     a_Extrude: [1, 1, 0, -1, 1, 0, -1, -1, 0, 1, -1, 0],
    //     a_Position: [120, 30, 0, 120, 30, 0, 120, 30, 0, 120, 30, 0],
    //   },
    //   frag,
    //   uniforms: reglUniforms,
    //   vert,
    //   // primitive: 'triangles'
    // };
    // drawParams.elements = [0, 1, 2, 2, 3, 0];
    // this.drawCommand = reGl(drawParams);
  }

  public addUniforms(uniforms: any) {
    this.uniforms = {
      ...this.uniforms,
      ...this.extractUniforms(uniforms),
    };
  }

  public draw(options: any) {
    console.log(this.uniforms);
    this.shaderMaterial.setUniforms(this.uniforms);
  }

  private extractUniforms(uniforms: any): any {
    const extractedUniforms: Record<string, any> = {};
    Object.keys(uniforms).forEach((uniformName) => {
      extractedUniforms[uniformName] = uniforms[uniformName];
    });

    return extractedUniforms;
  }
}
