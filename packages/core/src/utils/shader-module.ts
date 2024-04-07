export function getUniformLengthByType(type: string): number {
  let arrayLength = 0;
  switch (type) {
    case 'vec2':
    case 'ivec2':
      arrayLength = 2;
      break;
    case 'vec3':
    case 'ivec3':
      arrayLength = 3;
      break;
    case 'vec4':
    case 'ivec4':
    case 'mat2':
      arrayLength = 4;
      break;
    case 'mat3':
      arrayLength = 9;
      break;
    case 'mat4':
      arrayLength = 16;
      break;
    default:
  }
  return arrayLength;
}

const uniformRegExp =
  /uniform\s+(bool|float|int|vec2|vec3|vec4|ivec2|ivec3|ivec4|mat2|mat3|mat4|sampler2D|samplerCube)\s+([\s\S]*?);/g;
function fillUniforms(
  content: string,
  uniformPrefix = false,
): {
  content: string;
  uniforms: {
    [key: string]: any;
  };
} {
  const uniforms = {};
  content = content.replace(uniformRegExp, (_, type, c) => {
    const defaultValues = c.split(':');
    const uniformName = defaultValues[0].trim();
    let defaultValue: any = '';
    if (defaultValues.length > 1) {
      defaultValue = defaultValues[1].trim();
    }

    // set default value for uniform according to its type
    // eg. vec2 u -> [0.0, 0.0]
    switch (type) {
      case 'bool':
        defaultValue = defaultValue === 'true';
        break;
      case 'float':
      case 'int':
        defaultValue = Number(defaultValue);
        break;
      case 'vec2':
      case 'vec3':
      case 'vec4':
      case 'ivec2':
      case 'ivec3':
      case 'ivec4':
      case 'mat2':
      case 'mat3':
      case 'mat4':
        if (defaultValue) {
          defaultValue = defaultValue
            .replace('[', '')
            .replace(']', '')
            .split(',')
            .reduce((prev: number[], cur: string) => {
              prev.push(Number(cur.trim()));
              return prev;
            }, []);
        } else {
          defaultValue = new Array(getUniformLengthByType(type)).fill(0);
        }
        break;
      default:
    }

    // @ts-ignore
    uniforms[uniformName] = defaultValue;
    return `${uniformPrefix ? 'uniform ' : ''}${type} ${uniformName};\n`;
  });

  return {
    content,
    uniforms,
  };
}
export function extractUniforms(content: string): {
  content: string;
  uniforms: {
    [key: string]: any;
  };
} {
  // eslint-disable-next-line prefer-const
  let { content: c, uniforms: u } = fillUniforms(content, true);

  c = c.replace(/(\s*uniform\s*.*\s*){((?:\s*.*\s*)*?)};/g, (substr, header, uniforms) => {
    uniforms = uniforms.trim().replace(/^.*$/gm, (uniform: string) => {
      return `uniform ${uniform}`;
    });

    const { content: cc, uniforms: uu } = fillUniforms(uniforms);
    Object.assign(u, uu);

    return `${header}{\n${cc}\n};`;
  });

  return {
    content: c,
    uniforms: u,
  };
}

export function removeDuplicateUniforms(content: string) {
  const uniforms: Record<string, boolean> = {};
  return content.replace(uniformRegExp, (_, type, uniformName) => {
    const name = uniformName.trim();
    if (!uniforms[name]) {
      uniforms[name] = true;
      return `uniform ${type} ${name};\n`;
    } else {
      return '';
    }
  });
}
