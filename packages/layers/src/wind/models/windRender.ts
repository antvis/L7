import * as glUtils from './utils';
import {
  drawFrag,
  drawVert,
  fullScreenFrag,
  fullScreenVert,
  updateFrag,
  updateVert,
} from './windShader';

function getColorRamp(colors: { [key: number]: string }) {
  let canvas = document.createElement('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  canvas.width = 256;
  canvas.height = 1;

  const gradient = ctx.createLinearGradient(0, 0, 256, 0);
  for (const stop of Object.keys(colors)) {
    gradient.addColorStop(+stop, colors[+stop]);
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 1);

  // @ts-ignore dispose canvas element
  canvas = null;

  return new Uint8Array(ctx.getImageData(0, 0, 256, 1).data);
}

function bindAttribute(gl: WebGLRenderingContext, buffer: any, attribute: any, numComponents: any) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(attribute);
  gl.vertexAttribPointer(attribute, numComponents, gl.FLOAT, false, 0, 0);
}

function bindFramebuffer(gl: WebGLRenderingContext, framebuffer: any, texture: any) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  if (texture) {
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  }
}

export interface IWindData {
  uMin: number;
  uMax: number;
  vMin: number;
  vMax: number;
  image: HTMLImageElement;
}

export interface IWind {
  width: number;
  height: number;

  fadeOpacity: number;
  speedFactor: number;
  dropRate: number;
  dropRateBump: number;

  setWind: (windData: IWindData) => void;
  draw: () => { d: Uint8Array; w: number; h: number };
  updateParticelNum: (num: number) => void;
  updateWindDir: (uMin: number, uMax: number, vMin: number, vMax: number) => void;
  updateColorRampTexture: (rampColors: { [key: number]: string }) => void;

  reSize: (width: number, height: number) => void;
  destroy: () => void;
}

export interface IWindProps {
  glContext: WebGLRenderingContext;
  imageWidth: number;
  imageHeight: number;
  fadeOpacity: number;
  speedFactor: number;
  dropRate: number;
  dropRateBump: number;
  rampColors: { [key: number]: string };
}

export class Wind {
  public width: number = 512;
  public height: number = 512;

  public pixels: Uint8Array;

  public fadeOpacity: number;
  public speedFactor: number;
  public dropRate: number;
  public dropRateBump: number;
  private gl: WebGLRenderingContext;
  private drawProgram: WebGLProgram;
  private fullScreenProgram: WebGLProgram;
  private updateProgram: WebGLProgram;

  private rampColors: { [key: number]: string };

  private numParticles: number = 65536;
  private numParticlesSize: number;
  private particleStateResolution: number;

  private quadBuffer: WebGLBuffer | null;
  private particleIndexBuffer: WebGLBuffer | null;

  private framebuffer: WebGLFramebuffer | null;

  private colorRampTexture: WebGLTexture | null;
  private backgroundTexture: WebGLTexture | null;
  private screenTexture: WebGLTexture | null;
  private particleStateTexture0: WebGLTexture | null;
  private particleStateTexture1: WebGLTexture | null;
  private windTexture: WebGLTexture | null;

  private windData: IWindData;

  constructor(options: IWindProps) {
    this.gl = options.glContext;
    this.width = options.imageWidth;
    this.height = options.imageHeight;
    this.fadeOpacity = options.fadeOpacity;
    this.speedFactor = options.speedFactor;
    this.dropRate = options.dropRate;
    this.dropRateBump = options.dropRateBump;

    this.rampColors = options.rampColors;
    this.init();
  }

  public init() {
    const gl = this.gl;

    this.fadeOpacity = 0.996; // how fast the particle trails fade on each frame
    this.speedFactor = 0.25; // how fast the particles move
    this.dropRate = 0.003; // how often the particles move to a random place
    this.dropRateBump = 0.01; // drop rate increase relative to individual particle speed

    this.drawProgram = glUtils.createProgram(gl, drawVert, drawFrag) as WebGLProgram;
    this.fullScreenProgram = glUtils.createProgram(
      gl,
      fullScreenVert,
      fullScreenFrag,
    ) as WebGLProgram;
    this.updateProgram = glUtils.createProgram(gl, updateVert, updateFrag) as WebGLProgram;

    this.quadBuffer = glUtils.createBuffer(
      gl,
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
    );

    this.framebuffer = gl.createFramebuffer();

    this.colorRampTexture = glUtils.createTexture(
      this.gl,
      this.gl.LINEAR,
      getColorRamp(this.rampColors),
      16,
      16,
    );

    const emptyPixels = new Uint8Array(this.width * this.height * 4);

    // screen textures to hold the drawn screen for the previous and the current frame

    this.backgroundTexture = glUtils.createTexture(
      gl,
      gl.NEAREST,
      emptyPixels,
      this.width,
      this.height,
    );
    this.screenTexture = glUtils.createTexture(
      gl,
      gl.NEAREST,
      emptyPixels,
      this.width,
      this.height,
    );

    // we create a square texture where each pixel will hold a particle position encoded as RGBA
    const particleRes = (this.particleStateResolution = Math.ceil(Math.sqrt(this.numParticles)));
    // particleRes size
    this.numParticlesSize = particleRes * particleRes;

    const particleState = new Uint8Array(this.numParticlesSize * 4);
    for (let i = 0; i < particleState.length; i++) {
      particleState[i] = Math.floor(Math.random() * 256); // randomize the initial particle positions
    }
    // textures to hold the particle state for the current and the next frame
    this.particleStateTexture0 = glUtils.createTexture(
      gl,
      gl.NEAREST,
      particleState,
      particleRes,
      particleRes,
    );
    this.particleStateTexture1 = glUtils.createTexture(
      gl,
      gl.NEAREST,
      particleState,
      particleRes,
      particleRes,
    );

    const particleIndices = new Float32Array(this.numParticlesSize);
    for (let i$1 = 0; i$1 < this.numParticlesSize; i$1++) {
      particleIndices[i$1] = i$1;
    }
    this.particleIndexBuffer = glUtils.createBuffer(gl, particleIndices);
  }

