import { BaseLayer, BaseModel, IModelUniform, ILayerService, IModel, ILayer, PointFillTriangulation, IStyleAttributeService, IEncodeFeature, gl, AttributeType } from '@antv/l7';

const pointFillFrag = `
uniform float u_opacity : 1.0;
uniform float u_stroke_opacity : 1;
uniform float u_stroke_width : 2;
uniform vec4 u_stroke_color : [0.0, 0.0, 0.0, 0.0];

varying vec4 v_data;
varying vec4 v_color;
varying float v_radius;

#pragma include "sdf_2d"
#pragma include "picking"

void main() {
    int shape = int(floor(v_data.w + 0.5));

    lowp float antialiasblur = v_data.z;
    float r = v_radius / (v_radius + u_stroke_width);

    float outer_df;
    float inner_df;
    // 'circle', 'triangle', 'square', 'pentagon', 'hexagon', 'octogon', 'hexagram', 'rhombus', 'vesica'
    if (shape == 0) {
        outer_df = sdCircle(v_data.xy, 1.0);
        inner_df = sdCircle(v_data.xy, r);
    } else if (shape == 1) {
        outer_df = sdEquilateralTriangle(1.1 * v_data.xy);
        inner_df = sdEquilateralTriangle(1.1 / r * v_data.xy);
    } else if (shape == 2) {
        outer_df = sdBox(v_data.xy, vec2(1.));
        inner_df = sdBox(v_data.xy, vec2(r));
    } else if (shape == 3) {
        outer_df = sdPentagon(v_data.xy, 0.8);
        inner_df = sdPentagon(v_data.xy, r * 0.8);
    } else if (shape == 4) {
        outer_df = sdHexagon(v_data.xy, 0.8);
        inner_df = sdHexagon(v_data.xy, r * 0.8);
    } else if (shape == 5) {
        outer_df = sdOctogon(v_data.xy, 1.0);
        inner_df = sdOctogon(v_data.xy, r);
    } else if (shape == 6) {
        outer_df = sdHexagram(v_data.xy, 0.52);
        inner_df = sdHexagram(v_data.xy, r * 0.52);
    } else if (shape == 7) {
        outer_df = sdRhombus(v_data.xy, vec2(1.0));
        inner_df = sdRhombus(v_data.xy, vec2(r));
    } else if (shape == 8) {
        outer_df = sdVesica(v_data.xy, 1.1, 0.8);
        inner_df = sdVesica(v_data.xy, r * 1.1, r * 0.8);
    }

    float opacity_t = smoothstep(0.0, antialiasblur, outer_df);

    float color_t = u_stroke_width < 0.01 ? 0.0 : smoothstep(
        antialiasblur,
        0.0,
        inner_df
    );

    if(u_stroke_width < 0.01) {
        gl_FragColor = vec4(v_color.rgb, v_color.a * u_opacity);
    } else {
        gl_FragColor = mix(vec4(v_color.rgb, v_color.a * u_opacity), u_stroke_color * u_stroke_opacity, color_t);
    }

    gl_FragColor.a *= opacity_t;
    gl_FragColor = filterColor(gl_FragColor);
}
`
const pointFillVert = `
attribute vec4 a_Color;
attribute vec3 a_Position;
attribute vec3 a_Extrude;
attribute float a_Size;
attribute float a_Shape;

uniform mat4 u_ModelMatrix;
uniform mat4 u_Mvp;

varying vec4 v_data;
varying vec4 v_color;
varying float v_radius;

uniform float u_stroke_width : 2;


#pragma include "projection"
#pragma include "picking"


void main() {
    vec3 extrude = a_Extrude;
    float shape_type = a_Shape;

    float newSize = setPickingSize(a_Size);

    v_color = a_Color;

    v_radius = newSize;


    float antialiasblur = -max(2.0 / u_DevicePixelRatio / newSize, 0.0);

    vec2 offset = project_pixel(extrude.xy * (newSize + u_stroke_width));

    v_data = vec4(extrude.x, extrude.y, antialiasblur, shape_type);

    vec4 project_pos = project_position(vec4(a_Position.xy, 0.0, 1.0));
    if(u_CoordinateSystem == COORDINATE_SYSTEM_P20_2) { // gaode2.x
        gl_Position = u_Mvp * vec4(project_pos.xy + offset, 0.0, 1.0);
    } else {
        gl_Position = project_common_position_to_clipspace(vec4(project_pos.xy + offset, 0.0, 1.0));
    }

    setPickingColor(a_PickingColor);
}
`

