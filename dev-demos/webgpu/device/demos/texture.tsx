
import React, { useEffect, useState } from 'react';
import {
  Device,
  BufferUsage,
  BufferFrequencyHint,
  VertexStepMode,
  Format,
  AddressMode,
  TextureDimension,
  PrimitiveTopology,
  TextureUsage,
  TransparentWhite,
  MipmapFilterMode,
  FilterMode,
  TransparentBlack,
  ChannelWriteMask,
  BlendMode,
  BlendFactor,
  CullMode,
  WebGPUDeviceContribution,
} from '@antv/g-device-api';

export default () => {

  useEffect(() => {
    async function main() {
      const $canvas = document.getElementById('canvas') as HTMLCanvasElement

      const deviceContribution = new WebGPUDeviceContribution({
        shaderCompilerPath: '/glsl_wgsl_compiler_bg.wasm',
      });
      const swapChain = await deviceContribution.createSwapChain($canvas);
      swapChain.configureSwapChain($canvas.width, $canvas.height);
      const device = swapChain.getDevice();

      const program = device.createProgram({
        vertex: {
          wgsl: `
          [[location(0)]] var<in> a_Position : vec2<f32>;
          [[location(1)]] var<in> a_UV : vec2<f32>;
          [[builtin(position)]] var<out> gl_Position : vec4<f32>;
          
          var<out> v_uv : vec2<f32>;
          
          [[stage(vertex)]]
          fn main() -> void {
            v_uv = a_UV;
            gl_Position = vec4<f32>(a_Position, 0.0, 1.0);
          }
            `
        },
        fragment: {
          wgsl: 
          `
      
          [[location(0)]] var<in> v_uv : vec2<f32>;
          [[location(0)]] var<out> outputColor : vec4<f32>;
          
          [[stage(fragment)]]
          fn main() -> void {
            outputColor = textureSample(u_Texture, u_TextureSampler, v_uv);
          }
            `
        }
      });


      // 创建纹理和纹理视图
      const image = new Image();
      image.src = 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*p4PURaZpM-cAAAAAAAAAAAAADmJ7AQ/original';
      await new Promise((resolve) => {
        image.onload = () => {
          resolve(null);
        }
      })
      console.log(image)

      // const texture = device.createTexture({
      //   format: Format.U8_RGBA_NORM,
      //   width: image.width,
      //   height: image.height,
      //   usage: TextureUsage.SAMPLED
      // });
      // texture.setImageData([image]);

      const sampler = device.createSampler({
        addressModeU: AddressMode.CLAMP_TO_EDGE,
        addressModeV: AddressMode.CLAMP_TO_EDGE,
        minFilter: FilterMode.POINT,
        magFilter: FilterMode.BILINEAR,
        mipmapFilter: MipmapFilterMode.LINEAR,
        lodMinClamp: 0,
        lodMaxClamp: 0
      });


      const vertexBuffer = device.createBuffer({
        viewOrSize: new Float32Array([
          // 第一个三角形
          -0.5, 0.5,  0.0, 1.0, // 左上角  
          -0.5, -0.5, 0.0, 0.0, // 左下角
          0.5, -0.5,  1.0, 0.0, // 右下角

          // 第二个三角形
          0.5, 0.5, 1.0, 1.0,// 右上角
          // 0.5, 0.5, 1.0, 1.0,// 右上角
          // 0.5, 0.5, 1.0, 1.0,// 右上角

        ]),
        usage: BufferUsage.VERTEX,
        hint: BufferFrequencyHint.DYNAMIC

      });
      device.setResourceName(vertexBuffer, "a_Position");
      const indexBuffer = device.createBuffer({
        viewOrSize: new Uint32Array([0, 1, 2, 0, 2, 3]),
        usage: BufferUsage.INDEX,
        hint: BufferFrequencyHint.STATIC
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
                format: Format.F32_RG
              },
              {
                shaderLocation: 1,
                offset: 2 * 4,
                format: Format.F32_RG
              }
            ]
          }
        ],
        indexBufferFormat: Format.U32_R,
        program
      });

      const pipeline = device.createRenderPipeline({
        inputLayout,
        program,
        colorAttachmentFormats: [Format.U8_RGBA_RT]
      });

      // const bindings = device.createBindings({
      //   pipeline,
      //   samplerBindings: [
      //     {
      //       texture,
      //       sampler
      //     }
      //   ]
      // });

      const renderTarget = device.createRenderTargetFromTexture(
        device.createTexture({
          format: Format.U8_RGBA_RT,
          width: $canvas.width,
          height: $canvas.height,
          usage: TextureUsage.RENDER_TARGET
        })
      );
      device.setResourceName(renderTarget, "Main Render Target");

      const onscreenTexture = swapChain.getOnscreenTexture();

      const renderPass = device.createRenderPass({
        colorAttachment: [renderTarget],
        colorResolveTo: [onscreenTexture],
        colorClearColor: [TransparentWhite]
      });

      renderPass.setPipeline(pipeline);
      renderPass.setVertexInput(
        inputLayout,
        [
          {
            buffer: vertexBuffer
          }
        ],
        {
          buffer: indexBuffer,
          offset: 0
        }
      );
      renderPass.setViewport(0, 0, $canvas.width, $canvas.height);
      // renderPass.setBindings(bindings);
      renderPass.drawIndexed(6);
      device.submitPass(renderPass);



    }
    main();

  }, [])


  return <div><canvas id='canvas' width={1000} height={500}></canvas>

  </div>

};