  public setWind(windData: IWindData) {
    this.windData = windData;
    this.windTexture = glUtils.createDataTexture(this.gl, this.gl.LINEAR, windData.image);
  }

  /**
   * 更新风场粒子数量
   * @param num
   */
  public updateParticelNum(num: number) {
    const gl = this.gl;
    if (num !== this.numParticles) {
      this.numParticles = num; // params number

      // we create a square texture where each pixel will hold a particle position encoded as RGBA
      const particleRes = (this.particleStateResolution = Math.ceil(Math.sqrt(this.numParticles)));
      this.numParticlesSize = particleRes * particleRes;

      const particleState = new Uint8Array(this.numParticlesSize * 4);
      for (let i = 0; i < particleState.length; i++) {
        particleState[i] = Math.floor(Math.random() * 256); // randomize the initial particle positions
      }
      // textures to hold the particle state for the current and the next frame
      this.particleStateTexture0 = glUtils.createTexture(
        gl,
        gl.NEAREST,
        particleState,
        particleRes,
        particleRes,
      );
      this.particleStateTexture1 = glUtils.createTexture(
        gl,
        gl.NEAREST,
        particleState,
        particleRes,
        particleRes,
      );

      const particleIndices = new Float32Array(this.numParticlesSize);
      for (let i$1 = 0; i$1 < this.numParticlesSize; i$1++) {
        particleIndices[i$1] = i$1;
      }
      this.particleIndexBuffer = glUtils.createBuffer(gl, particleIndices);
    }
  }

  /**
   * 更新风场风向风速
   * @param uMin
   * @param uMax
   * @param vMin
   * @param vMax
   */
  public updateWindDir(uMin: number, uMax: number, vMin: number, vMax: number) {
    this.windData.uMin = uMin;
    this.windData.uMax = uMax;
    this.windData.vMin = vMin;
    this.windData.vMax = vMax;
  }

  /**
   * update rampColors
   * @param rampColors
   */
  public updateColorRampTexture(rampColors: { [key: number]: string }) {
    if (this.isColorChanged(rampColors)) {
      this.rampColors = rampColors;

      const gl = this.gl;
      gl.deleteTexture(this.colorRampTexture);
      this.colorRampTexture = glUtils.createTexture(
        gl,
        gl.LINEAR,
        getColorRamp(rampColors),
        16,
        16,
      );
    }
  }

  public isColorChanged(rampColors: { [key: number]: string }): boolean {
    const keys = Object.keys(rampColors);
    for (const item of keys) {
      const key = Number(item);
      // exist new key -> color need update
      if (!this.rampColors[key]) {
        return true;
      }
      // value changed -> color need update
      if (this.rampColors[key] && this.rampColors[key] !== rampColors[key]) {
        return true;
      }
    }
    return false;
  }

  public reSize(width: number, height: number) {
    if (width !== this.width || height !== this.height) {
      const gl = this.gl;
      gl.deleteTexture(this.backgroundTexture);
      gl.deleteTexture(this.screenTexture);

      this.width = width;
      this.height = height;
      const emptyPixels = new Uint8Array(width * height * 4);
      // screen textures to hold the drawn screen for the previous and the current frame
      this.backgroundTexture = glUtils.createTexture(gl, gl.NEAREST, emptyPixels, width, height);
      this.screenTexture = glUtils.createTexture(gl, gl.NEAREST, emptyPixels, width, height);
    }
  }
  public draw() {
    if (this.windData?.image) {
      const gl = this.gl;

      glUtils.bindTexture(gl, this.windTexture as WebGLTexture, 0);
      glUtils.bindTexture(gl, this.particleStateTexture0 as WebGLTexture, 1);

      this.drawScreen(); // draw Particles into framebuffer
      this.updateParticles();

      return { d: this.pixels, w: this.width, h: this.height };
    } else {
      return { d: new Uint8Array([0, 0, 0, 0]), w: 1, h: 1 };
    }
  }

