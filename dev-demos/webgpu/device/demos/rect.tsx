
import React, { useEffect, useState } from 'react';
import {
    Device,
    BufferUsage,
    BufferFrequencyHint,
    VertexStepMode,
    Format,
    TextureDimension,
    PrimitiveTopology,
    TextureUsage,
    TransparentWhite,
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
                  entryPoint:'main',
                  wgsl: `
                  struct VertexOutput {
                    @builtin(position) position : vec4<f32>,
                  }
                  
                  @vertex 
                  fn main(
                    @location(0) pos: vec2f,
                  ) -> VertexOutput {
                    var output : VertexOutput;
                    output.position = vec4(pos.xy, 0.0, 1.0);
                    return output;
                  }
            `
                },
                fragment: {
                  entryPoint:'main',
                  wgsl: `
                  @fragment
                  fn main() -> @location(0) vec4<f32> {
                    return vec4<f32>(1.0, 0.0, 0.0, 0.5);
                  }
                 `
                }
              });
            
              const vertexBuffer = device.createBuffer({
                viewOrSize: new Float32Array([
                    // 第一个三角形
                    -0.5,  0.5, // 左上角
                    -0.5, -0.5, // 左下角
                     0.5, -0.5, // 右下角
                
                    // 第二个三角形
                    0.5,  0.5, // 右上角
          
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
                vertexBufferDescriptors:[ {
                  arrayStride: 4 * 2,
                  stepMode: VertexStepMode.VERTEX,
                  attributes: [
                    {
                      shaderLocation: 0,
                      offset: 0,
                      format: Format.F32_RG
                    }
                  ]
                },
              ],
              indexBufferFormat: Format.U32_R,
                program
              });
            
              const pipeline = device.createRenderPipeline({
                inputLayout,
                program,
                colorAttachmentFormats: [Format.U8_RGBA_RT]
              });
            
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
              renderPass.drawIndexed(6);
            
              device.submitPass(renderPass);
            
             

        }
        main();

    }, [])


    return <div><canvas id='canvas' width={1000} height={500}></canvas>

    </div>

};



