// @ts-nocheck
export function createProgram(gl, vshader, fshader) {
  // Create shader object
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vshader); // 创建顶点着色器对象
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fshader); // 创建片元着色器对象
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // Create a program object
  const program = gl.createProgram(); // 创建程序对象
  if (!program) {
    return null;
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader); // 绑定着色器对象
  gl.attachShader(program, fragmentShader);

  // Link the program object
  gl.linkProgram(program); // 链接着色器对象

  // Check the result of linking
  const linked = gl.getProgramParameter(program, gl.LINK_STATUS); // 判断着色器对象是否链接成功
  if (!linked) {
    const error = gl.getProgramInfoLog(program);
    console.warn('Failed to link program: ' + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }

  const numAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (let i = 0; i < numAttributes; i++) {
    const attribute = gl.getActiveAttrib(program, i);
    program[attribute.name] = gl.getAttribLocation(program, attribute.name);
  }
  const numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i$1 = 0; i$1 < numUniforms; i$1++) {
    const uniform = gl.getActiveUniform(program, i$1);
    program[uniform.name] = gl.getUniformLocation(program, uniform.name);
  }

  program.vertexShader = vertexShader;
  program.fragmentShader = fragmentShader;

  return program;
}

export function loadShader(gl: WebGLRenderingContext, type, source) {
  // Create shader object
  const shader = gl.createShader(type); // 生成着色器对象
  if (shader == null) {
    console.warn('unable to create shader');
    return null;
  }

  // Set the shader program
  gl.shaderSource(shader, source); // 载入着色器

  // Compile the shader
  gl.compileShader(shader); // 编译着色器代码

  // Check the result of compilation
  const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS); // 判断着色器对象是否生成成功
  // gl.SHADER_TYPE、gl.DELETE_STATUS、gl.COMPILE_STATUS
  if (!compiled) {
    const error = gl.getShaderInfoLog(shader);
    console.warn('Failed to compile shader: ' + error);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export function createTexture(
  gl: WebGLRenderingContext,
  filter: any,
  data: any,
  width: number,
  height: number,
) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    data,
  );

  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
}

export function createDataTexture(
  gl: WebGLRenderingContext,
  filter: any,
  data: any,
) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
}

export function bindTexture(gl, texture, unit) {
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, texture);
}

export function createBuffer(gl, data) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return buffer;
}

export function bindAttriBuffer(
  gl: WebGLRenderingContext,
  attrName: string,
  vertices,
  count,
  program,
) {
  const buffer = gl.createBuffer();
  if (!buffer) {
    console.warn('failed create vertex buffer');
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // 将缓冲区对象绑定到目标
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // 向缓冲区对象中写入数据

  const attr = gl.getAttribLocation(program, attrName);
  gl.vertexAttribPointer(attr, count, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attr);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return { buffer, attr, count };
}

export function bindAttriIndicesBuffer(
  gl: WebGLRenderingContext,
  indices: Uint8Array,
): WebGLBuffer {
  const buffer = gl.createBuffer();
  if (!buffer) {
    console.warn('failed create vertex buffer');
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  return buffer;
}

export function bindUnifrom(gl, unifromName, data, program, vec) {
  const uniform = gl.getUniformLocation(program, unifromName);
  if (uniform < 0) {
    console.warn('无法获取 uniform 变量的存储位置');
  }
  setUnifrom(gl, uniform, data, vec);
  return uniform;
}

export function setUnifrom(gl, location, data, vec) {
  switch (vec) {
    case 'float':
      gl.uniform1f(location, data);
      break;
    case 'vec2':
      gl.uniform2fv(location, data);
      break;
    case 'vec3':
      gl.uniform3fv(location, data);
      break;
    case 'vec4':
      gl.uniform4fv(location, data);
      break;
    case 'bool':
      gl.uniform1i(location, data); // 1 - true    0 - false
      break;
    case 'sampler2d':
      break;
    case 'mat4':
      gl.uniformMatrix4fv(location, false, data);
      break;
  }
}

export function initFramebuffer(gl) {
  const { drawingBufferWidth, drawingBufferHeight } = gl;

  const OFFER_SCREEN_WIDTH = drawingBufferWidth;
  const OFFER_SCREEN_HEIGHT = drawingBufferHeight;

  const FRAMEBUFFER = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, FRAMEBUFFER);
  const depthbuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthbuffer);
  gl.renderbufferStorage(
    gl.RENDERBUFFER,
    gl.DEPTH_COMPONENT16,
    OFFER_SCREEN_WIDTH,
    OFFER_SCREEN_HEIGHT,
  );
  gl.framebufferRenderbuffer(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.RENDERBUFFER,
    depthbuffer,
  );

  const texture = gl.createTexture();
  const textureSize = 1024;
  FRAMEBUFFER.texture = texture;
  FRAMEBUFFER.width = OFFER_SCREEN_WIDTH;
  FRAMEBUFFER.height = OFFER_SCREEN_HEIGHT;

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    OFFER_SCREEN_WIDTH,
    OFFER_SCREEN_HEIGHT,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  );
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  );
  gl.bindTexture(gl.TEXTURE_2D, null);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return { FRAMEBUFFER, OFFER_SCREEN_WIDTH, OFFER_SCREEN_HEIGHT };
}
