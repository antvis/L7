
import React, { useEffect, useState } from 'react';
import {
    Device,
    BufferUsage,
    BufferFrequencyHint,
    VertexStepMode,
    Buffer,
    Format,
    TextureDimension,
    PrimitiveTopology,
    TextureUsage,
    TransparentWhite,
    MipmapFilterMode,
    AddressMode,
    FilterMode,
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
                    entryPoint: 'main',
                    wgsl: `
                  struct VertexOutput {
                    @builtin(position) position : vec4<f32>,
                  }

                  @vertex 
                  fn main(
                    @location(0) pos: vec4<f32>
                  ) -> VertexOutput {
                    var output : VertexOutput;
                    var particle_pos = vec2(
                        pos.r / 255.0 + pos.b / 255.0,
                        pos.g / 255.0  + pos.a / 255.0);
                    output.position = vec4(particle_pos.xy, 0.0, 1.0);
                    return output;
                  }
            `
                },
                fragment: {
                    entryPoint: 'main',
                    wgsl: `
                  @fragment
                  fn main(
                  ) -> @location(0) vec4<f32> {
                    return vec4(1.0,0.,0.,1.0);
                  }
                 `
                }
            });

            const copmputeProgram = device.createProgram({
                compute:{
                    wgsl: `

             
                    @binding(0) @group(0) var<storage, read_write> posA : array<f32>;

                    @compute @workgroup_size(64)
                    fn main(
                        @builtin(global_invocation_id) GlobalInvocationID : vec3<u32>,
                        ) {
                      var index = GlobalInvocationID.x;
                      posA[index] = 125.0;

                    }
                `

                }

            })
            const numParticles = 6553600;
            const particleState = new Float32Array(numParticles * 4);
            for (let i = 0; i < particleState.length; i++) {
                particleState[i] = 1; // randomize the initial particle positions
            }
            
            const particleBuffers: Buffer [] = [];
            particleBuffers[0] = device.createBuffer({
                viewOrSize: particleState,
                usage: BufferUsage.STORAGE | BufferUsage.COPY_SRC | BufferUsage.COPY_DST
                // usage: BufferUsage.COPY_SRC | BufferUsage.COPY_DST
            });
            particleBuffers[1] = device.createBuffer({
                viewOrSize: particleState,
                usage:  BufferUsage.MAP_READ |  BufferUsage.COPY_DST
            });
           
           
            
          
            async function loadImage(url) {
                const imgBitmap = await createImageBitmap(await fetch(url).then(response => response.blob()));
                return imgBitmap;
              }

            // 创建纹理和纹理视图
            const image = await loadImage('https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*p4PURaZpM-cAAAAAAAAAAAAADmJ7AQ/original')
            const texture = device.createTexture({
                format: Format.U8_RGBA_NORM,
                width: image.width,
                height: image.height,
                usage: TextureUsage.SAMPLED
            });

            texture.setImageData([image]);

            const sampler = device.createSampler({
                addressModeU: AddressMode.CLAMP_TO_EDGE,
                addressModeV: AddressMode.CLAMP_TO_EDGE,
                minFilter: FilterMode.POINT,
                magFilter: FilterMode.BILINEAR,
                mipmapFilter: MipmapFilterMode.LINEAR,
                lodMinClamp: 0,
                lodMaxClamp: 0
              });
        
        
            const inputLayout = device.createInputLayout({
                vertexBufferDescriptors: [{
                    arrayStride: 4 * 4,
                    stepMode: VertexStepMode.VERTEX,
                    attributes: [
                        {
                            shaderLocation: 0,
                            offset: 0,
                            format: Format.F32_RG
                        },
                    ]
                },
                ],
                indexBufferFormat: null,
                program
            });

  

            const pipeline = device.createRenderPipeline({
                inputLayout,
                program,
                topology: PrimitiveTopology.POINTS,
                colorAttachmentFormats: [Format.U8_RGBA_RT]
            });

            const computePipeline = device.createComputePipeline({
                inputLayout: null,
                program: copmputeProgram
            });


           const computeBindings = device.createBindings({
                pipeline: computePipeline,
                storageBufferBindings: [
                    {
                        binding: 0,
                        buffer: particleBuffers[0],
                        size: numParticles * 4,
                        offset: 0,
                    },
                ]
            });
            const computePass = device.createComputePass();
            computePass.setPipeline(computePipeline);
            computePass.setBindings(computeBindings);
            computePass.dispatchWorkgroups(Math.min(Math.ceil(numParticles / 64),10240));
            device.submitPass(computePass);

            const readback = device.createReadback();
            const data = await readback.readBuffer(particleBuffers[0], 0,  new Float32Array(numParticles*4));
            
            // @ts-ignore
            console.log('data',data)
     



            const renderTarget = device.createRenderTargetFromTexture(
                device.createTexture({
                    format: Format.U8_RGBA_RT,
                    width: $canvas.width,
                    height: $canvas.height,
                    usage: TextureUsage.RENDER_TARGET
                })
            );
            device.setResourceName(renderTarget, "Main Render Target");

            // const onscreenTexture = swapChain.getOnscreenTexture();

            // const renderPass = device.createRenderPass({
            //     colorAttachment: [renderTarget],
            //     colorResolveTo: [onscreenTexture],
            //     colorClearColor: [TransparentWhite]
            // });

            // renderPass.setPipeline(pipeline);
            // renderPass.setVertexInput(
            //     inputLayout,
            //     [
            //         {
            //             buffer: particleBuffers[0]
            //         }
            //     ],
            //     null
    
            // );
            // renderPass.setViewport(0, 0, $canvas.width, $canvas.height);   
            // renderPass.setBindings(bindings);
            // renderPass.drawIndexed(6);
            // renderPass.draw(numParticles);

            // device.submitPass(renderPass);

            // Read the results
            // await particleBuffers[1].
            // (GPUMapMode.READ);
             // @ts-ignore

        //     // @ts-ignore
        //     const  gpuBuffer = particleBuffers[1].gpuBuffer;
        //    await gpuBuffer.mapAsync(GPUMapMode.READ);
        //     // @ts-ignore
        //   const result = new Float32Array(gpuBuffer.getMappedRange().slice());
      
        //   gpuBuffer.unmap();
        //   console.log('result',result)

        }
        main();

    }, [])


    return <div><canvas id='canvas' width={1000} height={500}></canvas>

    </div>

};



