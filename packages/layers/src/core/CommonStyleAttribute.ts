import {
  AttributeType,
  gl,
  IEncodeFeature,
  IStyleAttribute,
} from '@antv/l7-core';
export function getCommonStyleAttributeOptions(
  name: string,
): Partial<IStyleAttribute> | undefined {
  switch (name) {
    // // roate
    case 'rotation':
      return {
        name: 'Rotation',
        type: AttributeType.Attribute,
        descriptor: {
          name: 'a_Rotation',
          buffer: {
            usage: gl.DYNAMIC_DRAW,
            data: [],
            type: gl.FLOAT,
          },
          size: 1,
          update: (feature: IEncodeFeature) => {
            const { rotation = 0 } = feature;
            return Array.isArray(rotation)
              ? [rotation[0]]
              : [rotation as number];
          },
        },
      };
    case 'stroke':
      return {
        name: 'stroke',
        type: AttributeType.Attribute,
        descriptor: {
          name: 'a_Stroke',
          buffer: {
            // give the WebGL driver a hint that this buffer may change
            usage: gl.DYNAMIC_DRAW,
            data: [],
            type: gl.FLOAT,
          },
          size: 4,
          update: (feature: IEncodeFeature) => {
            const { stroke = [1, 1, 1, 1] } = feature;
            return stroke;
          },
        },
      };
    case 'opacity':
      return {
        name: 'opacity',
        type: AttributeType.Attribute,
        descriptor: {
          name: 'a_Opacity',
          buffer: {
            // give the WebGL driver a hint that this buffer may change
            usage: gl.STATIC_DRAW,
            data: [],
            type: gl.FLOAT,
          },
          size: 1,
          update: (feature: IEncodeFeature) => {
            const { opacity: op = 1 } = feature;
            return [op];
          },
        },
      };
    case 'extrusionBase':
      return {
        name: 'extrusionBase',
        type: AttributeType.Attribute,
        descriptor: {
          name: 'a_ExtrusionBase',
          buffer: {
            // give the WebGL driver a hint that this buffer may change
            usage: gl.STATIC_DRAW,
            data: [],
            type: gl.FLOAT,
          },
          size: 1,
          update: (feature: IEncodeFeature) => {
            const { extrusionBase: op = 0 } = feature;
            return [op];
          },
        },
      };
    case 'offsets':
      return {
        name: 'offsets',
        type: AttributeType.Attribute,
        descriptor: {
          name: 'a_Offsets',
          buffer: {
            // give the WebGL driver a hint that this buffer may change
            usage: gl.STATIC_DRAW,
            data: [],
            type: gl.FLOAT,
          },
          size: 2,
          update: (feature: IEncodeFeature) => {
            const { offsets: epo } = feature;
            return epo;
          },
        },
      };
      case 'thetaOffset':
        return {
          name: 'thetaOffset',
          type: AttributeType.Attribute,
          descriptor: {
            name: 'a_ThetaOffset',
            buffer: {
              // give the WebGL driver a hint that this buffer may change
              usage: gl.STATIC_DRAW,
              data: [],
              type: gl.FLOAT,
            },
            size: 1,
            update: (feature: IEncodeFeature) => {
              const { thetaOffset: op = 1 } = feature;
              return [op];
            },
          },
        };
    default:
      return undefined;
  }
}