interface ICustomPointLayerStyleOptions {
    opacity: number;
    strokeOpacity: number;
    strokeWidth: number;
    stroke: string;
}

class CustomModel extends BaseModel {
    constructor(layer: ILayer) {
        super(layer)
    }

    public layer: ILayer
    public styleAttributeService: IStyleAttributeService
    public getUninforms(): IModelUniform {
        const { opacity, stroke = [1.0, 0.0, 0.0, 1.0], strokeOpacity = 1.0, strokeWidth = 0 } = this.layer.getLayerConfig() as ICustomPointLayerStyleOptions;
        
        return {
            u_opacity: opacity,
            u_stroke_opacity: strokeOpacity,
            u_stroke_width: strokeWidth,
            u_stroke_color: stroke as number[],
        };
    }
  
    public initModels(callbackModel: (models: IModel[]) => void) {
      this.buildModels(callbackModel);
    }
  
    public async buildModels(callbackModel: (models: IModel[]) => void) {
      this.layer
        .buildLayerModel({
          moduleName: "customPoint",
          vertexShader: pointFillVert,
          fragmentShader: pointFillFrag,
          triangulation: PointFillTriangulation,
          depth: { enable: false },
        })
        .then((model) => {
          callbackModel([model]);
        })
        .catch((err) => {
          console.warn(err);
          callbackModel([]);
        });
    }
  
    protected registerBuiltinAttributes() {
      const shape2d = this.layer.getLayerConfig().shape2d as string[];
  
      this.styleAttributeService.registerStyleAttribute({
        name: 'extrude',
        type: AttributeType.Attribute,
        descriptor: {
          name: 'a_Extrude',
          buffer: {
            // give the WebGL driver a hint that this buffer may change
            usage: gl.DYNAMIC_DRAW,
            data: [],
            type: gl.FLOAT,
          },
          size: 3,
          update: (
            feature: IEncodeFeature,
            featureIdx: number,
            vertex: number[],
            attributeIdx: number,
          ) => {
            const extrude = [1, 1, 0, -1, 1, 0, -1, -1, 0, 1, -1, 0];
            const extrudeIndex = (attributeIdx % 4) * 3;
            return [
              extrude[extrudeIndex],
              extrude[extrudeIndex + 1],
              extrude[extrudeIndex + 2],
            ];
          },
        },
      });
  
      // point layer size;
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
            const { size = 5 } = feature;
            return Array.isArray(size) ? [size[0]] : [size];
          },
        },
      });
  
      // point layer size;
      this.styleAttributeService.registerStyleAttribute({
        name: 'shape',
        type: AttributeType.Attribute,
        descriptor: {
          name: 'a_Shape',
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
            const { shape = 2 } = feature;
            const shapeIndex = shape2d.indexOf(shape as string);
            return [shapeIndex];
          },
        },
      });
    }
}

export default class CustomPoint extends BaseLayer {
    public type: string = 'PointLayer';
    public layerModel: CustomModel;
    public layerService: ILayerService
    public models: any
    public rendering: boolean;
  
    public buildModels() {
        this.layerModel = new CustomModel(this);
        this.layerModel.initModels((models) => {
          this.models = models;
          this.layerService.updateLayerRenderList();

          // renderLayers
          this.rendering = true;
          this.layerService.renderLayers();
          this.rendering = false;
        });
      }
}