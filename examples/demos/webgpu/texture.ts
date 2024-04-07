import {
  AddressMode,
  BufferFrequencyHint,
  BufferUsage,
  FilterMode,
  Format,
  MipmapFilterMode,
  TextureUsage,
  TransparentWhite,
  VertexStepMode,
  WebGPUDeviceContribution,
} from '@antv/g-device-api';
import { createTexture, generateTexture } from './utils/common';
export async function MapRender(option: { map: string; renderer: 'regl' | 'device' }) {
  const dom = document.getElementById('map') as HTMLDivElement;
  // 创建 canvas
  const $canvas = document.createElement('canvas');
  dom.appendChild($canvas);
  // 设置 canvas 大小
  $canvas.width = dom.clientWidth;
  $canvas.height = dom.clientHeight;
  const deviceContribution = new WebGPUDeviceContribution({
    shaderCompilerPath: '/glsl_wgsl_compiler_bg.wasm',
  });
  const swapChain = await deviceContribution.createSwapChain($canvas);
  swapChain.configureSwapChain($canvas.width, $canvas.height);
  const device = swapChain.getDevice();
  const program = device.createProgram({
    vertex: {
      entryPoint: 'main',
      wgsl: `
          struct VertexOutput {
            @location(1) uv: vec2<f32>,
            @builtin(position) position : vec4<f32>,

          }

        
          @vertex 
          fn main(
            @location(0) pos: vec2f,
            @location(1) uv: vec2<f32>
          ) -> VertexOutput {
            var output : VertexOutput;
            output.position = vec4(pos.xy, 0.0, 1.0);
            output.uv = uv;
            return output;
          }
    `,
    },
    fragment: {
      entryPoint: 'main',
      wgsl: `
            @group(1) @binding(1) var mySampler: sampler;
            @group(1) @binding(0) var myTexture: texture_2d<f32>;;

          @fragment
          fn main(
            @location(1) uv : vec2<f32>
          ) -> @location(0) vec4<f32> {
            return textureSample(myTexture, mySampler, uv);
          }
         `,
    },
  });

  async function loadImage(url) {
    const img = new Image();
    const imgBitmap = await createImageBitmap(await fetch(url).then((response) => response.blob()));
    return imgBitmap;
  }

  // 创建纹理和纹理视图
  const url =
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*p4PURaZpM-cAAAAAAAAAAAAADmJ7AQ/original';
  const texture = await generateTexture(device, url);
  const numParticles = 6553600;
  const particleRes = Math.ceil(Math.sqrt(numParticles));
  const numParticles2 = particleRes * particleRes;
  const particleState = new Uint8ClampedArray(numParticles2 * 4);
  for (let i = 0; i < particleState.length; i++) {
    particleState[i] = Math.floor(Math.random() * 256); // randomize the initial particle positions
  }
  const particleStateTexture0 = await createTexture(
    device,
    particleRes,
    particleRes,
    particleState,
  );

  const sampler = device.createSampler({
    addressModeU: AddressMode.CLAMP_TO_EDGE,
    addressModeV: AddressMode.CLAMP_TO_EDGE,
    minFilter: FilterMode.POINT,
    magFilter: FilterMode.BILINEAR,
    mipmapFilter: MipmapFilterMode.LINEAR,
    lodMinClamp: 0,
    lodMaxClamp: 0,
  });

  const vertexBuffer = device.createBuffer({
    viewOrSize: new Float32Array([
      -1,
      1,
      0.0,
      1.0, // 左上角
      -1,
      -1,
      0.0,
      0.0, // 左下角
      1,
      -1,
      1.0,
      0.0, // 右下角

      // 第二个三角形
      1,
      1,
      1.0,
      1.0, // 右上角
    ]),
    usage: BufferUsage.VERTEX,
    hint: BufferFrequencyHint.DYNAMIC,
  });
  device.setResourceName(vertexBuffer, 'a_Position');
  const indexBuffer = device.createBuffer({
    viewOrSize: new Uint32Array([0, 1, 2, 0, 2, 3]),
    usage: BufferUsage.INDEX,
    hint: BufferFrequencyHint.STATIC,
  });
  const inputLayout = device.createInputLayout({
    vertexBufferDescriptors: [
      {
        arrayStride: 4 * 4,
        stepMode: VertexStepMode.VERTEX,
        attributes: [
          {
            shaderLocation: 0,
            offset: 0,
            format: Format.F32_RG,
          },
          {
            shaderLocation: 1,
            offset: 4 * 2,
            format: Format.F32_RG,
          },
        ],
      },
    ],
    indexBufferFormat: Format.U32_R,
    program,
  });

  const pipeline = device.createRenderPipeline({
    inputLayout,
    program,
    colorAttachmentFormats: [Format.U8_RGBA_RT],
  });

  const bindings = device.createBindings({
    pipeline,
    samplerBindings: [
      {
        texture: particleStateTexture0,
        sampler,
      },
    ],
  });

  const renderTarget = device.createRenderTargetFromTexture(
    device.createTexture({
      format: Format.U8_RGBA_RT,
      width: $canvas.width,
      height: $canvas.height,
      usage: TextureUsage.RENDER_TARGET,
    }),
  );
  device.setResourceName(renderTarget, 'Main Render Target');

  const onscreenTexture = swapChain.getOnscreenTexture();

  const renderPass = device.createRenderPass({
    colorAttachment: [renderTarget],
    colorResolveTo: [onscreenTexture],
    colorClearColor: [TransparentWhite],
  });

  renderPass.setPipeline(pipeline);
  renderPass.setVertexInput(
    inputLayout,
    [
      {
        buffer: vertexBuffer,
      },
    ],
    {
      buffer: indexBuffer,
      offset: 0,
    },
  );
  renderPass.setViewport(0, 0, $canvas.width, $canvas.height);
  renderPass.setBindings(bindings);
  renderPass.drawIndexed(6);

  device.submitPass(renderPass);
}