  public drawScreen() {
    const gl = this.gl;

    // draw the screen into a temporary framebuffer to retain it as the background on the next frame
    bindFramebuffer(gl, this.framebuffer, this.screenTexture);

    gl.viewport(0, 0, this.width, this.height);

    gl.disable(gl.BLEND);
    this.drawFullTexture(this.backgroundTexture, this.fadeOpacity);
    this.drawParticles();

    this.pixels = new Uint8Array(4 * this.width * this.height);
    gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, this.pixels);

    bindFramebuffer(gl, null, null);
    gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    //   save the current screen as the background for the next frame
    const temp = this.backgroundTexture;
    this.backgroundTexture = this.screenTexture;
    this.screenTexture = temp;
  }

  public drawFullTexture(texture: any, opacity: number) {
    const gl = this.gl;
    const program = this.fullScreenProgram as any;
    gl.useProgram(program);

    // bindAttribute(gl, this.quadBuffer, program.a_pos, 2);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.vertexAttribPointer(program.a_pos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(program.a_pos);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    glUtils.bindTexture(gl, texture, 2);
    gl.uniform1i(program.u_screen, 2);
    gl.uniform1f(program.u_opacity, opacity);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    // gl.drawArrays(gl.POINTS, 0, 6);
  }

  public drawParticles() {
    const gl = this.gl;
    const program = this.drawProgram as any;
    gl.useProgram(program);

    bindAttribute(gl, this.particleIndexBuffer, program.a_index, 1);
    glUtils.bindTexture(gl, this.colorRampTexture as WebGLTexture, 2);

    gl.uniform1i(program.u_wind, 0);
    gl.uniform1i(program.u_particles, 1);
    gl.uniform1i(program.u_color_ramp, 2);

    gl.uniform1f(program.u_particles_res, this.particleStateResolution);
    gl.uniform2f(program.u_wind_min, this.windData.uMin, this.windData.vMin);
    gl.uniform2f(program.u_wind_max, this.windData.uMax, this.windData.vMax);

    gl.drawArrays(gl.POINTS, 0, this.numParticlesSize);
  }

  public updateParticles() {
    const gl = this.gl;
    bindFramebuffer(gl, this.framebuffer, this.particleStateTexture1);
    gl.viewport(0, 0, this.particleStateResolution, this.particleStateResolution);

    const program = this.updateProgram as any;
    gl.useProgram(program);

    bindAttribute(gl, this.quadBuffer, program.a_pos, 2);

    gl.uniform1i(program.u_wind, 0);
    gl.uniform1i(program.u_particles, 1);

    gl.uniform1f(program.u_rand_seed, Math.random());
    gl.uniform2f(program.u_wind_res, this.windData.image.width * 2, this.windData.image.height * 2);
    gl.uniform2f(program.u_wind_min, this.windData.uMin, this.windData.vMin);
    gl.uniform2f(program.u_wind_max, this.windData.uMax, this.windData.vMax);
    gl.uniform1f(program.u_speed_factor, this.speedFactor);
    gl.uniform1f(program.u_drop_rate, this.dropRate);
    gl.uniform1f(program.u_drop_rate_bump, this.dropRateBump);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // swap the particle state textures so the new one becomes the current one
    const temp = this.particleStateTexture0;
    this.particleStateTexture0 = this.particleStateTexture1;
    this.particleStateTexture1 = temp;

    bindFramebuffer(gl, null, null);

    // gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }

  public destroy() {
    // private drawProgram: WebGLProgram;
    // private fullScreenProgram: WebGLProgram;
    // private updateProgram: WebGLProgram;

    // private quadBuffer: WebGLBuffer | null;
    // private particleIndexBuffer: WebGLBuffer | null;

    // private framebuffer: WebGLFramebuffer | null;

    // private colorRampTexture: WebGLTexture | null;
    // private backgroundTexture: WebGLTexture | null;
    // private screenTexture: WebGLTexture | null;
    // private particleStateTexture0: WebGLTexture | null;
    // private particleStateTexture1: WebGLTexture | null;
    // private windTexture: WebGLTexture | null;

    this.gl.deleteBuffer(this.quadBuffer);
    this.gl.deleteBuffer(this.particleIndexBuffer);

    this.gl.deleteFramebuffer(this.framebuffer);

    // @ts-ignore
    this.gl.deleteShader(this.drawProgram.vertexShader);
    // @ts-ignore
    this.gl.deleteShader(this.drawProgram.fragmentShader);
    this.gl.deleteProgram(this.drawProgram);

    // @ts-ignore
    this.gl.deleteShader(this.fullScreenProgram.vertexShader);
    // @ts-ignore
    this.gl.deleteShader(this.fullScreenProgram.fragmentShader);
    this.gl.deleteProgram(this.fullScreenProgram);

    // @ts-ignore
    this.gl.deleteShader(this.updateProgram.vertexShader);
    // @ts-ignore
    this.gl.deleteShader(this.updateProgram.fragmentShader);
    this.gl.deleteProgram(this.updateProgram);

    this.gl.deleteTexture(this.colorRampTexture);
    this.gl.deleteTexture(this.backgroundTexture);
    this.gl.deleteTexture(this.screenTexture);
    this.gl.deleteTexture(this.particleStateTexture0);
    this.gl.deleteTexture(this.particleStateTexture1);
    this.gl.deleteTexture(this.windTexture);
  }
}
