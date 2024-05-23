import { BufferUsage, WebGPUDeviceContribution } from '@antv/g-device-api';
import type { Scene } from '@antv/l7-scene';
import type { TestCase } from '../../types';
import { createTexture, generateTexture } from './utils/common';

export const computeTexture: TestCase = async (options) => {
  const dom = options.id as HTMLDivElement;
  // 创建 canvas
  const $canvas = document.createElement('canvas');
  dom.appendChild($canvas);
  // 设置 canvas 大小
  $canvas.width = dom.clientWidth;
  $canvas.height = dom.clientHeight;

  const device = await render($canvas);

  const scene = {
    destroy: () => {
      dom.removeChild($canvas);
      device.destroy();
    },
  };

  return scene as Scene;
};

async function render($canvas: HTMLCanvasElement) {
  const deviceContribution = new WebGPUDeviceContribution({
    shaderCompilerPath: '/glsl_wgsl_compiler_bg.wasm',
  });
  const swapChain = await deviceContribution.createSwapChain($canvas);
  swapChain.configureSwapChain($canvas.width, $canvas.height);

  const device = swapChain.getDevice();

  // 计算
  const computeProgram = device.createProgram({
    compute: {
      wgsl: /* wgsl */ `
    struct windParams {
      u_wind_min : vec2<f32>,
      u_wind_max : vec2<f32>,
      u_rand_seed : f32,
      u_speed_factor : f32,
      u_drop_rate : f32,
      u_drop_rate_bump : f32,
      u_particles_res: f32,
      u_wind_res : vec2<f32>,

    }

    @binding(0) @group(0) var<uniform> params : windParams;
    @group(1) @binding(2) var u_particles : texture_2d<f32>;;
    @binding(2) @group(1) var u_wind: texture_2d<f32>;
    @binding(3) @group(1)  var outputTex : texture_storage_2d<rgba8unorm, write>;
    @binding(2) @group(1) var u_sampler: sampler;
    @binding(0) @group(2) var<storage, read> particlesA:array<vec2f>;

    const rand_constants: vec3<f32> = vec3<f32>(12.9898, 78.233, 4375.85453);

     // WGSL 不使用 "fract"，使用 "%" 替代 "fract"
     fn rand(co: vec2<f32>) -> f32 {
         let t: f32 = dot(rand_constants.xy, co);
         return t - t;
     }

     // WGSL 不使用 "texture2D"，使用 "textureSample" 替代
     fn lookup_wind(uv: vec2<f32>) -> vec2<f32> {
         let px: vec2<f32> = 1.0 / params.u_wind_res;
         let vc: vec2<f32> = floor(uv * params.u_wind_res) * px;
         let f:  vec2<f32> = fract(uv * params.u_wind_res);
         let tl: vec2<f32> = textureSample(u_wind, u_sampler, vc).rg;
         let tr: vec2<f32> = textureSample(u_wind, u_sampler, vc + vec2<f32>(px.x, 0.0)).rg;
         let bl: vec2<f32> = textureSample(u_wind, u_sampler, vc + vec2<f32>(0.0, px.y)).rg;
         let br: vec2<f32> = textureSample(u_wind, u_sampler, vc + px).rg;
         return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
     }

    // https://github.com/austinEng/Project6-Vulkan-Flocking/blob/master/data/shaders/computeparticles/particle.comp
    @compute @workgroup_size(64)
    fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
      let a_index = GlobalInvocationID.x;
      let v_tex_pos:vec2<u32> = vec2(
        fract(f32(a_index)/ params.u_particles_res),
        floor(f32(a_index) / params.u_particles_res) / params.u_particles_res) * params.u_wind_res;

        let color = textureLoad(u_particles,v_tex_pos,0);



      // 解码粒子位置
      var pos: vec2<f32> = vec2<f32>(
          color.r / 255.0 + color.b,
          color.g / 255.0 + color.a);

      // 获取风速，并根据最小值和最大值进行插值
      var velocity: vec2<f32> = mix(params.u_wind_min, params.u_wind_max, lookup_wind(pos));
      let speed_t: f32 = length(velocity) / length(params.u_wind_max);

      // 考虑EPSG:4236扭曲，计算粒子移动的偏移
      let distortion: f32 = cos(radians(pos.y * 180.0 - 90.0));
      let offset: vec2<f32> = vec2<f32>(velocity.x / distortion, -velocity.y) * 0.0001 * params.u_speed_factor;

      // 更新粒子位置，绕过日期线
      pos = pos + offset;
      pos = pos - floor(pos);

      // 用于粒子重新开始的随机种子
      let seed: vec2<f32> = (pos + v_tex_pos) * params.u_rand_seed;

      // 粒子掉落速率，防止粒子过度集中
      let drop_rate: f32 = params.u_drop_rate + speed_t * params.u_drop_rate_bump;
      let drop: f32 = step(1.0 - drop_rate, rand(seed));

      // 生成随机位置
      let random_pos: vec2<f32> = vec2<f32>(
          rand(seed + vec2<f32>(1.3, 2.1)),
          rand(seed + vec2<f32>(2.1, 1.3)));
      pos = mix(pos, random_pos, drop);

      // 将新的粒子位置编码回RGBA
      textureStore(outputTex,  v_tex_pos, vec4(fract(pos * 255.0), floor(pos * 255.0) / 255.0));
    }


    `,
    },
  });

  const numParticles = 65536;
  const particleRes = Math.ceil(Math.sqrt(numParticles));
  const numParticles2 = particleRes * particleRes;
  const particleState = new Uint8Array(numParticles2 * 4);
  for (let i = 0; i < particleState.length; i++) {
    particleState[i] = Math.floor(Math.random() * 256); // randomize the initial particle positions
  }

  const particleStateTexture0 = createTexture(device, particleRes, particleRes, particleState);
  const particleStateTexture1 = createTexture(device, particleRes, particleRes, particleState);
  const particleIndices = new Float32Array(this._numParticles);
  for (let i = 0; i < this._numParticles; i++) particleIndices[i] = i;

  const particleBuffer = device.createBuffer({
    viewOrSize: particleIndices,
    usage: BufferUsage.VERTEX | BufferUsage.STORAGE,
  });

  const imageUrl =
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*p4PURaZpM-cAAAAAAAAAAAAADmJ7AQ/original';
  const windTexture = await generateTexture(device, imageUrl);

  // const sampler = device.createSampler({
  //   addressModeU: AddressMode.CLAMP_TO_EDGE,
  //   addressModeV: AddressMode.CLAMP_TO_EDGE,
  //   minFilter: FilterMode.POINT,
  //   magFilter: FilterMode.BILINEAR,
  //   mipmapFilter: MipmapFilterMode.LINEAR,
  //   lodMinClamp: 0,
  //   lodMaxClamp: 0
  // });

  // const computePipeline = device.createComputePipeline({
  //   inputLayout: null,
  //   program: computeProgram
  // });

  // const simParams = {
  //   deltaT: 0.04,
  //   rule1Distance: 0.1,
  //   rule2Distance: 0.025,
  //   rule3Distance: 0.025,
  //   rule1Scale: 0.02,
  //   rule2Scale: 0.05,
  //   rule3Scale: 0.005
  // };

  // const uniformBuffer = device.createBuffer({
  //   viewOrSize: 7 * Float32Array.BYTES_PER_ELEMENT,
  //   usage: BufferUsage.UNIFORM
  // });

  // const bindings: Bindings[] = [];
  // for (let i = 0; i < 2; ++i) {
  //   bindings[i] = device.createBindings({
  //     pipeline: computePipeline,
  //     uniformBufferBindings: [
  //       {
  //         binding: 0,
  //         buffer: uniformBuffer,
  //         size: 7 * Float32Array.BYTES_PER_ELEMENT
  //       }
  //     ],
  //     samplerBindings: [{
  //       texture,
  //       sampler,
  //       samplerBinding: -1
  //     }],
  //     storageBufferBindings: [
  //       {
  //         binding: 0,
  //         buffer: particleBuffers[i],
  //         size: initialParticleData.byteLength
  //       },
  //       {
  //         binding: 1,
  //         buffer: particleBuffers[(i + 1) % 2],
  //         size: initialParticleData.byteLength
  //       }
  //     ]
  //   });
  // }

  // uniformBuffer.setSubData(
  //   0,
  //   new Uint8Array(
  //     new Float32Array([
  //       simParams.deltaT,
  //       simParams.rule1Distance,
  //       simParams.rule2Distance,
  //       simParams.rule3Distance,
  //       simParams.rule1Scale,
  //       simParams.rule2Scale,
  //       simParams.rule3Scale
  //     ]).buffer
  //   )
  // );

  // let id;
  // let t = 0;
  // const frame = () => {
  //   const computePass = device.createComputePass();
  //   computePass.setPipeline(computePipeline);
  //   computePass.setBindings(bindings[t % 2]);
  //   computePass.dispatchWorkgroups(Math.ceil(numParticles / 64));
  //   device.submitPass(computePass);
  //   ++t;
  //   id = requestAnimationFrame(frame);
  // };
  // const readback = device.createReadback();
  // const data = await readback.readBuffer(particleBuffers[1], 0, new Float32Array(numParticles*4));
  // console.log(data);
  // frame();

  return device;
}
